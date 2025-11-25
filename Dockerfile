# Dockerfile simplifié - Build local avant Docker
# Prérequis: Exécuter build-and-run.ps1 avant de construire l'image
FROM mysql:8
ENV DEBIAN_FRONTEND=noninteractive

# Installation des dépendances
RUN apt-get update && apt-get install -y \
    openjdk-17-jre \
    mysql-server \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Configuration MySQL
RUN mkdir -p /var/run/mysqld && \
    chown -R mysql:mysql /var/run/mysqld && \
    chown -R mysql:mysql /var/lib/mysql

# Création de la base de données
RUN service mysql start && \
    mysql -e "CREATE DATABASE IF NOT EXISTS eventapp;" && \
    mysql -e "CREATE USER IF NOT EXISTS 'eventapp'@'localhost' IDENTIFIED BY 'eventapp123';" && \
    mysql -e "GRANT ALL PRIVILEGES ON eventapp.* TO 'eventapp'@'localhost';" && \
    mysql -e "FLUSH PRIVILEGES;" && \
    service mysql stop

# Configuration Backend
WORKDIR /app
COPY backend/target/*.jar app.jar
COPY backend/src/main/resources/application.properties /app/application.properties

# Mise à jour des propriétés de connexion MySQL
RUN sed -i 's/spring.datasource.url=.*/spring.datasource.url=jdbc:mysql:\/\/localhost:3306\/eventapp?useSSL=false\&allowPublicKeyRetrieval=true\&serverTimezone=UTC/' /app/application.properties && \
    sed -i 's/spring.datasource.username=.*/spring.datasource.username=eventapp/' /app/application.properties && \
    sed -i 's/spring.datasource.password=.*/spring.datasource.password=eventapp123/' /app/application.properties

# Configuration Frontend (Nginx)
COPY react-app/dist /usr/share/nginx/html

# Configuration Nginx pour React Router
RUN echo 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location /api {\n\
        proxy_pass http://localhost:8080;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
    }\n\
\n\
    location /swagger-ui.html {\n\
        proxy_pass http://localhost:8080;\n\
        proxy_set_header Host $host;\n\
    }\n\
\n\
    location /api-docs {\n\
        proxy_pass http://localhost:8080;\n\
        proxy_set_header Host $host;\n\
    }\n\
}' > /etc/nginx/sites-available/default

# Configuration Supervisord
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
\n\
[program:mysql]\n\
command=/usr/bin/mysqld_safe\n\
user=mysql\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/var/log/mysql-stdout.log\n\
stderr_logfile=/var/log/mysql-stderr.log\n\
priority=1\n\
\n\
[program:backend]\n\
command=java -jar /app/app.jar --spring.config.location=file:/app/application.properties\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/var/log/backend-stdout.log\n\
stderr_logfile=/var/log/backend-stderr.log\n\
priority=2\n\
startsecs=30\n\
\n\
[program:nginx]\n\
command=/usr/sbin/nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/var/log/nginx-stdout.log\n\
stderr_logfile=/var/log/nginx-stderr.log\n\
priority=3\n\
' > /etc/supervisor/conf.d/supervisord.conf

# Script de démarrage
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Initialiser MySQL si nécessaire\n\
if [ ! -d "/var/lib/mysql/eventapp" ]; then\n\
    echo "Initialisation de MySQL..."\n\
    service mysql start\n\
    sleep 5\n\
    mysql -e "CREATE DATABASE IF NOT EXISTS eventapp;"\n\
    mysql -e "CREATE USER IF NOT EXISTS '\''eventapp'\''@'\''localhost'\'' IDENTIFIED BY '\''eventapp123'\'';" || true\n\
    mysql -e "GRANT ALL PRIVILEGES ON eventapp.* TO '\''eventapp'\''@'\''localhost'\'';" \n\
    mysql -e "FLUSH PRIVILEGES;"\n\
    service mysql stop\n\
    sleep 2\n\
fi\n\
\n\
# Démarrer supervisord\n\
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf\n\
' > /start.sh && chmod +x /start.sh

EXPOSE 80 8080 3306

CMD ["/start.sh"]
