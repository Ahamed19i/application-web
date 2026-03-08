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

## ☁️ Déploiement sur Railway (Recommandé pour le Cloud)

Railway supporte très bien les serveurs Node.js avec SQLite si vous ajoutez un "Volume" pour la persistance.

1. Connectez votre GitHub à [Railway.app](https://railway.app).
2. Créez un nouveau projet à partir de votre dépôt.
3. Dans les **Variables**, ajoutez :
   - `NODE_ENV=production`
   - `JWT_SECRET=votre_secret_aleatoire`
4. Dans **Settings**, assurez-vous que la commande de démarrage est `npm start`.
5. **Important** : Ajoutez un "Volume" monté sur `/app/database.sqlite` pour ne pas perdre vos données à chaque redémarrage.

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
