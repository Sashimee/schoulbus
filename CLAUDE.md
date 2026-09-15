# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Vitrine schoulbus.lu — repères pour travailler sur ce dépôt

Page de présentation de l'application **Bus scolaire Beckerich**. Elle explique ce que
l'application fait et dit dans la même page ce qu'elle ne sait pas faire, et **elle y
conduit** : l'application est publiée sur `app.schoulbus.lu`, et `APP_PUBLIEE` vaut `true`
(voir « Les liens, et l'interrupteur »).
Réalisée par un parent, à titre privé, **sans lien avec la commune ni avec l'école**.

**Ce dépôt n'est pas l'application.** L'application vit dans `../bus-scolaire-beckerich`,
avec son propre `CLAUDE.md`, sa propre construction et son propre déploiement. Les deux ne
partagent que trois choses : les jetons de style (recopiés par script), une URL, et des
captures d'écran (engendrées par script). Ne pas mélanger les deux.

| | Application | Vitrine |
| --- | --- | --- |
| Rôle | outil quotidien, personnalisé | page lue une fois |
| Forme | SPA, `noindex` | HTML statique pré-rendu par langue, indexé |
| Langues | 5 (fr, de, lb, pt, en) | 5 (fr, de, lb, pt, en) |
| Données | garde ce que la famille saisit | aucun cookie, aucune mesure, aucun tiers — **et un seul envoi, que le visiteur déclenche** (voir « Le relais ») |

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
   Cas concret : la bande de chiffres affiche « 0 » en grand, et la note qui le CADRE
   (`chiffres.envoiNote`) est ce qui le rend vrai — TROIS choses sortent bel et bien de
   l'appareil, dont le prénom de l'enfant quand un parent écrit les trajets dans Google
   Agenda. La supprimer pour alléger la page ferait de ce zéro la seule affirmation du
   site que l'application ne tient pas — ce qu'elle a été jusqu'au 8 septembre 2026, la
   note disant alors « ni les prénoms ».
2. **La section « Limites » vient AVANT l'appel final.** C'est l'ordre choisi par
   l'application elle-même (`src/App.tsx`), et il ne s'inverse pas pour gagner un clic.
3. **Le registre est celui de l'application, pas celui d'une page de vente.** Énoncer une
   situation, puis ce que le logiciel en fait. Pas d'aphorisme, pas d'antithèse, pas de
   phrase qui se félicite. « Vous le déposez au Dillendapp le lundi, vous venez le chercher
   le jeudi » vaut mieux que « chaque chose à sa place ».

## Conventions

- **Tout est écrit en français** : composantes (`Cadre`, `Revele`, `PiedDePage`),
  fichiers (`entree-serveur.ts`, `mouvement/`), variables, commentaires. Même règle que
  dans l'application.
- **Aucune valeur brute hors de la couche des jetons**, et **aucun `style={{ … }}` dans
  une composante — plus aucune exception** depuis que la barre de progression a quitté
  l'en-tête. Cibles tactiles ≥ 44 px ; chaque couple encre/fond tient ≥ 4,5:1 (3:1 pour les
  deux couples de grands caractères, nommés dans `scripts/verifier-contraste.mjs`).
- **`src/styles/jetons.css` n'est pas écrit ici.** C'est une copie conforme de la couche
  `tokens` de `../bus-scolaire-beckerich/src/index.css`. Le modifier à la main fait échouer
  `npm run jetons:verifier`. Pour le mettre à jour : `npm run jetons:reprendre`.
  Chemin surchargeable par `DEPOT_APP`, comme pour les chiffres et les captures — et il
  faut s'en servir plutôt que de croire une dérive sur parole : le dépôt frère peut être
  sorti sur une branche de travail, et ce sont alors des jetons non publiés que la
  vérification compare. `DEPOT_APP=/tmp/app-main npm run jetons:verifier` tranche.
- **MAIS LES COULEURS NE VIENNENT PLUS DE LÀ.** La vitrine a sa propre palette — crème,
  sarcelle, corail — déclarée dans la couche `vitrine` de `src/styles/vitrine.css`, qui
  redéfinit les rôles (`--encre`, `--surface`, `--accent`…) APRÈS la couche `tokens`. Tout
  ce qui lit `var(--encre)` obtient la valeur de la vitrine, et `jetons.css` reste intact.
  Sémantique à ne pas diluer : **sarcelle = ce qui est vrai** (heures, arrêts, action
  principale), **corail = ce qui presse ou ce qui nuance** (décompte, limites, « bientôt »).
  Rien de décoratif ne prend le corail.
