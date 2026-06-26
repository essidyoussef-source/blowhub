<div align="center">

# ✦ Blow Hub

### Le Content OS des créateurs de contenu

*De l'étincelle d'idée jusqu'au post publié — un seul endroit pour penser, classer, planifier et produire ton contenu.*

</div>

---

## 🎯 La problématique

Quand on crée du contenu, les idées arrivent partout : une punchline dans le métro, un concept de carrousel sous la douche, une anecdote pendant un dîner. Résultat : **des dizaines de fichiers Excel, des notes éparpillées, et zéro recul.**

Blow Hub résout ça avec **une logique unique** :

> Une idée n'est pas « rangée dans un dossier ». Elle **vit dans un pipeline** et porte des **étiquettes**.

### Les 4 axes qui classent TOUT ton contenu

| Axe | À quoi ça sert | Exemples |
|-----|----------------|----------|
| 🏛️ **Pilier** | Le thème | Mindset · Sport · Business · Lifestyle · Storytelling · Santé |
| 🎬 **Format** | Le type de post (couleur dédiée) | Carrousel · Reel · Post · Story · Série |
| 🧭 **Framework** | L'angle narratif | Relatable · Educational · Credible · Repeat |
| 🚦 **Statut** | L'avancement (le pipeline) | Idée → À développer → À scripter → Scripté → À tourner → À monter → Programmé → Publié |

Grâce à ces étiquettes, tu vois la même idée sous tous les angles : **par thème, par avancement, par date, par plateforme.**

---

## 🧩 Les modules

- **📊 Dashboard** — vue d'ensemble : pipeline, répartition par pilier, priorités du moment.
- **🗂️ Idées (Kanban)** — glisse tes contenus de colonne en colonne (idée → publié). Filtres par pilier, format, recherche.
- **📅 Calendrier éditorial** — planning mensuel avec **code couleur par format / plateforme / pilier**. **Glisse-dépose** un post pour le reprogrammer, ou clique un jour pour en créer un.
- **🖼️ Carrousels** — **chaque slide en carré, visible une par une sur une ligne**, comme dans le feed. Édition directe, mode présentation plein écran, et **export en images PNG 1080×1080 prêtes à poster**.
- **📺 Séries** — tes formats récurrents (ex: *The Bossy Lady Diaries*), avec **numérotation automatique** des épisodes (#01, #02…).
- **🎬 Production** — organise tes journées de **tournage** et tes sessions de **montage**.
- **📚 Bibliothèque** — ta réserve de munitions : idées brutes, punchlines & citations, anecdotes, captions prêtes. Promotion d'une idée brute vers le pipeline en un clic.

---

## 🎨 Code couleur

Chaque **pilier**, **format** et **plateforme** a sa couleur identitaire, appliquée partout (cartes, calendrier, slides). Un coup d'œil suffit pour savoir de quoi parle un contenu et où il va être publié.

---

## 🚀 Démarrer

```bash
npm install      # installe les dépendances
npm run dev      # lance le serveur de dev (http://localhost:5173)
npm run build    # build de production dans /dist
npm run preview  # prévisualise le build
```

> 💡 L'app est pré-remplie avec du contenu réel (carrousels, citations, anecdotes…). Tes modifications sont **sauvegardées dans ton navigateur** (localStorage). Le bouton « Réinitialiser la démo » recharge les données d'origine.

## ☁️ Déployer

Blow Hub est une SPA statique : elle se déploie en 1 clic sur **Vercel**, **Netlify** ou **GitHub Pages**.

- **Vercel / Netlify** : connecte le repo, commande de build `npm run build`, dossier de sortie `dist`.

---

## 🛠️ Stack technique

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (thème sombre, design system maison)
- **@dnd-kit** (drag & drop du Kanban)
- **Zustand** + persistance localStorage (état global)
- **date-fns** (calendrier), **lucide-react** (icônes)

### Architecture

```
src/
├── types.ts          # modèle de données (Content, Slide, Quote…)
├── constants.ts      # taxonomie + couleurs (piliers, formats, statuts…)
├── store.ts          # store Zustand + import des données réelles
├── data/seed.json    # contenu réel importé depuis les fichiers Excel
├── components/        # Badges, ContentCard, ContentModal, PageHeader…
└── pages/             # Dashboard, IdeasBoard, Calendar, Carousels, Production, Library
```

Le modèle est volontairement **scalable** : la couche de données (`store.ts`) est isolée, ce qui permet de brancher plus tard une vraie base de données (Supabase, Postgres…) et le multi-utilisateur sans toucher à l'UI.

---

<div align="center">
<sub>Blow Hub — pensé pour révolutionner la gestion de contenu. ✦</sub>
</div>
