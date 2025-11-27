# Infrastructure as Code avec Terraform

Ce répertoire contient la configuration Terraform pour déployer l'infrastructure de l'application Event App sur AWS.

## Structure

- `main.tf` - Configuration principale Terraform
- `variables.tf` - Variables d'entrée
- `outputs.tf` - Variables de sortie
- `modules/` - Modules Terraform réutilisables
  - `common/` - Ressources réseau de base (VPC, sous-réseaux, etc.)

## Prérequis

1. Installer Terraform (version >= 1.2.0)
2. Configurer les identifiants AWS (via AWS CLI ou variables d'environnement)
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_DEFAULT_REGION (optionnel, par défaut: eu-west-3)

## Utilisation

1. Initialiser Terraform :
   ```bash
   terraform init
   ```

2. Vérifier le plan d'exécution :
   ```bash
   terraform plan
   ```

3. Appliquer les changements :
   ```bash
   terraform apply
   ```

## Variables

Les variables peuvent être définies dans un fichier `terraform.tfvars` ou via des variables d'environnement.

Exemple de `terraform.tfvars` :

```hcl
environment = "dev"
project_name = "event-app"
aws_region = "eu-west-3"
```

## Modules

### Module Commun

Crée les ressources réseau de base :
- VPC
- Sous-réseaux publics et privés
- Internet Gateway
- Tables de routage
- Groupes de sécurité de base

## Sécurité

- Ne jamais stocker de secrets dans le code
- Utiliser un backend distant pour stocker l'état Terraform (comme S3 avec verrouillage DynamoDB)
- Limiter les permissions IAM au strict nécessaire

## Bonnes pratiques

- Toujours exécuter `terraform plan` avant d'appliquer des changements
- Utiliser des workspaces pour gérer différents environnements
- Versionner le code d'infrastructure avec Git
- Documenter toutes les variables et sorties

## Prochaines étapes

1. Ajouter la configuration pour déployer l'application
2. Configurer un backend distant pour le stockage de l'état
3. Mettre en place des pipelines CI/CD
4. Ajouter des modules pour les bases de données et autres services