- **Aucun texte visible en dur dans une composante** : tout passe par `useContenu()` et
  `src/contenu/{fr,de,lb,pt,en}.ts`.
- Les commentaires expliquent **pourquoi**, pas quoi.

## Commandes

```bash
npm run dev                 # serveur de développement
npm run build               # client + SSR + pré-rendu des cinq langues dans dist/, et le budget de poids
npm run preview             # sert dist/ tel qu'il sera publié
npm run verifier            # typecheck + lint + tests + contrastes + dérive des jetons
```

`npm run verifier` est la porte : c'est ce que lance le `Dockerfile` avant de construire,
et ce que rejoue l'intégration continue. La SECONDE porte est `npm run build`, qui finit
par `npm run poids` : un budget se mesure sur ce qui est construit, pas sur les sources.
Même partage que le budget des captures, tenu par `npm run captures`.

```bash
npm test                                   # tous les tests
npx vitest run src/tests/contenu.test.ts   # un seul fichier
npx vitest run -t "les icônes des tuiles"  # un seul test, par son nom
npm run test:watch                         # en continu

npm run contraste           # chaque couple encre/fond sur la composition réelle
npm run poids               # ce que le premier écran pèse, contre son budget (demande dist/)
npm run jetons:verifier     # les jetons ont-ils divergé de l'application ?
npm run chiffres            # régénérer src/contenu/chiffres.ts depuis les données de l'app
npm run assets:partage      # vignettes de partage + icônes matricielles
npm run assets:qr           # QR vers URL_APP
npm run captures            # rephotographier l'application (itération)
npm run captures:conteneur  # la même chose dans le conteneur épinglé — CELLE QU'ON COMMITE
```

## Architecture

### Le contenu est une donnée, pas du JSX

Tout le texte de la page vit dans `src/contenu/{fr,de,lb,pt,en}.ts`, typé par
`src/contenu/type.ts`. Les sections de `src/sections/` ne font que le disposer. Conséquence
pratique : **on modifie un texte sans ouvrir une composante**, et le compilateur refuse une
clé manquante dans l'une des cinq langues.

`src/tests/contenu.test.ts` impose en plus ce que le type ne peut pas dire : aucune chaîne
vide, **le même nombre** de tuiles, d'écrans, de lignes de héros, de limites et de points
dans les **cinq** langues, la même suite d'icônes, une seule tuile en corail, une seule
ligne de décompte, une seule puce de nuance, et 24 signes au plus par ligne de
`heros.titre`. **Les cinq langues bougent donc ensemble ou pas du tout** — réécrire `fr.ts`
seul fait échouer les tests, et c'est voulu.

Une contrainte de grille, qui n'est pas dans le type mais dans `src/styles/sections.css` :

- `.limites__liste` pose trois colonnes → **3 ou 6 items, jamais 4 ni 5.** Un test le tient.

Le bento à six colonnes et ses portées par `nth-child` **n'existent plus**. Les neuf tuiles
sont égales et `auto-fit` compte les colonnes : ajouter ou déplacer une tuile ne demande
plus de règle CSS. La seule tuile qui se distingue est celle des perturbations, dont
l'icône est en corail — porté par la DONNÉE (`ton: 'alerte'`), jamais par un rang, pour
qu'elle suive la tuile quand on la déplace.

### Les chiffres sont comptés, pas écrits

`src/contenu/chiffres.ts` est **engendré** par `scripts/build-chiffres.mjs` depuis
`../bus-scolaire-beckerich/src/data/`. Ne pas le modifier à la main. Le fichier est
versionné pour que la vitrine se construise seule ; le script sort en `exit 0` si
l'application est absente. Chemin surchargeable par `DEPOT_APP`.

### Les écrans montrés sont de vraies captures

