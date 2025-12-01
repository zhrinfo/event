# SonarQube local setup and analysis

This file explains how to run SonarQube locally and analyze this project.

Prerequisites

- Docker and Docker Compose available on your machine.
- Java/Maven installed for running the analysis (or use a Maven container).

1. Start SonarQube and Postgres (PowerShell)

```powershell
# start SonarQube + Postgres
docker compose -f .\docker-compose.sonarqube.yml up -d

# watch SonarQube logs until it reports it's up (optional)
docker compose -f .\docker-compose.sonarqube.yml logs -f sonarqube
```

Default UI: http://localhost:9000
Default initial credentials: admin / admin (you will be prompted to change the password on first login).

2. Create a token for analysis

- Log in to SonarQube web UI and create a user token (My Account -> Security -> Generate Tokens). Copy it.

3. Build project artifacts

Backend (Maven):

```powershell
cd .\backend
mvn clean verify
```

Frontend (optional, if you want frontend analysis):

```powershell
cd ..\react-app
npm install
npm run build
```

4. Run Sonar analysis (PowerShell)

```powershell
cd .\backend
mvn sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.login=<YOUR_TOKEN>
```

Notes and tips

- The Maven plugin was added to `backend/pom.xml`; the repository also contains `sonar-project.properties` with project-level defaults.
- You can override any property at runtime with `-D` flags, for example the token or host URL.
- SonarQube requires ~2GB+ RAM to run comfortably. If you get JVM OOM errors, increase Docker memory or tune the service.
- If you prefer using the `sonar-scanner` CLI instead of the Maven plugin (for JS/TS analysis), install it and run it from repository root; use `sonar.login` token as above.

If you want, I can also add a CI job (GitHub Actions) that runs Sonar on pull requests. Tell me which CI you use.
