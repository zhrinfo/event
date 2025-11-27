terraform {
  required_providers {
    local = {
      source = "hashicorp/local"
      version = "~> 2.4"
    }
  }
  required_version = ">= 1.2.0"
}

# Provider local pour les opérations de système de fichiers
provider "local" {}

# Création d'un fichier de configuration local
resource "local_file" "config" {
  filename = "${path.module}/config.json"
  content = jsonencode({
    environment  = var.environment
    project_name = var.project_name
    vpc_cidr     = var.vpc_cidr
    public_subnets = var.public_subnets
    private_subnets = var.private_subnets
  })
  
  file_permission = "0644"
}

# Affichage des informations de configuration
output "configuration" {
  value = {
    environment  = var.environment
    project_name = var.project_name
    config_file  = local_file.config.filename
  }
}

# Les sorties sont définies dans outputs.tf