`public/captures/{écran}-{langue}-{thème}.webp` — 4 écrans × 5 langues × 2 thèmes = 40
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
> itérer ; `npm run captures:conteneur` produit ce qui est versionné. Six fichiers sur les
> vingt-quatre d'alors différaient entre une machine de développement et le conteneur — les
> `semaine-*`, c'est-à-dire le seul écran qui porte une carte Leaflet ; avec quarante
> fichiers, l'écart attendu passe à dix. Commiter la sortie
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

### Une seule langue descend

Les cinq dictionnaires étaient dans le paquet : un lecteur francophone téléchargeait
l'allemand, le luxembourgeois, le portugais et l'anglais, soit ≈ 14 ko comprimés pour rien.
Chacun est maintenant un morceau séparé, tenu par `src/i18n/registre.ts`, et le pré-rendu
annonce celui de SA langue en `modulepreload` — nom lu dans le manifeste de Vite, jamais
écrit à la main.

Trois choses à savoir avant d'y toucher :

1. **`useContenu()` reste une lecture SYNCHRONE**, parce qu'elle est appelée au milieu d'un
   rendu. C'est `src/entree.tsx` qui attend (`await chargerContenu`) **avant** `hydrateRoot`.
   Rien ne clignote : le document est déjà pré-rendu, et React ne touche au DOM qu'au moment
   où elle s'y accroche. Mesuré à 400 ko/s — 603 relevés du titre du héros, aucun vide.
2. **Trois lecteurs alimentent le registre, et il n'en existe pas de quatrième** : le
   navigateur par `chargerContenu`, le pré-rendu et les tests par `enregistrerContenu`
   (depuis `src/contenu/tous.ts`, la forme réunie — **à ne jamais importer d'une
   composante**, elle ramènerait les cinq langues).
3. **Un test qui appelle `vi.resetModules()` repart d'un registre vide** et doit recharger
   sa langue lui-même, comme le fait `entree.tsx`. Voir `src/tests/niveau-mouvement.test.ts`.

Le budget de `npm run poids` est ce qui tient l'acquis : il lit ce que le document NOMME,
donc le morceau de langue y entre et les quatre autres n'y entrent pas.

### Le relais, et la seule chose qui sorte de l'appareil

`serveur/` est un service de quatre-vingts lignes, une route `POST /api/contact`, déployé à
côté de la vitrine (`compose.yml`) et proxyfié par nginx. **C'est le seul code du projet qui
tourne côté serveur**, et le seul endroit d'où quelque chose sorte de l'appareil du
visiteur.

Cinq choses à savoir avant d'y toucher :

1. **Le DNS décide du montage.** `schoulbus.lu` porte `-all` et rejette tout ce qui n'est
   pas OVH. Un domaine en `~all` ne rejetterait pas un envoi direct depuis le conteneur,
   donc il « fonctionnerait », **sans passer SPF pour autant** — toléré n'est pas
   authentifié, et l'écart ne se voit qu'au bout de trois mois. On remet donc au SMTP
   authentifié d'OVH. **Ne jamais élargir le SPF** pour contourner : cela ouvrirait le
   domaine à l'usurpation pour la commodité d'un formulaire.

   **ET L'EXPÉDITEUR RESTE SUR LE DOMAINE AUTHENTIFIÉ** — `formulaire@schoulbus.lu`, pas
   d'alias ailleurs. C'est OVH qui l'exige, en amont du SPF : un `From` dont le domaine ne
   s'aligne pas sur le compte de soumission est rejeté en **550 5.7.1**, et il l'est
   **après** acceptation, par un rapport de non-remise. Le relais a répondu « envoyé », le
   visiteur l'a cru, et le message n'est jamais arrivé. Éprouvé le 14 septembre 2026 sur le
   premier message réel du formulaire — ticket #41. `desalignementExpediteur`
   (`serveur/validation.mjs`) empêche désormais le service de démarrer sur ce défaut.
2. **L'adresse du visiteur va en `Reply-To`, jamais en `From`.** La mettre en `From` est une
   usurpation de son domaine, et c'est précisément ce que DMARC existe pour détecter.
3. **La CSP N'A PAS ÉTÉ ROUVERTE**, contrairement à ce que le ticket annonçait.
   `connect-src 'self'` couvre déjà une requête de même origine, et `form-action 'none'`
   ne gêne pas un envoi par `fetch` — il interdit la soumission NATIVE, ce qui reste le bon
   comportement le jour où JavaScript échoue : le formulaire ne part pas du tout, au lieu
   de partir n'importe où.
