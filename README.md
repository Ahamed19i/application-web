# Portfolio Ahamed Hassani M'homa - Guide d'Installation et Déploiement

Ce projet est une application Full-Stack (React + Node.js/Express) utilisant SQLite comme base de données.

## 💻 Installation et Test en Local

Pour faire tourner ce projet sur votre propre ordinateur :

### 1. Prérequis
- **Node.js** (v18 ou plus récent) installé.
- Un terminal (Bash, PowerShell, ou CMD).

### 2. Installation
```bash
# 1. Allez dans le dossier du projet
cd portfolio-ahamed

# 2. Installez toutes les dépendances
npm install

# 3. Configurez l'environnement
cp .env.example .env
# (Optionnel) Modifiez le JWT_SECRET dans le fichier .env
```

### 3. Lancement (Mode Développement)
C'est le mode recommandé pour tester et faire des modifications.
```bash
npm run dev
```
Le site sera accessible sur `http://localhost:3000`.

### 4. Lancement (Mode Production / Simulation Déploiement)
Pour tester le site exactement comme il sera sur un serveur :
```bash
# 1. Compilez le frontend
npm run build

# 2. Lancez le serveur de production
npm start
```
*Note : J'ai corrigé l'erreur `__dirname is not defined` qui survient parfois avec les modules ES dans Node.js récent. Si vous aviez cette erreur, elle est maintenant résolue dans le code.*

---

## 🚀 Déploiement Réel (VPS Linux)
... (reste du contenu précédent) ...

La méthode la plus recommandée pour cette stack (à cause de SQLite) est un VPS (DigitalOcean, AWS EC2, OVH, etc.).

### 1. Prérequis
- Node.js (v18+) installé sur le serveur.
- Un gestionnaire de processus comme **PM2**.

### 2. Étapes sur le serveur
```bash
# Cloner le projet
git clone <votre-repo-url>
cd portfolio-ahamed

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# ÉDITER le fichier .env avec vos secrets (JWT_SECRET, etc.)
nano .env

# Construire le frontend
npm run build

# Lancer le serveur avec PM2
pm2 start server.ts --interpreter tsx --name "portfolio"
```

---

## ☁️ Déploiement sur Railway (Recommandé)

Railway est idéal car il supporte Node.js et permet de garder vos données SQLite. Ils offrent un forfait "Trial" gratuit (environ 500h/mois ou 5$ de crédit).

### 1. Préparation
- Assurez-vous d'avoir envoyé votre code sur **GitHub**.
- Créez un compte sur [Railway.app](https://railway.app) avec votre GitHub.

### 2. Création du Projet
1. Cliquez sur **"New Project"** -> **"Deploy from GitHub repo"**.
2. Sélectionnez votre dépôt `portfolio-ahamed`.
3. Cliquez sur **"Variables"** et ajoutez :
   - `NODE_ENV=production`
   - `JWT_SECRET=votre_secret_aleatoire` (une longue phrase compliquée)
   - `DATABASE_PATH=/app/data/database.sqlite`

### 3. Persistance des Données (Très Important pour SQLite)
Par défaut, Railway efface les fichiers à chaque mise à jour. Pour garder vos projets et articles :
1. Allez dans l'onglet **"Settings"** de votre service sur Railway.
2. Cherchez la section **"Volumes"**.
3. Cliquez sur **"Add Volume"**.
4. Nommez-le `data` et montez-le sur le chemin : `/app/data`.
5. Railway va redéployer. Vos données seront désormais sauvegardées dans ce dossier permanent !

---

## 🛠️ Configuration de Production

### Variables d'Environnement (.env)
Assurez-vous de définir ces variables en production :
- `JWT_SECRET` : Une longue chaîne aléatoire pour sécuriser les sessions admin.
- `NODE_ENV` : `production`.

### Sécurité
- Le serveur Express est configuré pour servir les fichiers statiques du dossier `dist/` en mode production.
- Les mots de passe sont hachés avec `bcryptjs`.
- Les routes API sensibles sont protégées par JWT.

## 📦 Scripts disponibles
- `npm run dev` : Lance le serveur de développement (Vite + Express).
- `npm run build` : Compile le frontend React pour la production.
- `npm start` : Lance le serveur en mode production (nécessite d'avoir fait le build).
