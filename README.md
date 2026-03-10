# AfriPrix - Plateforme de comparaison de prix locale

AfriPrix est une application web qui permet de comparer les prix des produits dans les magasins locaux (supermarchés, pharmacies, boutiques, marchés).

## 🚀 Fonctionnalités

### Pour tous les utilisateurs
- **Recherche de produits** : Trouvez rapidement les produits et leurs prix
- **Comparaison de prix** : Visualisez les prix dans différents magasins
- **Carte des magasins** : Localisez les magasins sur une carte interactive
- **Tri et filtrage** : Triez par prix, date, ou filtrez par ville

### Pour les utilisateurs connectés
- **Ajout de prix** : Contribuez en ajoutant des prix que vous trouvez
- **Modification de prix** : Mettez à jour les prix obsolètes
- **Signalement** : Signalez les prix incorrects
- **Dashboard personnel** : Suivez vos contributions

## 🛠 Stack technique

### Frontend
- **React 19** : Framework JavaScript
- **Vite** : Build tool ultra-rapide
- **TailwindCSS** : Framework CSS utilitaire
- **React Router** : Routage client
- **TanStack Query** : Gestion des requêtes serveur
- **Leaflet** : Cartes interactives

### Backend / Base de données
- **Supabase** : Authentification et base de données PostgreSQL

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Un compte Supabase

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd afriprix
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Supabase**
   - Créez un nouveau projet sur [supabase.com](https://supabase.com)
   - Exécutez le script `database.sql` dans l'éditeur SQL de votre projet Supabase
   - Récupérez votre URL et clé anonyme depuis les paramètres du projet
   - Copiez `.env.example` en `.env` et remplissez les variables :
     ```env
     VITE_SUPABASE_URL=votre_url_supabase
     VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
     ```

4. **Démarrer l'application**
   ```bash
   npm run dev
   ```

   L'application sera disponible sur `http://localhost:5173`

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── SearchBar.jsx    # Barre de recherche
│   ├── ProductCard.jsx  # Carte produit
│   ├── PriceList.jsx    # Liste des prix
│   ├── AddPriceForm.jsx # Formulaire d'ajout
│   ├── MapView.jsx      # Carte interactive
│   └── Navbar.jsx       # Barre de navigation
├── pages/              # Pages principales
│   ├── Home.jsx        # Page d'accueil
│   ├── ProductPage.jsx  # Page produit
│   ├── AddPrice.jsx    # Ajout de prix
│   ├── Login.jsx       # Connexion
│   ├── Register.jsx    # Inscription
│   ├── Dashboard.jsx   # Dashboard utilisateur
│   └── MapPage.jsx     # Page carte
├── hooks/              # Hooks personnalisés
│   ├── useProducts.js  # Gestion des produits
│   ├── usePrices.js    # Gestion des prix
│   └── useAuth.js      # Gestion authentification
├── services/           # Services API
│   ├── supabaseClient.js # Client Supabase
│   ├── productService.js  # Services produits
│   ├── priceService.js    # Services prix
│   └── authService.js    # Services auth
├── context/            # Contexte React
│   └── AuthContext.jsx  # Contexte d'authentification
└── App.jsx            # Composant principal
```

## 🗄️ Base de données

Le script `database.sql` crée les tables suivantes :

- **products** : Informations sur les produits
- **stores** : Informations sur les magasins
- **prices** : Prix des produits par magasin
- **price_reports** : Signalements de prix incorrects
- **users** : Utilisateurs (géré par Supabase Auth)

## 🔧 Configuration Supabase

### 1. Créer les tables
Exécutez le contenu de `database.sql` dans l'éditeur SQL de votre projet Supabase.

### 2. Configurer l'authentification
- Activez l'inscription par email dans les paramètres Auth de Supabase
- Configurez les URLs de redirection si nécessaire

### 3. RLS (Row Level Security)
Le script configure déjà les politiques RLS pour sécuriser l'accès aux données.

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Preview locale
```bash
npm run preview
```

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 🐛 Support

Pour toute question ou problème, veuillez créer une issue sur le dépôt GitHub.
