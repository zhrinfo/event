output "config_file" {
  description = "Chemin vers le fichier de configuration généré"
  value       = local_file.config.filename
}

output "project_name" {
  description = "Nom du projet"
  value       = var.project_name
}

output "environment" {
  description = "Environnement de déploiement"
  value       = var.environment
}