4. **nginx proxyfie par une VARIABLE et non un nom littéral.** Avec un nom littéral, nginx
   résout au démarrage et refuse de démarrer si le relais est absent : le site entier
   tomberait pour un formulaire de contact. Vérifié en le faisant tourner sans relais.
5. **Le port du relais n'est pas publié**, et ce n'est pas un oubli. Le service croit
   l'en-tête `X-Forwarded-For` que nginx lui pose, parce qu'il n'est joignable que depuis le
   réseau interne. Le publier rendrait son plafond de débit contournable d'un en-tête, et
   ouvrirait un relais SMTP authentifié sur l'Internet.

**Les règles sont dans `serveur/validation.mjs`, qui n'ouvre aucun port** — c'est pour cela
qu'il est séparé, et `src/tests/relais.test.ts` le tient. Anti-spam sans le moindre service
tiers, parce qu'un captcha hébergé ailleurs ferait entrer un tiers dans une page qui n'en a
aucun : leurre, délai minimal, plafonds par champ, compte de liens, cinq envois par heure,
et l'origine déclarée quand le navigateur en déclare une.
Le délai est mesuré par le navigateur, donc falsifiable, et c'est écrit plutôt que passé sous silence.

**Ces six protections arrêtent le spam automatique, pas quelqu'un qui vise ce site-ci**, et
c'est à dire ainsi plutôt qu'à laisser croire l'inverse. Le contrôle d'origine, en
particulier, N'EST PAS UNE PORTE : un client qui n'est pas un navigateur ne pose pas
d'en-tête `Origin`, et une absence est **acceptée** — la refuser casserait `curl` et les
tests de fumée sans arrêter personne, puisqu'il suffirait de ne rien envoyer. Ce qu'il ferme
est le formulaire recopié sur une autre page, qui posterait ici depuis le navigateur d'un
visiteur. L'origine attendue est `URL_PUBLIQUE`, **la même variable que l'adresse publique
de la vitrine** : une seule valeur, donc pas de montage où les deux services désignent deux
sites différents.

**Ce que le formulaire a rendu faux, et qui a été réécrit avec lui** : `pied.viePrivee` et
`mentions.donneesCorps`, dans les cinq langues, annonçaient que rien ne sort. Leur
contrepartie est `contact.formulaireNote`, qui dit ce que le message emporte et combien de
temps il est gardé — **douze mois**. C'est le même couple que le « 0 » de la bande de
chiffres et sa note : ne pas rouvrir l'un sans rouvrir l'autre.

Les identifiants viennent ENTIÈREMENT de l'environnement (`.env.exemple` dit quoi poser,
Dokploy pose les valeurs). Rien n'est écrit dans le dépôt, et le service refuse de démarrer
si une variable manque — une variable oubliée qui ne se verrait qu'au moment où un parent
écrit est un défaut qui coûte un message réel.

### Le mouvement est étagé, pas interrupté

`src/mouvement/useNiveauMouvement.ts` rend `complet` / `reduit` / `aucun`. **Le premier
rendu est toujours `aucun`** — c'est aussi ce que produit le pré-rendu, et les deux doivent
concorder. Deux règles pour toute animation ajoutée :

1. **Rien d'important ne dépend d'une animation pour être visible.** D'où l'entrée du héros
   en CSS pure, et `Revele` qui rend un élément nu quand le niveau vaut `aucun`.
