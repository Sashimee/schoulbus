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
| Langues | fr, de, lb, pt, en | fr, de, lb |
| Données | horaires, arrêts, adresses | aucune — elle ne fait que décrire |

## Commandes

```bash
npm run dev          # serveur de développement
npm run build        # construction + pré-rendu des trois langues dans dist/
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

Les quatre téléphones de la page contiennent des photographies de l'application, pas des
reconstructions : `public/captures/{écran}-{langue}-{thème}.webp`, soit quatre écrans ×
trois langues × deux thèmes = vingt-quatre fichiers, produits par `npm run captures`.

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

### La charte n'est pas écrite ici

`src/styles/jetons.css` est une **copie conforme** de la couche `tokens` de
l'application. On ne la modifie pas : on modifie celle de l'application, puis
`npm run jetons:reprendre`. `npm run jetons:verifier` échoue si les deux ont divergé, et
fait partie de `npm run verifier`.

Ce que la vitrine ajoute en propre — échelle d'affichage, durées longues, rythme des
sections — vit dans `src/styles/vitrine.css`, préfixé `--vitrine-`.

Comme dans l'application : **aucune valeur brute hors de la couche des jetons, aucun
`style={{…}}` dans une composante, toute cible tactile ≥ 44 px, tout couple encre/fond
vérifié à 4,5:1** sur la composition réelle — dégradé, halo, voile de verre. Le pire cas
courant est à 5,20:1 (`npm run contraste`).

### Le mouvement est étagé, pas interrupté

`src/mouvement/useNiveauMouvement.ts` rend trois niveaux :

| Niveau | Quand | Ce qui tourne |
| --- | --- | --- |
| `complet` | souris, écran large, WebGL2, ≥ 4 cœurs | nuage WebGL, défilement doux, curseur, brouillage, aimants, projecteurs |
| `reduit` | tactile, ou machine modeste | dégradé CSS au lieu du nuage ; révélations au défilement conservées |
| `aucun` | « réduire les animations » demandé | rien ne bouge, tout est lisible |

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
paquet serveur (`src/entree-serveur.ts`), puis `scripts/prerendu.mjs`, qui rend les trois
langues en HTML complet et écrit `sitemap.xml` et `robots.txt`.

```
dist/index.html      français   (langue de référence, à la racine)
dist/de/index.html   allemand
dist/lb/index.html   luxembourgeois
```

Le changement de langue dans la page ne recharge rien : le contenu est déjà dans le
paquet, seule l'adresse est mise à jour. Les trois URL existent pour les moteurs et pour
le partage.

### Où mènent les liens

`src/config.ts`, et nulle part ailleurs. `URL_APP` pointe aujourd'hui vers GitHub Pages ;
le jour où l'application prend un domaine propre, cette ligne change, et le QR se
régénère avec `npm run assets:qr`.

### Et maintenant, ils y mènent

`APP_PUBLIEE` vaut `true` dans `src/config.ts`. L'application est en ligne et en service
réel — un représentant de l'école y a publié de vraies perturbations. Les boutons, le QR,
les entrées de pied de page et le `SoftwareApplication` du balisage structuré sont donc
revenus, tous en même temps, aux endroits où ils étaient prévus.

L'interrupteur reste un interrupteur : le repasser à `false` retire tout d'un coup, et les
deux états sont toujours testés (`src/tests/rendu.test.ts`). Le risque que ces tests
couvrent n'est pas le tri d'aujourd'hui, c'est la section ajoutée dans six mois.

Deux choses n'étaient pas du code et devaient être faites à la main le jour de la
publication : le `<noscript>` d'`index.html`, et la régénération du QR. La première est
faite — et **elle n'est plus une affaire de mémoire** : un test vérifie désormais que le
`<noscript>` nomme l'application si et seulement si `APP_PUBLIEE` le dit. La seconde s'est
révélée sans effet, `URL_APP` n'ayant pas changé.

Une nuance à connaître : l'adresse de l'application était déjà présente dans le paquet
JavaScript avant la publication, comme donnée de configuration — lisible par qui ouvrait le
fichier, même si aucun lien n'y menait. Elle l'est de toute façon dans ce dépôt.

## Réserves ouvertes

- **La traduction luxembourgeoise n'a pas été relue par une personne dont c'est la langue
  maternelle.** C'est la langue du foyer dans une bonne part de la commune ; une tournure
  fausse s'y remarque immédiatement.
  Cette réserve a changé de nature : `APP_PUBLIEE` vaut désormais `true`, donc la page est
  en ligne et mène à l'application. Ce qui était « à faire relire avant publication » est
  maintenant **publié sans relecture**, devant le public le plus à même de le remarquer.
  C'est la réserve la plus urgente des cinq.
- **Les captures dépendent de l'environnement qui les produit.** Réserve levée pour la
  partie qui était incertaine : la comparaison a tourné en intégration continue, et l'écart
  supposé entre le Chromium du conteneur et celui d'une machine de développement s'est
  vérifié — six fichiers sur vingt-quatre. D'où `npm run captures:conteneur`, et la règle
  qu'on ne commite que sa sortie. Ce qui reste inconnu : le comportement le jour où
  l'étiquette du conteneur changera. L'étape « concordance » du workflow refusera la
  révision, ce qui est le but, mais personne ne l'a encore vue le faire.
- **Les largeurs étroites ont été mesurées dans un moteur de rendu, pas sur un appareil.**
  La page a été ouverte dans Chromium à 320, 360, 390, 414 et 768 px, en thème clair et
  sombre, dans les trois langues, avec émulation tactile — trente combinaisons. Ce que
  cette réserve annonçait sans le savoir s'y trouvait : la colonne de texte du héros
  mesurait 390 px sur un écran de 320, et le titre comme le chapeau étaient COUPÉS, sans
  défilement pour aller les chercher (voir le commentaire de `.heros__grille > *`). C'est
  corrigé, et vérifié : plus aucune cible tactile sous 44 px, plus de texte tronqué.
  Restent deux pixels de débord de document, dus au ruban des langues, que `overflow-x:
  clip` retient et que rien ne laisse voir.
  Ce qui n'a toujours PAS été fait : ouvrir la page sur un vrai téléphone. Un émulateur ne
  rend ni les polices du système, ni la barre d'adresse qui mange la hauteur, ni les
  marges de sécurité d'un écran à encoche — ces dernières sont posées dans la feuille de
  style, jamais vues à l'œuvre.
- **Les contrastes sont calculés, pas mesurés à la pipette.** `npm run contraste` compose
  ce que le navigateur devrait afficher ; il ne lit pas l'écran.
- **Le nuage WebGL n'a été vu qu'à l'arrêt.** L'environnement de vérification suspendait
  les images d'animation ; la composition a été validée sur une image fixe, le mouvement
  seulement relu dans le code.
- **Le conteneur n'a pas encore tourné ailleurs qu'ici.** L'image se construit, se lance,
  et ses en-têtes ont été relevés à la main (voir plus bas) — mais sur cette machine, en
  HTTP, sans Traefik devant. Le point à surveiller au premier déploiement est
  `Strict-Transport-Security` : il part de nginx, et Dokploy ne doit pas le reposer.

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
