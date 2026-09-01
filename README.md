# Histia — Feature « Flottes »

Cas pratique : implémentation d'un système de **flottes** (cartes rangées dans un répertoire), avec création, affichage, édition et suppression.

## ✨ Fonctionnalités

- **CRUD complet** : créer, lister, modifier et supprimer des flottes
- **Overlay de création/édition** unifié avec **aperçu en temps réel** (le titre, la couleur et la description se reflètent instantanément sur la carte) et **effet tilt** 3D
- **Infinite scroll** (pagination par curseur)
- **Internationalisation FR / EN** via l'URL (`/fr`, `/en`), sans sélecteur de langue
- **Mise à jour instantanée** de la grille après chaque action, sans rechargement
- Responsive (optimisé pour 1920×1080 et 1400×900)

## 🛠 Stack

- **Next.js 16** (App Router)
- **Prisma 6** + **PostgreSQL** (Neon)
- **React Hook Form** + **Zod** (formulaires & validation)
- **TanStack Query** (data fetching, cache, mutations)
- **intlayer** (i18n)
- **framer-motion** (effet tilt)
- **Tailwind CSS**

## 🚀 Installation

Prérequis : [Bun](https://bun.sh) et une base PostgreSQL.

```bash
# 1. Installer les dépendances
bun install

# 2. Configurer la base de données
cp .env.example .env
# → renseigner DATABASE_URL dans .env

# 3. Appliquer le schéma
bunx prisma migrate dev

# 4. (Optionnel) Insérer des données de démo
bun prisma/seed.ts

# 5. Lancer le serveur de développement
bun dev
```

Ouvrir **http://localhost:3000/fr/fleets** (ou `/en/fleets`).

## 📁 Structure
<img width="592" height="217" alt="image" src="https://github.com/user-attachments/assets/176a1b92-6f79-4a19-a441-1ad4267f2f75" />




## 🧩 Choix techniques

- **Prisma 6 (stable)** plutôt que la version `8.0.0-rc` du starter : cette RC (« Prisma Next ») abandonne le workflow classique et n'a pas de `@prisma/client` stable. J'ai privilégié une couche de données fiable et documentée.
- **Routing i18n `prefix-all`** : `/fr/...` et `/en/...` sont deux URLs stables et testables séparément, conformément au brief.
- **Pagination par curseur** : plus robuste que l'offset pour un infinite scroll (pas de doublons si des données s'ajoutent).
- **Overlay create/edit unifié** : un seul composant gère création et édition selon qu'une flotte est passée ou non, avec un schéma Zod partagé (`.partial()` pour l'update).
- **Validation côté serveur ET client** avec le même schéma Zod, pour ne jamais faire confiance au client.
