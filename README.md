# 🗺️ GeoLoc - Application de Partage de Lieux

Une application web moderne et communautaire pour découvrir et partager les meilleurs lieux de divertissement et de restauration.

![GeoLoc Preview](https://via.placeholder.com/800x400/ec4899/ffffff?text=GeoLoc+-+Partagez+vos+lieux+favoris)

## ✨ Fonctionnalités

### 🎯 Fonctionnalités principales
- **Ajout de lieux** : Créez des lieux avec géolocalisation, photos, notes et commentaires
- **Carte interactive** : Visualisez tous les lieux sur une carte LeafletJS
- **Système de notation** : Notez les lieux de 1 à 5 étoiles
- **Upload d'images** : Ajoutez des photos depuis la galerie ou prenez une photo en temps réel
- **Interface moderne** : Design inspiré d'Instagram avec animations fluides
- **Responsive** : Optimisé pour mobile et desktop

### 🔐 Authentification
- Connexion par email/mot de passe
- Liens magiques (connexion sans mot de passe)
- Support prévu pour Google et Facebook (à configurer)

### 🗃️ Base de données
- **Profils utilisateurs** : Gestion des comptes avec Row Level Security
- **Lieux** : Stockage des lieux avec coordonnées GPS
- **Commentaires** : Système de commentaires et notes
- **Favoris** : Sauvegarde des lieux préférés
- **Signalements** : Système de modération communautaire

## 🚀 Installation et Déploiement

### Prérequis
- Node.js 16+
- Compte Supabase
- Compte GitHub (optionnel pour déploiement)
- Compte Vercel (pour déploiement)

### 1. Clone du projet
```bash
git clone <votre-repo>
cd geoloc-app
```

### 2. Installation des dépendances
```bash
yarn install
```

### 3. Configuration Supabase

#### A. Créer les tables
1. Connectez-vous à votre [console Supabase](https://eskswatziioxurxzmnxy.supabase.co)
2. Ouvrez l'éditeur SQL
3. Suivez les instructions dans le fichier `SUPABASE_SETUP.md`
4. Exécutez tous les scripts SQL fournis

#### B. Variables d'environnement
Le fichier `.env` est déjà configuré avec vos informations :
```
REACT_APP_SUPABASE_URL=https://eskswatziioxurxzmnxy.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Lancement en développement
```bash
yarn start
```
L'application sera accessible sur http://localhost:3000

### 5. Build de production
```bash
yarn build
```

## 🚀 Déploiement sur Vercel

### Méthode 1 : Interface web
1. Pushez votre code sur GitHub
2. Connectez-vous sur [Vercel](https://vercel.com)
3. Importez votre repository GitHub
4. Ajoutez les variables d'environnement :
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Déployez !

### Méthode 2 : CLI Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour les déploiements suivants
vercel --prod
```

## 🎨 Stack Technique

- **Frontend** : React 18 + Hooks
- **Styling** : Tailwind CSS + CSS personnalisé
- **Animations** : Framer Motion
- **Cartes** : LeafletJS + React-Leaflet
- **Backend** : Supabase (PostgreSQL + Auth + API)
- **Icons** : Lucide React
- **Notifications** : React Hot Toast
- **Déploiement** : Vercel

## 📱 Fonctionnalités Mobile

- Design responsive mobile-first
- Support des gestes tactiles sur la carte
- Upload de photos depuis la galerie
- Prise de photo en temps réel avec la caméra
- Interface optimisée pour les écrans tactiles

## 🛠️ Configuration Avancée

### Authentification sociale (optionnel)

Pour activer Google et Facebook :

1. **Google OAuth**
   - Allez dans Supabase → Authentication → Settings
   - Activez Google provider
   - Configurez avec vos clés OAuth Google

2. **Facebook OAuth**
   - Allez dans Supabase → Authentication → Settings  
   - Activez Facebook provider
   - Configurez avec vos clés OAuth Facebook

### Variables d'environnement personnalisées

Créez un fichier `.env.local` pour le développement :
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
REACT_APP_ANALYTICS_ID=your_analytics_id
```

## 📊 Utilisation

### Pour les utilisateurs
1. **S'inscrire/Se connecter** via email ou lien magique
2. **Explorer la carte** pour découvrir les lieux partagés
3. **Ajouter un lieu** en cliquant sur la carte puis sur "Ajouter un lieu"
4. **Noter et commenter** les lieux découverts
5. **Sauvegarder** ses lieux favoris

### Pour les administrateurs
- Accès aux signalements via la base Supabase
- Modération des contenus inappropriés
- Gestion des utilisateurs via l'interface Supabase

## 🐛 Dépannage

### Erreurs courantes

**Erreur de connexion Supabase :**
```
Missing Supabase environment variables
```
→ Vérifiez que les variables `.env` sont correctement configurées

**Erreur de base de données :**
```
relation "places" does not exist
```
→ Exécutez les scripts SQL du fichier `SUPABASE_SETUP.md`

**Problème de géolocalisation :**
→ Vérifiez que le navigateur autorise la géolocalisation
→ Testez sur HTTPS en production

### Logs de débogage
```bash
# Vérifier les logs React
yarn start

# Vérifier les erreurs Supabase
# → Console navigateur → Network → Requêtes échouées
```

## 🔮 Roadmap

### Version 1.1
- [ ] Authentification Google/Facebook
- [ ] Système de favoris
- [ ] Recherche et filtres avancés
- [ ] Mode hors ligne (PWA)

### Version 1.2
- [ ] Chat entre utilisateurs
- [ ] Recommandations personnalisées
- [ ] Import/Export de lieux
- [ ] API publique

### Version 1.3
- [ ] Mode sombre
- [ ] Multi-langues
- [ ] Notifications push
- [ ] Application mobile native

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Pushez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email** : [votre-email@exemple.com]
- **GitHub Issues** : [URL de votre repo]/issues
- **Documentation Supabase** : https://supabase.com/docs

---

**Fait avec ❤️ et React par [Votre Nom]**
