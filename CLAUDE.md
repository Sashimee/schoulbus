# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Vitrine schoulbus.lu — repères pour travailler sur ce dépôt

Page de présentation de l'application **Bus scolaire Beckerich**. Elle explique ce que
l'application fait et dit dans la même page ce qu'elle ne sait pas faire. Elle **n'y conduit
pas** pour l'instant : l'application est encore en développement, et `APP_PUBLIEE` vaut
`false` (voir « Les liens, et l'interrupteur »).
Réalisée par un parent, à titre privé, **sans lien avec la commune ni avec l'école**.

**Ce dépôt n'est pas l'application.** L'application vit dans `../bus-scolaire-beckerich`,
avec son propre `CLAUDE.md`, sa propre construction et son propre déploiement. Les deux ne
partagent que trois choses : les jetons de style (recopiés par script), une URL, et des
captures d'écran (engendrées par script). Ne pas mélanger les deux.

| | Application | Vitrine |
| --- | --- | --- |
| Rôle | outil quotidien, personnalisé | page lue une fois |
| Forme | SPA, `noindex` | HTML statique pré-rendu par langue, indexé |
| Langues | 5 (fr, de, lb, pt, en) | 3 (fr, de, lb) |
| Données | garde ce que la famille saisit | **aucune donnée, aucun cookie, aucune mesure** |

## Le formulaire de contact n'envoie rien

`/contact/` porte un vrai formulaire, et il **n'émet aucune requête**. À la validation, il
assemble une adresse `mailto:` et laisse le logiciel de courrier de la personne l'ouvrir :
c'est elle qui envoie, depuis chez elle.

Ce n'est pas un détail d'implémentation, c'est ce qui permet à trois choses de rester
vraies en même temps — la ligne du pied de page qui dit que la page n'appelle aucun
serveur, la CSP qui porte `connect-src 'self'` et `form-action 'none'`, et le fait qu'il y
ait tout de même un moyen d'écrire. **Un formulaire qui posterait quelque part romprait les
trois d'un coup.** Avant de proposer un service d'envoi, relire cette ligne.

Deux conséquences à connaître avant d'y toucher :

- **Sans JavaScript, le formulaire est inerte.** D'où l'adresse en clair AVANT lui sur la
  page — c'est le vrai chemin de secours, et son ordre n'est pas cosmétique.
- **L'adresse ne paraît que sur `/contact/`.** Le pied de page, l'en-tête et la coda de
  l'accueil mènent à la PAGE, jamais à un `mailto:` : trois fichiers pré-rendus la portent
  au lieu de neuf. Un test tient l'invariant (`rendu.test.ts`).

## Le flux de branches — à lire avant de toucher à quoi que ce soit

**`main` EST LE SITE EN PRODUCTION.** Ce qui y arrive part en ligne. On n'y travaille
jamais directement, et on n'y pousse jamais un commit écrit à la main.

**Sur `dev` non plus.** `dev` est la branche d'intégration : elle reçoit du travail
terminé, elle n'en produit pas.

Le chemin, sans raccourci :

```
        branche de travail          dev                     main
             │                       │                       │
  un sujet ──┤                       │                       │  ← production, en ligne
             │  tout passe ────────► │                       │
             │                       │  tout passe ────────► │
```

1. **Une branche par sujet**, partant de `dev`. Un sujet = une raison de changer.
2. Quand tout passe (`npm run verifier`, et la CI), **fusion dans `dev`**.
3. Quand `dev` est sain, **fusion de `dev` dans `main`** — et c'est la mise en ligne.

```bash
git checkout dev && git pull                 # toujours partir de dev à jour
git checkout -b sujet-en-deux-mots           # jamais commiter sur dev lui-même
# … travail, puis :
npm run verifier                             # avant de proposer quoi que ce soit
```

Ce que cela interdit, concrètement : `git commit` alors que `git branch --show-current`
répond `main` ou `dev` ; `git push origin main` depuis une copie de travail ; un correctif
« vite fait » poussé directement parce qu'il est petit. **Un correctif d'une ligne suit le
même chemin qu'un lot entier** — c'est précisément le correctif d'une ligne qui met un site
en panne, parce que personne ne l'a regardé.

La CI se déclenche sur `dev`, sur `main` et sur les *pull requests* : une branche de travail
poussée seule, sans PR, n'est vue par personne ni par rien.

## Trois principes non négociables

1. **La vitrine ne promet rien que l'application ne tienne.** Pas de « toujours à
   l'heure », pas de « suivi en temps réel » : le site affiche un plan officiel
   personnalisé, il ne sait pas où est le bus. Toute affirmation ajoutée ici doit être
   vérifiable dans `../bus-scolaire-beckerich`. Voir l'en-tête de `src/contenu/type.ts`.
2. **La section « Limites » vient AVANT l'appel final.** C'est l'ordre choisi par
   l'application elle-même (`src/App.tsx`), et il ne s'inverse pas pour gagner un clic.
3. **Le registre est celui de l'application, pas celui d'une page de vente.** Énoncer une
   situation, puis ce que le logiciel en fait. Pas d'aphorisme, pas d'antithèse, pas de
   phrase qui se félicite. « Vous le déposez au Dillendapp le lundi, vous venez le chercher
   le jeudi » vaut mieux que « chaque chose à sa place ».

## Conventions

- **Tout est écrit en français** : composantes (`Appareil`, `Revele`, `PiedDePage`),
  fichiers (`entree-serveur.ts`, `mouvement/`), variables, commentaires. Même règle que
  dans l'application.
- **Aucune valeur brute hors de `src/styles/jetons.css`**, et **aucun `style={{ … }}` dans
  une composante.** Une seule exception documentée : le `scaleX` de la barre de progression
  (`sections/Entete.tsx`). Cibles tactiles ≥ 44 px ; chaque couple encre/fond tient
  ≥ 4.5:1 sur la composition réelle.
- **`src/styles/jetons.css` n'est pas écrit ici.** C'est une copie conforme de la couche
  `tokens` de `../bus-scolaire-beckerich/src/index.css`. Le modifier à la main fait échouer
  `npm run jetons:verifier`. Pour le mettre à jour : `npm run jetons:reprendre`.
- **Aucun texte visible en dur dans une composante** : tout passe par `useContenu()` et
  `src/contenu/{fr,de,lb}.ts`.
- Les commentaires expliquent **pourquoi**, pas quoi.

## Commandes

```bash
npm run dev                 # serveur de développement
npm run build               # client + SSR + pré-rendu des trois langues dans dist/
npm run preview             # sert dist/ tel qu'il sera publié
npm run verifier            # typecheck + lint + tests + contrastes + dérive des jetons
```

`npm run verifier` est la porte : c'est ce que lance le `Dockerfile` avant de construire,
et ce que rejoue l'intégration continue.

```bash
npm test                                   # tous les tests
npx vitest run src/tests/contenu.test.ts   # un seul fichier
npx vitest run -t "les icônes des tuiles"  # un seul test, par son nom
npm run test:watch                         # en continu

npm run contraste           # chaque couple encre/fond sur la composition réelle
npm run jetons:verifier     # les jetons ont-ils divergé de l'application ?
npm run chiffres            # régénérer src/contenu/chiffres.ts depuis les données de l'app
npm run assets:partage      # vignettes de partage + icônes matricielles
npm run assets:qr           # QR vers URL_APP
npm run captures            # rephotographier l'application (itération)
npm run captures:conteneur  # la même chose dans le conteneur épinglé — CELLE QU'ON COMMITE
```

## Architecture

### Le contenu est une donnée, pas du JSX

Tout le texte de la page vit dans `src/contenu/{fr,de,lb}.ts`, typé par
`src/contenu/type.ts`. Les sections de `src/sections/` ne font que le disposer. Conséquence
pratique : **on modifie un texte sans ouvrir une composante**, et le compilateur refuse une
clé manquante dans l'une des trois langues.

`src/tests/contenu.test.ts` impose en plus ce que le type ne peut pas dire : aucune chaîne
vide, **le même nombre** de tuiles, de temps, de points, de limites et de mots dans les
trois langues, et la même suite d'icônes. **Les trois langues bougent donc ensemble ou pas
du tout** — réécrire `fr.ts` seul fait échouer les tests, et c'est voulu.

Deux contraintes de grille, qui ne sont pas dans le type mais dans `src/styles/sections.css` :

- `.limites__liste` est une grille de trois colonnes → **3 ou 6 items, jamais 4 ni 5.**
- Le bento des fonctions a 6 colonnes et pose ses portées **par position**
  (`nth-child(1)` et `(6)` → `span 4` ; `(8)` et `(9)` → `span 3`) → **9 tuiles**, sinon la
  composition se casse en silence.

### Les chiffres sont comptés, pas écrits

`src/contenu/chiffres.ts` est **engendré** par `scripts/build-chiffres.mjs` depuis
`../bus-scolaire-beckerich/src/data/`. Ne pas le modifier à la main. Le fichier est
versionné pour que la vitrine se construise seule ; le script sort en `exit 0` si
l'application est absente. Chemin surchargeable par `DEPOT_APP`.

### Les écrans montrés sont de vraies captures

`public/captures/{écran}-{langue}-{thème}.webp` — 4 écrans × 3 langues × 2 thèmes = 24
fichiers, engendrés par `scripts/captures.mjs`, affichés par `src/composants/Ecrans.tsx`,
et dont l'existence est vérifiée par `src/tests/rendu.test.ts`. Le manifeste partagé par
ces trois lecteurs est `src/contenu/captures.ts` : **une règle de nommage, trois
consommateurs.**

Ils étaient reconstruits en DOM et en CSS jusqu'à ce que la reconstruction dérive — « Étape
2 sur 4 » quand l'assistant en compte sept, la journée courte le mercredi quand ce sont le
mardi et le jeudi, une adresse dans une rue inexistante. Aucun test ne pouvait le voir. Ne
pas réintroduire de maquette dessinée « pour le thème clair » ou « pour les petits
écrans » : deux sources de vérité sur le même produit, c'est exactement ce qui a produit
ces trois erreurs.

Le script photographie le **serveur de développement de l'application**, jamais le site
publié, et fige tout ce qui bouge : horloge au mardi 22 septembre 2026 07:25, tuiles de
carte depuis `scripts/fixtures/tuiles/`, perturbations et traductions servies vides,
révision affichée fixée. Le foyer de démonstration est posé par le **lien de partage de
l'application** — interface publique et versionnée — et son adresse est au niveau de la
rue, jamais au numéro : la fiche de la semaine dessine le vrai voisinage sur une carte.

> **Ce sont les captures DU CONTENEUR qui sont commitées.** `npm run captures` sert à
> itérer ; `npm run captures:conteneur` produit ce qui est versionné. Six des vingt-quatre
> fichiers diffèrent entre une machine de développement et le conteneur — les six
> `semaine-*`, c'est-à-dire le seul écran qui porte une carte Leaflet. Commiter la sortie
> de `npm run captures` fait échouer l'intégration continue **sans que rien ne soit faux
> dans les images**, ce qui est la façon la plus déroutante d'échouer.

Les nombres du héros et de l'appel final (`heros.heure`, `final.*`) sont **ceux des
captures**. Le lecteur voit l'écran à côté de la phrase : quand ils divergent, c'est la
phrase qu'il croit fausse.

### Le pré-rendu

`npm run build` enchaîne : paquet client → paquet SSR (`src/entree-serveur.ts`) →
`scripts/prerendu.mjs`, qui rend chaque langue en HTML complet et écrit `sitemap.xml` et
`robots.txt`.

```
dist/index.html      français (langue de référence, à la racine)
dist/de/index.html   allemand
dist/lb/index.html   luxembourgeois
```

Contrainte qui gouverne `entree-serveur.ts` : **ce qui est rendu là doit être exactement ce
que le navigateur rendra à l'hydratation.** D'où le niveau de mouvement qui démarre à
`aucun` des deux côtés, et aucune lecture de `window` pendant le rendu.

### Le mouvement est étagé, pas interrupté

`src/mouvement/useNiveauMouvement.ts` rend `complet` / `reduit` / `aucun`. **Le premier
rendu est toujours `aucun`** — c'est aussi ce que produit le pré-rendu, et les deux doivent
concorder. Deux règles pour toute animation ajoutée :

1. **Rien d'important ne dépend d'une animation pour être visible.** D'où l'entrée du héros
   en CSS pure, et `Revele` qui rend un élément nu quand le niveau vaut `aucun`.
2. **Seuls `transform` et `opacity`** (et les uniformes du shader).

### Les liens, et l'interrupteur

Toutes les adresses extérieures sont dans `src/config.ts`, **et nulle part ailleurs**.
`APP_PUBLIEE` y commande d'un seul geste les boutons, le QR, les entrées de pied de page et
le `SoftwareApplication` du balisage structuré. Les deux états sont testés
(`src/tests/rendu.test.ts`) : il n'existe pas d'état intermédiaire où la moitié des liens
serait revenue. Un test couvre aussi le `<noscript>` d'`index.html`, que l'interrupteur ne
peut pas atteindre puisque c'est du HTML statique.

### Les ressources engendrées sont commitées

`public/partage*.png`, les icônes matricielles, `qr-application.svg` et `public/captures/`
ne sont **pas** produits par `npm run build` : la construction et le conteneur n'ont à
connaître ni `satori`, ni `resvg`, ni Playwright. L'intégration continue les régénère et
refuse la révision s'ils ont bougé.

Conséquence à connaître : `scripts/build-partage.mjs` **importe** les modules de contenu et
lit `general.marque`, `heros.titre` et `heros.etiquette`. Toucher à l'une de ces trois clés
change les trois vignettes → `npm run assets:partage` puis commiter. Et `heros.titre` est
dessiné à 76 px sur 1200 px : **24 caractères par ligne au plus.**

## Carte du dépôt

| Chemin | Rôle |
| --- | --- |
| `src/contenu/` | Tout le texte, les chiffres engendrés, le manifeste des captures. |
| `src/sections/` | Une composante par section de l'accueil, dans l'ordre de `App.tsx`. Disposition seulement. |
| `src/pages/` | Les pages hors accueil : `independance` et `contact` (toujours engendrées), `mentions` (seulement si `ADRESSE_EDITEUR` est renseignée). Le nom de la page EST son segment d'adresse — même règle dans `cheminPage()` et dans le `dossier()` du pré-rendu. |
| `src/composants/` | Briques réutilisées : `Appareil` (le téléphone), `Ecrans` (les captures), `Icones`, `SchemaConfidentialite`, `FormulaireContact`. |
| `src/formulaire/` | La logique du formulaire de contact, sans React : validation et assemblage du `mailto:`. |
| `src/mouvement/` | Niveau de mouvement, révélation au défilement, fond WebGL, curseur. |
| `src/styles/` | `jetons.css` (copie de l'application), puis vitrine / composants / sections. |
| `scripts/` | Tout ce qui engendre : captures, chiffres, vignettes, QR, jetons, contrastes, pré-rendu. |
| `src/tests/` | Invariants du contenu et du rendu. |

## Déploiement

Docker à deux étages (Node construit, nginx sert), Dokploy sur `schoulbus.lu`. La CSP est
posée en `<meta>` par `vite.config.ts`, parce que l'empreinte du script anti-clignotement
s'y calcule ; l'en-tête HTTP ne porte que `frame-ancestors`.

## Documentation

- **[README.md](README.md)** — présentation, charte, **et la section « Réserves ouvertes »**.
  À lire avant d'entamer une évolution, et **à mettre à jour à la fin** : une réserve dite
  et non écrite est une réserve perdue, elle réapparaît en panne trois mois plus tard.
- `../bus-scolaire-beckerich/CLAUDE.md` — le dépôt frère, si la question porte sur ce que
  l'application fait vraiment. **C'est la source à consulter avant d'écrire une
  affirmation** sur son comportement.

## Réserve la plus urgente

**Le luxembourgeois n'a pas été relu par une personne dont c'est la langue maternelle**, et
la vitrine, elle, est bel et bien publiée — refermer l'interrupteur ne change rien à cela. C'est la langue du foyer dans une bonne part de la commune ; une
tournure fausse s'y remarque immédiatement et décrédibilise le reste. Voir l'en-tête de
`src/contenu/lb.ts` et les réserves du README.
