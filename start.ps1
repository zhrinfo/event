# Script de démarrage rapide
Write-Host "=== Démarrage de EventApp ===" -ForegroundColor Green

# Vérifier si les builds existent
$backendJar = Test-Path "backend/target/*.jar"
$frontendDist = Test-Path "react-app/dist"

if (-not $backendJar -or -not $frontendDist) {
    Write-Host "`nPremière utilisation détectée. Lancement du build complet..." -ForegroundColor Yellow
    .\build-local.ps1
} else {
    Write-Host "`nBuilds existants détectés. Démarrage direct..." -ForegroundColor Yellow
}

Write-Host "`nDémarrage des conteneurs..." -ForegroundColor Cyan
docker-compose up
