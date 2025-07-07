## 🚀 Installation et Configuration

### Prérequis

- **Node.js** version 22 minimum
- **Bun** (gestionnaire de paquets)
- **Docker** et **Docker Compose**

### Étapes d'installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd civalgo
```

2. **Démarrer les services Docker**

```bash
docker-compose up -d
```

Ça va lancer tous les services nécessaires :

- PostgreSQL sur le port 5432
- Redis sur le port 6379
- Proxy Neon local sur le port 4444
- Serveur Redis HTTP sur le port 8079

3. **Installer les dépendances**

```bash
bun install
```

4. **Lancer l'application**

```bash
bun dev
```

Cette commande fait tout le boulot automatiquement :

- Génère les migrations de base de données
- Exécute les migrations
- Démarre le serveur de développement

L'application sera accessible sur `http://localhost:3000`

> **⚠️ Important** : Quand tu ajoutes un nouvel ouvrier, son mot de passe par défaut est **12345678**. Pense à le changer dès la première connexion ! Les comptes créés via l'inscription directe ont le rôle "superviseur" par défaut, tandis que les comptes créés via "Ajouter un ouvrier" ont le rôle "worker".

## 🏗️ Architecture du Projet

### Stack Technique

- **Frontend** : React 19, Next.js 15, TypeScript
- **Backend** : tRPC, Node.js
- **Base de données** : PostgreSQL avec Drizzle ORM
- **Authentification** : Better Auth
- **UI** : Tailwind CSS + composants personnalisés
- **Gestion d'état** : Zustand
- **Monorepo** : Turborepo avec Bun

### Structure des packages

```
packages/
├── authentication/    # Gestion de l'authentification
├── database/         # Schémas et types de base de données
├── gateway/          # API tRPC et logique métier
└── ui/              # Composants UI réutilisables
```

### Système de Pointage

- **Pointage d'entrée/sortie** : Les ouvriers arrivent, ils pointent. Ils repartent, ils pointent aussi
- **Sélection de chantier** : Ils choisissent sur quel site ils bossent
- **Validation en temps réel** : Impossible de pointer deux fois, j'ai pensé à tout
- **Suivi des statuts** : On voit direct qui est là et qui n'y est pas

### Tableau de Bord Superviseur

- **Liste des ouvriers actifs** : Vue en temps réel de qui est sur le chantier
- **Mise à jour automatique** : Ça se rafraîchit toutes les 5 secondes, pas besoin de F5
- **Pagination** : Même avec 100 ouvriers, ça reste fluide

### Historique des Pointages

- **Suivi complet** : Chaque pointage est enregistré avec l'heure précise

### Gestion des Ouvriers

- **Ajout d'ouvriers** : Interface simple pour créer de nouveaux profils
- **Correspondance automatique** : Le système fait le lien entre les comptes et les profils
- **Validation des données** : Pas moyen de créer un profil avec des infos incomplètes
- **Gestion des droits** : On différencie bien les ouvriers des superviseurs

### Gestion Multi-Sites

- **Sites de construction** : Tu peux gérer plusieurs chantiers en même temps
- **Codes de site** : Chaque chantier a son code unique
- **Statuts actifs/inactifs** : Tu peux désactiver un site terminé

## 📊 Base de Données

### Schéma Principal

- **users** : Comptes utilisateurs avec authentification
- **workers** : Profils ouvriers avec informations de contact
- **construction_sites** : Sites de construction
- **check_ins** : Pointages avec horodatage et statuts
- **sessions/accounts** : Gestion des sessions utilisateur

### Migrations

Les migrations sont automatiquement générées et exécutées au démarrage avec `bun dev`.

## 🚦 Commandes Utiles

```bash
# Développement
bun dev                    # Démarrer en mode développement

# Base de données
bun db:generate           # Générer les migrations
bun db:migrate            # Exécuter les migrations
bun db:studio             # Interface d'administration

# Build
bun build                 # Build de production
bun start                 # Démarrer en production

# Linting
bun lint                  # Vérifier le code
bun lint:fix             # Corriger automatiquement
```
