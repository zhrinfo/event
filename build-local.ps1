# Script de build local pour Windows PowerShell
# Ce script build le backend et le frontend avant de créer l'image Docker

Write-Host "=== Build de l'application EventApp ===" -ForegroundColor Green

# Build du Frontend React
Write-Host "`n[1/3] Build du Frontend React..." -ForegroundColor Cyan
Set-Location react-app
if (Test-Path "node_modules") {
    Write-Host "node_modules existe déjà, skip npm install" -ForegroundColor Yellow
} else {
    Write-Host "Installation des dépendances npm..." -ForegroundColor Yellow
    npm install
}
Write-Host "Build du frontend..." -ForegroundColor Yellow
npm run build
Set-Location ..

# Build du Backend Spring Boot
Write-Host "`n[2/3] Build du Backend Spring Boot..." -ForegroundColor Cyan
Set-Location backend
Write-Host "Compilation avec Maven..." -ForegroundColor Yellow
mvn clean package -DskipTests
Set-Location ..

# Build de l'image Docker
Write-Host "`n[3/3] Build de l'image Docker..." -ForegroundColor Cyan
docker-compose build

Write-Host "`n=== Build terminé avec succès! ===" -ForegroundColor Green
Write-Host "`nPour démarrer l'application:" -ForegroundColor Yellow
Write-Host "  docker-compose up" -ForegroundColor White
Write-Host "`nPour arrêter l'application:" -ForegroundColor Yellow
Write-Host "  docker-compose down" -ForegroundColor White
