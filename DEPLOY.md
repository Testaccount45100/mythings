# MyThings — Guide de déploiement Vercel

## Déploiement en 5 minutes (gratuit)

### Prérequis
- Compte GitHub (gratuit) → https://github.com
- Compte Vercel (gratuit) → https://vercel.com

---

### Étape 1 — Pousser le code sur GitHub

```bash
# Dans le dossier things3-app
git init
git add .
git commit -m "Initial commit - MyThings app"

# Créer un repo sur github.com, puis :
git remote add origin https://github.com/TON_USERNAME/mythings.git
git push -u origin main
```

### Étape 2 — Déployer sur Vercel

1. Va sur **vercel.com** → Sign in with GitHub
2. Clique **"Add New Project"**
3. Importe ton repo `mythings`
4. Vercel détecte automatiquement Vite → laisse les paramètres par défaut
5. Clique **Deploy**

C'est tout. Ton app sera live sur `https://mythings-xxx.vercel.app` en ~1 minute.

---

### Domaine personnalisé (optionnel, gratuit)
Dans Vercel → Settings → Domains → ajoute ton domaine.

---

### Mises à jour futures
```bash
git add .
git commit -m "Update"
git push
```
Vercel redéploie automatiquement à chaque push.

---

## Architecture technique

- **Framework** : React 18 + Vite
- **Stockage** : localStorage (données persistées dans le navigateur)
- **Hébergement** : Vercel (gratuit, CDN mondial)
- **Dépendances** : lucide-react, date-fns, uuid
- **Pas de backend** : 100% client-side

> ⚠️ Les données sont stockées dans **ton navigateur** (localStorage).
> Si tu vides le cache, les données sont perdues.
> Pour une vraie persistance multi-appareils, il faudrait ajouter Firebase ou Supabase (également gratuits en tier free).
