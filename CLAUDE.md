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
| Langues | 5 (fr, de, lb, pt, en) | 4 (fr, de, lb, en) |
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
  l'accueil mènent à la PAGE, jamais à un `mailto:` : quatre fichiers pré-rendus la portent
  au lieu de douze. Un test tient l'invariant (`rendu.test.ts`).

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
  **Une exception, et une seule** : sous 30 rem, un segment de langue de l'en-tête mesure
  40 px de large pour 44 de haut (`styles/composants.css`). La quatrième langue faisait
  passer l'en-tête flottant sur deux rangs en permanence sur les téléphones de 320 px ;
  l'autre issue était de retirer le lien de contact de l'en-tête, ce qui coûtait plus cher.
  Le critère WCAG 2.5.8 (24 px, AA) reste tenu avec de la marge, le 2.5.5 (44 px, AAA) ne
  l'est plus. Le calcul complet est dans le commentaire, à refaire avant d'y toucher.
- **`src/styles/jetons.css` n'est pas écrit ici.** C'est une copie conforme de la couche
  `tokens` de `../bus-scolaire-beckerich/src/index.css`. Le modifier à la main fait échouer
  `npm run jetons:verifier`. Pour le mettre à jour : `npm run jetons:reprendre`.
- **Aucun texte visible en dur dans une composante** : tout passe par `useContenu()` et
  `src/contenu/{fr,de,lb,en}.ts`.
- Les commentaires expliquent **pourquoi**, pas quoi.

## Commandes

```bash
npm run dev                 # serveur de développement
npm run build               # client + SSR + pré-rendu des quatre langues dans dist/
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

Tout le texte de la page vit dans `src/contenu/{fr,de,lb,en}.ts`, typé par
`src/contenu/type.ts`. Les sections de `src/sections/` ne font que le disposer. Conséquence
pratique : **on modifie un texte sans ouvrir une composante**, et le compilateur refuse une
clé manquante dans l'une des quatre langues.

`src/tests/contenu.test.ts` impose en plus ce que le type ne peut pas dire : aucune chaîne
vide, **le même nombre** de tuiles, de temps, de points, de limites et de mots dans les
quatre langues, et la même suite d'icônes. **Les quatre langues bougent donc ensemble ou pas
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

`public/captures/{écran}-{langue}-{thème}.webp` — 4 écrans × 4 langues × 2 thèmes = 32
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
> itérer ; `npm run captures:conteneur` produit ce qui est versionné. À l'époque où il y en
> avait vingt-quatre, six différaient entre une machine de développement et le conteneur —
> les six `semaine-*`, c'est-à-dire le seul écran qui porte une carte Leaflet ; l'écart n'a
> pas de raison de se limiter à eux, c'est simplement le seul écran où il a été mesuré. Commiter la sortie
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
dist/en/index.html   anglais
```

Contrainte qui gouverne `entree-serveur.ts` : **ce qui est rendu là doit être exactement ce
que le navigateur rendra à l'hydratation.** D'où le niveau de mouvement qui démarre à
`aucun` des deux côtés, et aucune lecture de `window` pendant le rendu.

### Ajouter une langue : ce qui suit tout seul, et ce qui ne suit pas

La liste vit dans `src/contenu/langues.ts`, et **elle seule**. Un module sans React et sans
`import.meta.env`, précisément pour que `scripts/build-partage.mjs` et
`scripts/captures.mjs` puissent la lire au lieu de la recopier. Le pré-rendu, le plan du
site, les `hreflang`, le sélecteur de langue et tous les tests en découlent.

Trois choses n'en découlent pas :

1. **`nginx.conf` porte une ligne par langue** — `location = /en { return 301 /en/; }`.
   Rien ne la vérifie : `npm run verifier`, les tests et l'étape « image » de l'intégration
   continue ne demandent jamais rien à nginx. Une langue oubliée là répond 404 sur `/xx`
   pendant que `/xx/` fonctionne, et personne ne le voit avant qu'un visiteur tape
   l'adresse. Le seul contrôle est manuel :
   `docker build -t vitrine:essai . && docker run --rm -p 8080:80 vitrine:essai`, puis
   `curl -sI localhost:8080/en`.
2. **`ETIQUETTE_LOCALE` dans `scripts/captures.mjs`** donne à Playwright la locale du
   navigateur. Une entrée manquante ne fait pas échouer la prise : elle produit des captures
   dans une AUTRE langue, enregistrées sous le nom de celle qu'on croyait photographier.
   Un contrôle en tête de script arrête maintenant le lot plutôt que de livrer ces images.
3. **Le budget de poids des captures** (`POIDS_TOTAL_MAX`) est un chiffre écrit, pas un
   calcul : une langue de plus doit venir y buter et faire reprendre la décision.

### `codeLangue` et `localePartage` ne disent pas la même chose

`codeLangue` porte l'attribut `lang` du document, les `hreflang` et l'`inLanguage` du
balisage : une langue, sans territoire. `localePartage` ne sert qu'à `og:locale`, la seule
balise qui en réclame un.

Les deux étaient assemblées jusqu'ici — `${codeLangue}_LU` —, ce qui tenait tant que le
site ne parlait que des langues du Luxembourg. L'anglais aurait pris `en_LU` : un
territoire qui ne le désigne pas, dans la balise qu'un réseau social lit pour choisir la
version à ouvrir. D'où `en_GB`, écrit dans `src/contenu/en.ts` et non calculé.

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
change les quatre vignettes → `npm run assets:partage` puis commiter. Et `heros.titre` est
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

L'anglais n'a pas été relu non plus, et la réserve est double puisqu'il s'aligne sur le
vocabulaire d'`../bus-scolaire-beckerich/src/i18n/en.json`, qui n'a pas été relu davantage.
Elle reste moins urgente que celle du luxembourgeois, pour une raison qu'il faut énoncer
plutôt que laisser entendre : l'anglais n'est la langue du foyer de presque personne ici,
il sert aux familles qui n'ont aucune des trois autres — et qui, pour cette raison même, ne
sont pas en position de repérer la faute. Elle se voit moins ; elle se répare moins aussi.
Voir l'en-tête de `src/contenu/en.ts` et les réserves du README.
