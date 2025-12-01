param()

Write-Host "======================================"
Write-Host "SonarQube Analysis Script"
Write-Host "======================================"
Write-Host ""

$SONAR_HOST = "http://localhost:9000"
$SONAR_TOKEN = "squ_b948ccb3f09cd3945e4f1fa3f0ea2da1acf6e1f1"
$PROJECT_PATH = "d:\event\backend"

Write-Host "Step 1 - Verification de SonarQube..."
try {
    $response = Invoke-WebRequest -Uri "$SONAR_HOST/api/system/status" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "OK - SonarQube est en ligne"
} catch {
    Write-Host "ERREUR - SonarQube n'est pas accessible"
    Write-Host "Lancez : docker compose -f .\docker-compose.sonarqube.yml up -d"
    exit 1
}

Write-Host ""
Write-Host "Step 2 - Navigation et compilation..."
cd $PROJECT_PATH
mvn clean verify -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR - Compilation echouee"
    exit 1
}
Write-Host "OK - Compilation reussie"

Write-Host ""
Write-Host "Step 3 - Analyse SonarQube en cours..."
mvn sonar:sonar "-Dsonar.host.url=$SONAR_HOST" "-Dsonar.login=$SONAR_TOKEN"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR - Analyse echouee"
    exit 1
}

Write-Host ""
Write-Host "======================================"
Write-Host "OK - Analyse terminee !"
Write-Host "======================================"
Write-Host ""
Write-Host "Ouvrez : http://localhost:9000"
Write-Host ""
