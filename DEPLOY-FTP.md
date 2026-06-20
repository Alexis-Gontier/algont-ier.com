# Déploiement FTP (hébergement statique) — branche `static-export-ftp`

> ⚠️ **Branche dédiée, à ne pas merger dans `main`.** `main` reste déployé sur
> Vercel (SSR + middleware i18n). Cette branche produit une **version statique**
> du site, à uploader sur un hébergement Apache/Nginx via WinSCP.

## Ce que fait cette branche

- `next.config.ts` : `output: "export"` → `pnpm build` génère un dossier `out/`
  100 % statique (aucun serveur Node requis).
- Le middleware i18n (`src/proxy.ts`) et le catch-all `[locale]/[...rest]` ont été
  retirés (incompatibles avec l'export statique).
- Le routing de langue est assuré par les segments statiques `/(fr|en)/…` et par
  une redirection racine (`public/index.html` + `public/.htaccess`).
- Les en-têtes de sécurité et la page 404 sont servis via `public/.htaccess`
  (Apache). Pour Nginx, reporter ces règles dans la conf du serveur.

## 1. Configurer le domaine

Les URLs absolues (sitemap, robots, balises Open Graph) sont figées **au build**.
Avant de builder, crée un fichier `.env.local` à la racine :

```bash
NEXT_PUBLIC_SITE_URL="https://ton-domaine.fr"
```

Sans ça, elles pointeront sur `http://localhost:3000`.

## 2. Générer l'export

```bash
pnpm install
pnpm build
```

Le site statique se trouve dans `out/`. Fichiers clés :

| Fichier | Rôle |
| --- | --- |
| `out/index.html` | Redirige `/` → `/fr/` |
| `out/fr/`, `out/en/` | Pages localisées (`index.html` par dossier) |
| `out/404.html` | Page d'erreur (branchée via `.htaccess`) |
| `out/icon` | Favicon (PNG, sans extension) |
| `out/<locale>/opengraph-image` | Image OG (PNG, sans extension) |
| `out/.htaccess` | En-têtes sécurité, redirection, MIME, cache (Apache) |

## 3. Uploader avec WinSCP

1. Connexion à ton serveur (protocole **SFTP** ou **FTP** selon l'hébergeur).
2. Côté distant, va dans la racine web (souvent `www/`, `public_html/` ou
   `htdocs/`).
3. Côté local, ouvre le dossier **`out/`**.
4. Sélectionne **tout le contenu de `out/`** (pas le dossier lui-même) et
   glisse-le vers la racine web.
5. Vérifie que les fichiers cachés sont transférés : WinSCP →
   *Options ▸ Préférences ▸ Panneaux ▸ « Afficher les fichiers cachés »*, pour
   que **`.htaccess`** parte bien.

> Astuce : tu peux activer la synchronisation WinSCP (*Commandes ▸ Synchroniser*)
> en pointant le dossier local `out/` vers la racine web pour les mises à jour.

## 4. Vérifier en ligne

- `https://ton-domaine.fr/` redirige vers `/fr/`.
- Le favicon et l'aperçu de partage (OG) s'affichent.
- Une URL inconnue affiche la page 404.

## Limites du mode statique

- Pas de détection automatique de langue selon le navigateur (toujours `/fr/`
  par défaut depuis `/`).
- `@vercel/analytics` n'envoie rien hors Vercel (sans effet, sans erreur).
- Toute fonctionnalité serveur ajoutée plus tard (API, formulaire de contact
  côté serveur, back-office) ne fonctionnera pas en statique.
