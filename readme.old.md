# LegaPro

Application web moderne de gestion de cabinet d'avocat permettant de gérer efficacement les clients, dossiers, procédures, factures et tâches.

## Technologies

- **Frontend Framework**: React 19.2
- **Langage**: TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: TailwindCSS 4.1
- **State Management**: Zustand 5.0
- **Routing**: React Router 7.10
- **HTTP Client**: Axios 1.13
- **Internationalisation**: i18next 25.7 + react-i18next 16.4
- **Calendrier**: react-big-calendar 1.19
- **Génération PDF**: html2pdf.js 0.12
- **QR Code**: qrcode.react 4.2
- **PWA**: vite-plugin-pwa 1.2

## Fonctionnalités

### Gestion des entités
- **Clients**: Création, modification, consultation des informations clients
- **Dossiers**: Gestion complète des dossiers juridiques avec suivi d'état
- **Procédures**: Suivi des procédures juridiques
- **Adversaires**: Gestion des parties adverses
- **Documents**: Upload et gestion des documents associés aux dossiers
- **Notes**: Prise de notes sur les dossiers

### Facturation
- Création et gestion de factures
- Ajout de frais tiers
- Génération de factures PDF
- Statistiques de facturation
- Prévisualisation et export

### Tâches et calendrier
- Création et suivi des tâches
- Calendrier interactif avec visualisation des événements
- Affectation de tâches aux utilisateurs

### Utilisateurs et droits
- Système d'authentification
- Gestion des avocats et utilisateurs
- Affectation de dossiers aux avocats
- Profils utilisateurs

### Interface utilisateur
- Dashboard avec statistiques et métriques
- Support multilingue (i18n)
- Thèmes personnalisables
- Interface responsive
- Mode PWA (Progressive Web App)
- Notifications et alertes

## Structure du projet

```
legalpro-web/
├── src/
│   ├── components/          # Composants React réutilisables
│   │   ├── common/         # Composants communs (LanguageSwitcher, ThemeSelector, etc.)
│   │   ├── features/       # Composants spécifiques aux fonctionnalités
│   │   │   ├── clients/
│   │   │   ├── dossiers/
│   │   │   ├── factures/
│   │   │   ├── documents/
│   │   │   ├── taches/
│   │   │   └── utilisateurs/
│   │   └── layouts/        # Layouts (DashboardLayout)
│   ├── config/             # Fichiers de configuration
│   │   ├── api.config.ts   # Configuration API et endpoints
│   │   ├── i18n.config.ts  # Configuration i18n
│   │   ├── routes.config.ts
│   │   └── themes.config.ts
│   ├── contexts/           # React Contexts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Pages de l'application
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── dossiers/
│   │   ├── factures/
│   │   ├── taches/
│   │   ├── documents/
│   │   ├── calendrier/
│   │   └── utilisateurs/
│   ├── services/           # Services API
│   ├── stores/             # Zustand stores
│   ├── styles/             # Fichiers CSS globaux
│   ├── types/              # Définitions TypeScript
│   └── main.tsx            # Point d'entrée
├── public/                 # Assets statiques
└── package.json
```

## Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

### Variables d'environnement

Créer un fichier `.env` à la racine du projet:

```env
VITE_API_URL=https://legalpro-api.onrender.com/api
```

## Scripts disponibles

### Développement

Lance le serveur de développement avec hot reload:

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

Compile TypeScript et build l'application pour la production:

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

### Prévisualisation

Prévisualise le build de production localement:

```bash
npm run preview
```

### Linting

Exécute ESLint pour vérifier la qualité du code:

```bash
npm run lint
```

## API Backend

L'application communique avec une API backend hébergée sur Render:
- URL de production: `https://legalpro-api.onrender.com/api`

### Endpoints principaux

- `/auth/*` - Authentification
- `/avocats/*` - Gestion des avocats
- `/clients/*` - Gestion des clients
- `/dossiers/*` - Gestion des dossiers
- `/procedures/*` - Gestion des procédures
- `/taches/*` - Gestion des tâches
- `/factures/*` - Gestion des factures
- `/documents/*` - Gestion des documents
- `/adversaires/*` - Gestion des adversaires
- `/alertes/*` - Système d'alertes

## Déploiement

L'application est configurée pour être déployée sur Netlify (voir [netlify.toml](netlify.toml)).

### Configuration Netlify

Le fichier `netlify.toml` contient la configuration de déploiement avec:
- Commande de build: `npm run build`
- Répertoire de publication: `dist`
- Redirections pour le SPA

## Progressive Web App (PWA)

L'application supporte le mode PWA permettant:
- Installation sur mobile et desktop
- Fonctionnement offline (avec cache)
- Mises à jour automatiques
- Cache des requêtes API

## Internationalisation

L'application supporte plusieurs langues via i18next. Les fichiers de traduction sont gérés dans la configuration i18n.

## Licence

Projet privé - Tous droits réservés
