# Vitrine — Bus scolaire Beckerich

Page de présentation du site [Bus scolaire Beckerich](https://github.com/Sashimee/bus-scolaire-beckerich).
Elle explique ce que fait l'application, ce qu'elle ne sait pas faire, et mène vers elle.

**C'est un projet distinct de l'application.** Deux dépôts, deux constructions, deux
déploiements. La vitrine ne partage avec l'application que sa charte graphique, reprise
par script, et son adresse, posée dans un seul fichier.

| | Application | Vitrine |
| --- | --- | --- |
| Rôle | outil quotidien, personnalisé par enfant | page publique, une seule fois lue |
| Rendu | application monopage | HTML statique pré-rendu, une page par langue |
| Référencement | `noindex` — ne doit pas concurrencer la page officielle de la commune | indexée, c'est son métier |
| Langues | fr, de, lb, pt, en | fr, de, lb, pt, en |
| Données | horaires, arrêts, adresses | aucune — elle ne fait que décrire |

## Le flux de branches

`main` est le site en production : ce qui y arrive part en ligne. On n'y travaille jamais
directement, ni sur `dev`, qui est la branche d'intégration.

```
branche de travail  ──►  dev  ──►  main (en ligne)
```

Une branche par sujet, partant de `dev`. Quand tout passe, fusion dans `dev` ; quand `dev`
est sain, fusion dans `main`. Un correctif d'une ligne suit le même chemin qu'un lot
entier. La vérification continue tourne sur `dev`, sur `main` et sur les *pull requests*.

## Commandes

```bash
npm run dev          # serveur de développement
npm run build        # construction + pré-rendu des cinq langues dans dist/
npm run preview      # sert dist/ tel qu'il sera publié
npm run verifier     # types, lint, tests, contrastes, dérive des jetons
```

Individuellement :

```bash
npm run typecheck
npm run lint
npm test
npm run contraste          # chaque couple encre/fond sur la composition réelle
npm run jetons:verifier    # les jetons ont-ils divergé de ceux de l'application ?
npm run jetons:reprendre   # les reprendre depuis l'application
npm run chiffres           # régénérer src/contenu/chiffres.ts depuis les données
npm run assets:qr          # régénérer le QR vers URL_APP
npm run assets:partage     # régénérer les vignettes de partage et les icônes matricielles
npm run captures           # rephotographier l'application (voir plus bas)
npm run captures:conteneur # la même chose dans le conteneur épinglé — CELLE QU'ON COMMITE
```

### Les écrans montrés sont de vraies captures

Les cinq cadres de la page — celui du héros et les quatre de la bande « Quatre écrans » —
contiennent des photographies de l'application, pas des reconstructions : `public/captures/{écran}-{langue}-{thème}.webp`, soit quatre écrans ×
cinq langues × deux thèmes = quarante fichiers, produits par `npm run captures`.

Ils l'ont longtemps été. `src/composants/Ecrans.tsx` redessinait les écrans en DOM et en
CSS, ce qui suivait le thème et la langue sans effort et ne pixellisait jamais. Mais une
reconstruction est une deuxième source de vérité sur le même produit, et c'est la deuxième
qui dérive : la nôtre annonçait « Étape 2 sur 4 » quand l'assistant en compte sept, plaçait
la journée courte le mercredi quand ce sont le mardi et le jeudi, et donnait une adresse
dans une rue qui n'existe pas. Aucun test ne pouvait le voir, faute d'avoir quoi comparer.

Le script photographie le **serveur de développement de l'application**, jamais le site
publié, et neutralise tout ce qui n'est pas reproductible : horloge figée au mardi
22 septembre 2026 à 07:25, tuiles de carte servies depuis `scripts/fixtures/tuiles/`,
perturbations et traductions servies vides, révision affichée fixée à celle qui est
photographiée. Le foyer de démonstration est posé par le **lien de partage de
l'application** — une interface publique et versionnée — et non par une clé de stockage
recopiée ici. Son adresse est au niveau de la rue, jamais au numéro : la fiche de la
semaine dessine le vrai voisinage sur une carte.

Trois choses que le script REFUSE de laisser passer, plutôt que de produire une image qui
a l'air d'aller : une tuile absente des fixtures, une carte modale par-dessus l'écran, un
foyer incomplet. Il vérifie aussi le poids — 60 ko par fichier, 1,4 Mo pour l'ensemble.

Les captures sont **déterministes au bit près à environnement égal**, ce qui est toute la
condition pour que l'intégration continue puisse les comparer. « À environnement égal » est
la partie qui compte : six des vingt-quatre fichiers engendrés sur une machine de
développement diffèrent de ceux du conteneur, la pile de polices et la version de Chromium
décidant du rendu au pixel près.

**Ce sont donc les captures DU CONTENEUR qui sont commitées.** `npm run captures` sert à
itérer ; `npm run captures:conteneur` produit ce qui est versionné, dans la même image que
l'intégration continue. Régénérer avec le premier et commiter le résultat fait échouer le
contrôle de dérive — sans que rien ne soit faux dans les images, ce qui est la façon la
plus déroutante d'échouer.

> Les tuiles de `scripts/fixtures/tuiles/` proviennent d'OpenStreetMap et sont soumises à
> l'ODbL. L'attribution est rendue dans l'image elle-même, par Leaflet.

### Les ressources engendrées sont commitées

`public/partage*.png`, `public/apple-touch-icon.png`, `public/favicon-32.png`,
`public/qr-application.svg` et `public/captures/` ne sont PAS produits par `npm run build`. Ils sont engendrés à
la main, puis commités — sans quoi la construction, et donc le conteneur, dépendraient de
`satori`, de `resvg` et d'une bibliothèque de QR pour redessiner à l'identique des fichiers
qui ne changent qu'avec le titre de la page.

Le risque de ce choix est qu'ils cessent un jour de correspondre au texte : l'intégration
continue les régénère donc à chaque poussée et refuse la révision s'ils ont bougé.

Les vignettes sont dessinées avec la police du site, lue dans `node_modules` et convertie
en tracés. Elles ne dépendent donc d'aucune police installée sur la machine — c'est ce qui
distingue ce script de celui de l'application, dont la vignette prend la police du système.

## Ce qu'il faut savoir avant d'y toucher

### La charte est écrite ici, désormais — et seulement la charte

Il faut distinguer deux choses qui vivaient au même endroit.

**`src/styles/jetons.css` reste une copie conforme** de la couche `tokens` de
l'application. On ne la modifie pas : on modifie celle de l'application, puis
`npm run jetons:reprendre`. `npm run jetons:verifier` échoue si les deux ont divergé, et
fait partie de `npm run verifier`. Ce fichier n'a pas été touché par la refonte.

**Les COULEURS, elles, ne viennent plus de là.** La vitrine a sa propre palette — crème,
sarcelle, corail — déclarée dans la couche `vitrine` de `src/styles/vitrine.css`, qui
redéfinit les rôles (`--encre`, `--surface`, `--accent`…) après la couche `tokens` dans la
cascade. Tout ce qui lisait `var(--encre)` lit la nouvelle valeur sans avoir été réécrit,
et `jetons.css` continue de passer son contrôle de dérive.

Pourquoi cet écart, alors que les deux dépôts partageaient tout : l'application est un
outil qu'on ouvre à 07:25 dans une main, et son fond sombre sert la lisibilité d'une heure
lue à bout de bras. La page qu'on lit une fois doit d'abord donner envie de la lire
jusqu'aux limites, et un dégradé sombre y lit « produit » plutôt que « voisin qui
explique ». Le prix est réel et il est assumé : les deux sites ne se ressemblent plus au
premier coup d'œil, et une capture de l'application posée dans un cadre crème montre deux
palettes à la fois.

Sémantique des deux accents, à ne pas diluer : **sarcelle = ce qui est vrai et
vérifiable** (heures, arrêts, action principale) ; **corail = ce qui presse ou ce qui
nuance** (décompte, limites, « bientôt »). Rien de décoratif ne prend le corail.

Comme dans l'application : **aucune valeur brute hors de la couche des jetons, aucun
`style={{…}}` dans une composante** — il n'y a plus d'exception depuis que la barre de
progression a disparu de l'en-tête —, **toute cible tactile ≥ 44 px, tout couple
encre/fond vérifié à 4,5:1**. Les surfaces étant désormais opaques, `npm run contraste` ne
simule plus d'empilement : il calcule exactement. Le pire cas est à **5,05:1** en thème
clair et **6,12:1** en sombre. Deux couples seulement sont vérifiés à 3:1, le seuil des
grands caractères et des éléments non textuels : le corail vif du mot « seize minutes »
(28 à 42 px, graisse 600) et le tracé de l'icône des perturbations. Le script nomme chaque
couple et l'endroit où il se rencontre.

### Le mouvement est étagé, pas interrupté

`src/mouvement/useNiveauMouvement.ts` rend trois niveaux :

| Niveau | Quand | Ce qui tourne |
| --- | --- | --- |
| `complet` | souris, écran large, ≥ 4 cœurs | défilement doux, aimants des boutons, révélations au défilement |
| `reduit` | tactile, ou machine modeste | révélations au défilement conservées, défilement natif |
| `aucun` | « réduire les animations » demandé | rien ne bouge, tout est lisible |

La refonte a **retiré le nuage WebGL, le curseur personnalisé, le brouillage de l'heure et
les projecteurs des cartes**. La charte pose une surface unie : un shader qui peint du
crème uni est un shader qu'on maintient pour rien, et une lueur qui suit la souris sur du
papier crème ne ressemble à rien. Le niveau `complet` a donc beaucoup moins à faire
qu'avant, et le premier rendu ne compile plus de shader.

Le premier rendu est **toujours** `aucun` — c'est aussi ce que produit le pré-rendu, et
les deux doivent concorder pour que React hydrate au lieu de tout refaire.

Deux règles s'appliquent à toute animation ajoutée ici :

1. **Rien d'important ne doit dépendre d'une animation pour être visible.** Une animation
   confiée à JavaScript laisse son élément dans l'état de départ tant que le script n'a
   pas tourné : onglet d'arrière-plan où les images sont suspendues, scripts coupés,
   erreur en cours de route. C'est pourquoi toute l'entrée du héros — le titre de la
   page — est en CSS, et pourquoi `Revele` rend un élément nu tant que le niveau vaut
   `aucun`.
2. **Seuls `transform` et `opacity`** (et les uniformes du shader). Jamais une hauteur,
   une bordure ou un flou : cela remet la page en page à chaque image.

### Le pré-rendu

`npm run build` enchaîne trois étapes : construction du paquet client, construction d'un
paquet serveur (`src/entree-serveur.ts`), puis `scripts/prerendu.mjs`, qui rend les cinq
langues en HTML complet et écrit `sitemap.xml` et `robots.txt`.

```
dist/index.html                   français (langue de référence, à la racine)
dist/de/index.html                allemand
dist/lb/index.html                luxembourgeois
dist/pt/index.html                portugais
dist/en/index.html                anglais
dist/independance/index.html      la mention d'indépendance, une page par langue
dist/de/independance/index.html   … et ainsi de suite pour lb, pt, en
```

La vitrine parlait trois langues quand l'application en parlait cinq — et sa propre bande
de chiffres annonçait « 5 langues, dont le luxembourgeois ». Une page qui vante cinq
langues en trois langues se contredit à voix haute, et elle se contredit devant les deux
familles qui avaient le plus besoin d'être lues. Un test lie désormais les deux nombres
(`contenu.test.ts`).

L'indépendance a sa page depuis qu'elle a quitté l'accueil, où elle tenait une section
entière juste avant l'appel final. Elle n'est plus au premier plan, mais elle n'a pas
disparu : l'accueil continue de dire « site indépendant » dans son étiquette, son pied de
page et sa vignette de partage, et la page porte la phrase qui n'existe nulle part ailleurs
— celle qui dit que le document de la commune fait foi. On y accède par un lien discret du
pied de page.

Les mentions légales viendront s'ajouter en quatrième page le jour où `ADRESSE_EDITEUR`
sera renseignée (voir plus bas).

Le changement de langue dans la page ne recharge rien : le contenu est déjà dans le
paquet, seule l'adresse est mise à jour. Les cinq URL existent pour les moteurs et pour
le partage.

Attention aux **locales Open Graph** : elles ne sont pas le code de langue suivi de `_LU`.
`fr_LU`, `de_LU` et `lb_LU` existent ; `pt_LU` et `en_LU` non, et les réseaux qui lisent
ces balises les ignorent en silence — le partage retombe alors sur la langue par défaut,
exactement là où cela coûte le plus. Le portugais prend `pt_PT` et l'anglais `en_GB`
(`entree-serveur.ts`, et un test qui le tient).

### Où mènent les liens

`src/config.ts`, et nulle part ailleurs. `URL_APP` pointe aujourd'hui vers GitHub Pages ;
le jour où l'application prend un domaine propre, cette ligne change, et le QR se
régénère avec `npm run assets:qr`.

### Pour l'instant, ils n'y mènent pas

`APP_PUBLIEE` vaut `false` dans `src/config.ts`. L'application est encore en développement,
et la vitrine la **décrit** sans y conduire : pas de bouton, pas de QR, pas d'entrée de pied
de page, pas de `SoftwareApplication` dans le balisage structuré. À leur place, une mention
« bientôt disponible » dans le héros et dans la section finale, et un renvoi vers le plan
officiel de la commune.

L'interrupteur a été ouvert un jour, puis refermé le lendemain. C'est son usage prévu, et la
démonstration qu'il en est bien un : les deux bascules n'ont demandé qu'une constante et une
ligne de HTML statique, les deux états restant testés (`src/tests/rendu.test.ts`).

Une seule chose n'est pas du code : le `<noscript>` d'`index.html`. Elle n'est plus pour
autant une affaire de mémoire — un test vérifie que ce bloc nomme l'application **si et
seulement si** `APP_PUBLIEE` le dit, et il a effectivement réclamé la correction lors de
cette refermeture.

Deux nuances à connaître, parce qu'elles limitent ce que « ne mène pas à l'application »
veut dire :

- **L'application reste joignable.** Elle est publiée sur GitHub Pages ; qui connaît
  l'adresse y entre. Retirer les liens d'ici ne la dépublie pas — cela se décide dans son
  dépôt à elle.
- **Son adresse reste dans le paquet JavaScript**, comme donnée de configuration :
  `sansApplication()` en a besoin pour filtrer le pied de page. Elle est lisible par qui
  ouvre le fichier, et de toute façon présente dans ce dépôt.

## Réserves ouvertes

La refonte en a levé cinq et en a ouvert deux. Elles sont classées par ce qu'elles coûtent
à refermer, la plus chère d'abord.

- **Les traductions portugaise et anglaise sont des premières rédactions**, et la
  luxembourgeoise l'est redevenue. Le vocabulaire suit celui de l'application
  (`paragem`/`morada`, `stop`/`on foot`) plutôt qu'un dictionnaire, ce qui écarte le
  contresens mais pas la maladresse. Pour le luxembourgeois, la réserve **s'est aggravée** :
  la refonte a réécrit presque chaque chaîne du fichier, les tuiles et les limites passant
  d'un paragraphe à une ligne — et une phrase courte pardonne moins qu'une longue, faute de
  contexte autour pour rattraper un mot mal choisi. C'est la langue du foyer dans une bonne
  part de la commune, et la vitrine est publiée. **C'est la seule réserve qui demande une
  personne plutôt qu'une commande.**

- **Le thème sombre est une DÉRIVATION, pas une maquette.** La maquette approuvée ne
  définit que le thème clair. Les valeurs sombres — crème inversé en vert-noir, sarcelle et
  corail éclaircis — ont été construites ici, en tenant les rôles et la sémantique des deux
  accents. Elles ont depuis été calculées (pire couple à 6,12:1, plus confortable qu'en
  clair) **et regardées** : la page entière a été capturée dans les deux thèmes, et les
  captures de l'application y basculent bien avec elle. Ce qui reste non validé est le
  GOÛT : personne d'autre que la machine n'a encore donné son avis sur ce vert-noir.

- **La page n'a toujours pas été ouverte sur un vrai téléphone.** Un émulateur ne rend ni
  les polices du système, ni la barre d'adresse qui mange la hauteur, ni les marges de
  sécurité d'un écran à encoche — ces dernières sont posées dans la feuille de style,
  jamais vues à l'œuvre.

- **Les contrastes sont calculés, pas mesurés à la pipette.** `npm run contraste` calcule
  ce que le navigateur devrait afficher ; il ne lit pas l'écran. La refonte a rendu ce
  calcul plus fiable — les surfaces sont opaques, il n'y a plus d'empilement de voiles à
  simuler — mais pas différent de nature.

- **Les captures dépendent de l'environnement qui les produit.** Réserve inchangée sur le
  fond : six fichiers sur vingt-quatre différaient entre le conteneur et une machine de
  développement — les `semaine-*`, seul écran qui porte une carte Leaflet. D'où
  `npm run captures:conteneur`, et la règle qu'on ne commite que sa sortie. Avec quarante
  fichiers, l'écart attendu passe mécaniquement à dix. Ce qui reste inconnu : le
  comportement le jour où l'étiquette du conteneur changera.
  *Note pratique apprise en refaisant les captures :* le script photographie l'application
  **à la révision inscrite dans `scripts/captures.source.json`** (aujourd'hui `509b621`),
  pas à son `HEAD`. Sur un `HEAD` plus récent, l'avertissement d'indépendance ne s'ouvrait
  plus au même endroit et le script échouait sur un clic introuvable. Sortir l'application
  à cette révision avant de lancer les captures, comme le fait l'intégration continue.

- **Le conteneur n'a pas encore tourné ailleurs qu'ici.** L'image se construit, se lance,
  et ses en-têtes ont été relevés à la main (voir plus bas) — mais sur cette machine, en
  HTTP, sans Traefik devant. Le point à surveiller au premier déploiement est
  `Strict-Transport-Security` : il part de nginx, et Dokploy ne doit pas le reposer.

### Réserves levées par cette refonte

- *« Le nuage WebGL n'a été vu qu'à l'arrêt. »* — Il n'y a plus de nuage WebGL. `Fond.tsx`,
  `fond.glsl.ts` et le curseur personnalisé ont été retirés avec le dégradé qu'ils
  animaient. La réserve disparaît avec son objet, ce qui est la seule bonne façon d'en
  refermer une.

- *« La construction n'a pas été vérifiée. »* — `npm run verifier` passe : 81 tests sur 81,
  contrastes tenus dans les deux thèmes, jetons conformes à l'application. `npm run build`
  pré-rend les cinq langues et leurs pages d'indépendance.

- *« Il manque seize captures et cinq vignettes de partage. »* — Les quarante captures ont
  été engendrées dans le conteneur épinglé, et les vingt-quatre existantes en sont
  ressorties **octet pour octet identiques** : la reproductibilité est vérifiée, pas
  supposée. Les cinq vignettes et les icônes matricielles ont été régénérées.

- *« La mise en page n'a été vue par aucun navigateur. »* — Elle a été construite, servie et
  mesurée dans Chromium à 390, 600, 768, 900, 1024, 1280 et 1440 px, dans les deux thèmes,
  plus un profil tactile (Pixel 7). Trois défauts s'y trouvaient, tous corrigés :
  1. **15 px de débord de document** à 390 px, dus au halo du héros (`inset: … -10% …`) ;
     la section le coupe désormais à son bord.
  2. **Les liens du pied de page étaient tombés à 23 px de haut.** La règle des 44 px
     existait avant la refonte et je l'avais perdue en réécrivant `sections.css`. Rétablie —
     c'est le seul endroit d'où ces pages sont atteignables.
  3. **Les six limites se posaient en 4 + 2.** Le plancher de 248 px de la maquette laisse
     entrer quatre colonnes dans une bande de 1 240 px ; la deuxième rangée à moitié vide
     est exactement ce que la règle « trois ou six » existe pour empêcher. Plancher porté à
     280 px, ce qui force trois colonnes.
  Reste, sur pointeur fin uniquement, les sélecteurs de l'en-tête à 34 px : c'est l'exception
  documentée, et elle tient — sur pointeur grossier ils sont masqués, le pied de page les
  porte à taille pleine, et le relevé sur Pixel 7 ne trouve **aucune** cible sous 44 px.

- *« Le budget de poids des captures. »* — Il était global (1,4 Mio) et calibré sur trois
  langues ; cinq langues le faisaient échouer sans qu'aucune image n'ait grossi. Il est
  désormais **par langue** (480 ko), ce qui conserve la marge d'origine et ne se
  redemandera plus à chaque langue ajoutée.

## Le déploiement

Une image Docker en deux étapes : Node construit, nginx sert. Rien d'autre ne tourne — le
site est statique.

```bash
docker build -t vitrine \
  --build-arg URL_PUBLIQUE=https://schoulbus.lu \
  --build-arg DATE_CONTENU=$(git log -1 --format=%cs -- src index.html public) .
docker run --rm -p 8080:80 vitrine
```

`URL_PUBLIQUE` entre dans les métadonnées de partage, qui exigent des adresses absolues :
elle est donc connue à la construction, pas au démarrage. `DATE_CONTENU` sert au `lastmod`
du plan du site ; le dépôt Git n'étant pas copié dans l'image, sans elle la balise est
omise — jamais remplacée par la date de construction, qui ne dirait rien de vrai.

L'étape de construction lance `npm run verifier` avant `npm run build` : une image ne peut
pas être publiée si les types, le lint, les tests, les contrastes ou les jetons tombent.

### Ce que nginx pose, et ce qu'il ne pose pas

La politique de sécurité du contenu vit dans la balise `<meta>` engendrée par
`vite.config.ts`, parce que c'est là qu'est calculée l'empreinte du script
anti-scintillement de `index.html`. L'en-tête HTTP ne porte donc QUE `frame-ancestors`,
que la spécification demande d'ignorer dans une balise. Deux politiques s'intersectent : en
recopier une deuxième version ici rebloquerait le script au premier oubli.

Les en-têtes communs sont dans `nginx-entetes.conf`, réintroduits par `include` dans chaque
bloc `location` — un `add_header` posé dans un `location` remplace ceux du serveur au lieu
de s'y ajouter, silencieusement.

### Dokploy

Application de type Dockerfile, domaine `schoulbus.lu`, TLS par le Traefik de Dokploy. Le
`HEALTHCHECK` de l'image permet à Dokploy de distinguer un déploiement cassé d'un
déploiement réussi. L'intégration continue (`.github/workflows/verifier.yml`) ne déploie
rien : elle refuse une révision qui ne se vérifie pas, et construit l'image à blanc.

## Source des données

Les chiffres affichés — arrêts, villages, lignes, rues — sont engendrés depuis les données
de l'application (`npm run chiffres`), elles-mêmes tirées du plan officiel de la commune,
année scolaire 2025/2026. Aucun n'est estimé.

Ce site est indépendant, réalisé à titre privé, sans lien avec l'administration communale
de Beckerich ni avec l'école. En cas de doute, le document officiel de la commune fait
foi : <https://kanner.beckerich.lu/infos/horaires-de-bus>.