2. **Seuls `transform` et `opacity`.** (La réserve « et les uniformes du shader » est
   tombée avec le shader : il n'y a plus de fond WebGL.)

### Les liens, et l'interrupteur

Toutes les adresses extérieures sont dans `src/config.ts`, **et nulle part ailleurs**.
`URL_APP` vaut `https://app.schoulbus.lu` ; en changer déplace le QR (`npm run assets:qr`,
puis commiter). `APP_PUBLIEE` — aujourd'hui `true` — commande d'un seul geste les boutons,
le QR, les entrées de pied de page et le `SoftwareApplication` du balisage structuré, et
la mention « bientôt disponible » qui les remplace quand il est fermé. Les deux états sont
testés (`src/tests/rendu.test.ts`) : il n'existe pas d'état intermédiaire où la moitié
des liens serait revenue. Le `<noscript>` en fait partie depuis qu'il est engendré par
langue (`blocNoscript` dans `src/entree-serveur.ts`, posé par le pré-rendu) : `index.html`
n'en porte plus qu'un repère vide, et un test vérifie les cinq langues.

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
| `src/pages/` | Les pages hors accueil : `independance` (toujours engendrée), `mentions` (seulement si `ADRESSE_EDITEUR` est renseignée). Le nom de la page EST son segment d'adresse — même règle dans `cheminPage()` et dans le `dossier()` du pré-rendu. |
| `src/composants/` | Briques réutilisées : `Cadre` (l'encadrement d'une capture), `Ecrans` (les captures), `Icones`, `Bouton`, `LogoBus`, `Selecteurs`. |
| `src/mouvement/` | Niveau de mouvement, révélation au défilement, défilement doux. |
| `src/styles/` | `jetons.css` (copie de l'application), puis vitrine / composants / sections. |
| `scripts/` | Tout ce qui engendre : captures, chiffres, vignettes, QR, jetons, contrastes, pré-rendu. |
| `src/tests/` | Invariants du contenu et du rendu. |
| `serveur/` | Le relais de courriel. Paquet à part, sans TypeScript ni construction : il doit pouvoir démarrer avec `node index.mjs`. |

## Déploiement

Docker à deux étages (Node construit, nginx sert), Dokploy sur `schoulbus.lu`. La CSP est
posée en `<meta>` par `vite.config.ts`, parce que l'empreinte du script anti-clignotement
s'y calcule ; l'en-tête HTTP ne porte que `frame-ancestors`.

**DEUX CONTENEURS DEPUIS LE FORMULAIRE DE CONTACT**, décrits par `compose.yml` : `vitrine`
(nginx, sur `dokploy-network` et sur `interne`) et `relais` (sur `interne` SEULEMENT — voir
« Le relais »). Le second n'a ni port publié ni accès à Traefik, et ce n'est pas un oubli.
Les variables du relais se posent dans Dokploy — `.env.exemple` dit lesquelles, `.env` est
ignoré par git et doit le rester.

**LE ROUTAGE N'EST PAS DANS `compose.yml`.** Les deux domaines sont des entrées de domaine
Dokploy posées sur le service `vitrine`, port 80 — et `schoulbus.lu` y porte le middleware
`redirect-to-www-schoulbus@file`, qui est ce qui rend le **301** vers `www`. Le dépôt frère,
lui, écrit ses propres étiquettes Traefik dans son compose ; ici on ne le fait pas, parce que
recopier ce montage à la main serait réécrire sans filet la seule partie du déploiement qui
marche déjà. **Si la redirection de l'apex disparaît un jour, c'est ce middleware qu'il faut
regarder**, pas nginx : `nginx.conf` ne redirige rien.

**Le suffixe `@file` du middleware n'est pas décoratif**, et c'est le piège qui a coûté le
plus de temps à la bascule du 14 septembre 2026. Dokploy matérialise un domaine de compose
en **étiquettes Traefik**, donc en provenance *docker* : un middleware nommé sans son
fournisseur y est cherché sous `…@docker`, introuvable, et **Traefik jette le routeur
entier** — l'apex rend alors 404, sans que rien ne dise pourquoi. L'ancienne application ne
connaissait pas ce défaut parce qu'elle passait par le fournisseur *file*, où le nom nu
résolvait. Deux corollaires : **un domaine de compose n'existe qu'après un
`compose.deploy`** (les étiquettes sont écrites au déploiement, pas à l'enregistrement du
domaine), et **`domain.update` de l'API Dokploy ne déplace pas un domaine d'une application
vers un compose** — il rend 200, écrit `domainType` et `serviceName`, et ignore
silencieusement `composeId`. Il faut supprimer puis recréer.

## Documentation

- **[README.md](README.md)** — présentation, charte, **et la section « Réserves ouvertes »**.
  À lire avant d'entamer une évolution, et **à mettre à jour à la fin** : une réserve dite
  et non écrite est une réserve perdue, elle réapparaît en panne trois mois plus tard.
- `../bus-scolaire-beckerich/CLAUDE.md` — le dépôt frère, si la question porte sur ce que
  l'application fait vraiment. **C'est la source à consulter avant d'écrire une
  affirmation** sur son comportement.

## Réserve la plus urgente

**Le luxembourgeois n'a pas été relu par une personne dont c'est la langue maternelle**, et
la refonte a réécrit presque chaque chaîne du fichier — une phrase d'une ligne pardonne
moins qu'un paragraphe, faute de contexte autour pour rattraper un mot mal choisi. Le
portugais et l'anglais sont dans le même cas, en première rédaction. C'est la langue du
foyer dans une bonne part de la commune, et la vitrine est publiée : refermer
l'interrupteur ne change rien à cela. C'est la seule réserve du projet qui demande une
personne plutôt qu'une commande. Voir l'en-tête de `src/contenu/lb.ts` et les réserves du
README.

## Un piège connu : régénérer les captures

`scripts/captures.mjs` photographie l'application **telle qu'elle est dans `DEPOT_APP`**, et
inscrit la révision trouvée dans `scripts/captures.source.json` ; l'intégration continue
extrait ensuite l'application à cette révision et compare. Reproduire les captures
existantes demande donc de sortir l'application à la révision inscrite ; en produire de
nouvelles demande de la sortir là où l'on veut aller.

**Ne pas déplacer le dépôt frère sous quelqu'un d'autre.** Il peut être sur une branche de
travail, avec des changements non commités. Un clone jetable coûte une minute et ne touche
à rien :

```bash
git clone --no-hardlinks --branch main ../bus-scolaire-beckerich /tmp/app-main
cp -a ../bus-scolaire-beckerich/node_modules /tmp/app-main/node_modules
docker run --rm -u $(id -u):$(id -g) -v "$PWD":/vitrine -v /tmp/app-main:/app \
  -w /vitrine -e DEPOT_APP=/app -e HOME=/tmp \
  "$(node -p "require('./scripts/captures.source.json').imagePlaywright")" npm run captures
```

**L'image est épinglée par EMPREINTE, et l'empreinte n'est écrite qu'à un endroit** —
`imagePlaywright` dans `scripts/captures.source.json`, à côté de la révision de
l'application. Les deux moitiés du déterminisme sont le code photographié et l'appareil qui
photographie ; seule la première était enregistrée. `mcr.microsoft.com/playwright:v1.62.1-noble`
est une étiquette, que Microsoft republie : le jour où elle bouge, dix fichiers deviennent
différents sans qu'aucun ne soit faux, et rien dans le dépôt ne dit que la cause est l'image.

`captures.mjs` réécrit ce fichier en entier à chaque exécution et **reconduit l'empreinte
telle quelle** : un conteneur ne peut pas lire l'empreinte de sa propre image, donc
l'épinglage est une déclaration, jamais un relevé. Sans empreinte, le script s'arrête.

### Monter volontairement d'image

C'est une décision datée, pas une mise à jour subie. Dans cet ordre, et le résultat se
commite d'un seul lot :

```bash
docker pull mcr.microsoft.com/playwright:v1.63.0-noble
docker image inspect mcr.microsoft.com/playwright:v1.63.0-noble \
  --format '{{json .RepoDigests}}'          # l'empreinte à inscrire
npm i -D playwright@1.63.0                  # le lockfile doit suivre : la CI le vérifie
```

Inscrire l'empreinte relevée dans `imagePlaywright`, régénérer
(`npm run captures:conteneur`), **regarder ce qui a bougé** — l'écart attendu porte sur les
dix `semaine-*`, qui portent une carte Leaflet — puis commiter l'empreinte, le lockfile et
les captures ENSEMBLE. Séparés, la CI rougit sur la révision du milieu.

Le piège proprement dit : **le script franchit trois portes avant de photographier** — le
choix de la langue, l'avertissement d'indépendance, la reprise de la configuration reçue
par lien. Quand l'application en ajoute une, le script attend trente secondes un bouton qui
n'est pas encore à l'écran et échoue sur un clic introuvable, sans dire lequel des trois
écrans manque. C'est arrivé avec `ChoixLangueInitial`. Le remède est toujours le même :
regarder ce que l'application affiche vraiment (un `page.screenshot()` suffit) et
corriger le script, jamais le contourner.
