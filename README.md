# Vitrine — Bus scolaire Beckerich

Page de présentation de l'application [Bus scolaire Beckerich](https://app.schoulbus.lu).
Elle explique ce que fait l'application, ce qu'elle ne sait pas faire, et mène vers elle.
Son dépôt est `../bus-scolaire-beckerich`.

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

`src/config.ts`, et nulle part ailleurs. `URL_APP` pointe vers `app.schoulbus.lu` — le
domaine propre de l'application, qui a remplacé son adresse GitHub Pages sans que rien
d'autre change ici. Un changement d'adresse déplace le QR : `npm run assets:qr`, puis
commiter le fichier engendré.

### Et ils y mènent

`APP_PUBLIEE` vaut `true` dans `src/config.ts`. L'application est publiée : les boutons du
héros et de la section finale, le QR, les entrées de pied de page et le
`SoftwareApplication` du balisage structuré désignent tous `URL_APP`. Tant que cette
constante vaut `false`, la vitrine **décrit** l'application sans y conduire, et une mention
« bientôt disponible » prend la place des appels à l'action.

L'interrupteur a été ouvert un jour, refermé le lendemain, puis rouvert quand l'application
a été prête. C'est son usage prévu, et la démonstration qu'il en est bien un : chaque
bascule n'a demandé qu'une constante et une ligne de HTML statique, les deux états restant
testés (`src/tests/rendu.test.ts`).

Une seule chose n'est pas du code : le `<noscript>` d'`index.html`. Elle n'est pas pour
autant une affaire de mémoire — un test vérifie que ce bloc nomme l'application **si et
seulement si** `APP_PUBLIEE` le dit, et il a effectivement réclamé la correction à chaque
bascule.

Ce que l'interrupteur ne fait pas, dans un sens comme dans l'autre : il commande les chemins
depuis cette page, pas l'existence de l'application. Elle est publiée depuis son dépôt à
elle, et son adresse est de toute façon dans le paquet JavaScript comme donnée de
configuration — `sansApplication()` en a besoin pour filtrer le pied de page.

## Réserves ouvertes

Elles sont classées par ce qu'elles coûtent à refermer, la plus chère d'abord.

**Une revue systématique du dépôt a eu lieu le 8 septembre 2026**, en quatre passes —
les promesses de la page contre l'application, les cinq langues contre les dictionnaires,
la couche visible mesurée dans Chromium, la chaîne de livraison mesurée sur `dist/` et sur
le site en ligne. Quatre de ses constats ont été corrigés le jour même et sont passés aux
réserves levées ; le reste est ci-dessous. La leçon commune à tous, et elle vaut d'être
écrite en tête : **`npm run verifier` était vert du début à la fin.** Aucun de ces défauts
n'était visible par la porte, parce qu'aucun ne portait sur ce que la porte sait mesurer.

- **Les traductions portugaise et anglaise sont des premières rédactions**, et la
  luxembourgeoise l'est redevenue. Le vocabulaire suit celui de l'application
  (`paragem`/`morada`, `stop`/`on foot`) plutôt qu'un dictionnaire, ce qui écarte le
  contresens mais pas la maladresse. Pour le luxembourgeois, la réserve **s'est aggravée** :
  la refonte a réécrit presque chaque chaîne du fichier, les tuiles et les limites passant
  d'un paragraphe à une ligne — et une phrase courte pardonne moins qu'une longue, faute de
  contexte autour pour rattraper un mot mal choisi. C'est la langue du foyer dans une bonne
  part de la commune, et la vitrine est publiée. **C'est la seule réserve qui demande une
  personne plutôt qu'une commande.**

  Une relecture systématique a eu lieu depuis, fichier contre fichier et contre les
  dictionnaires de l'application. Ce qu'elle a corrigé : le luxembourgeois disait
  `Haltestell` là où l'application dit `Statioun` — sept fois, dans la seule langue où le
  mot de l'application n'était pas repris ; la règle de l'Eifel était fautive quatre fois
  (`vun Ären Kanner`, `de Moie ausgesinn`, `a Optrag ginn`) ; `ka` en fin de phrase
  reprenait son `nn` ; `Zweifel` est redevenu `Zweiwel` ; les guillemets allemands `„ … "`
  se fermaient sur un pouce ASCII, en allemand comme en luxembourgeois ; les apostrophes
  droites sont passées en apostrophes typographiques dans les cinq langues.

  **Les écarts que la revue du 8 septembre avait trouvés sont corrigés.** Le plus lourd ne
  tenait pas à une langue mais aux cinq : la tuile de la maison relais inventait un mot
  différent du sien dans chacune — `Le périscolaire`, `Die Betreuung`, `O prolongamento`,
  `After-school care` — alors que l'application dit partout *maison relais*, *Maison
  Relais*, *casa de acolhimento*, *after-school centre* ; les cinq tuiles reprennent
  maintenant le mot de l'application. Le reste, vérifié une par une contre
  `bus-scolaire-beckerich/src/i18n/*.json` : `elle-même` est devenu `lui-même` dans la
  langue de référence ; en allemand `Fußwege` a laissé la place à `Gehzeiten` dans le titre
  de la limite, et là seulement — les autres emplois désignent le chemin et sa carte, que
  l'application nomme bien `Fußweg` ; en luxembourgeois `Zyklus` → `Cycle`, `Faart` →
  `Fahrt`, et `Fousswee` — zéro occurrence dans l'application — → `zu Fouss`, cinq fois ;
  en portugais `Apresentação` → `Tema` et `faz fé` → `prevalece` ; en anglais `Appearance`
  → `Theme` et `routes` → `lines`.

  La règle de l'Eifel comptait **six** occurrences fautives et non cinq. La sixième,
  `Et bleiwen sechzéng`, échappe à toute lecture chaîne par chaîne : elle n'existe qu'une
  fois `final.titreAvant` et `final.titreAccent` mis bout à bout par la composante. Les
  six : `De éischte Prinzip` → `Den`, `ausgefallen Faart` → `ausgefalle Fahrt`,
  `D'Grousselteren gesinn` → `Grousseltere`, `anzetippen freet` → `anzetippe`,
  `Erausginn vun` → `Erausgi`, `Et bleiwen sechzéng` → `bleiwe`.

  Deux avertissements pour la passe suivante, parce qu'ils changent la méthode.
  **L'application n'est pas un corpus propre pour cette règle** : un relevé mécanique y
  trouve trente-huit suites `-n` + consonne, dont beaucoup sont fautives
  (`Ären Kanner`, `den Startbildschierm`, `Opmaachen souwisou`) et d'autres légitimes
  (`Hüttingen`, `Elwen` sont des noms propres). Sa limite `marcheTitre` écrit elle-même
  `D'Zäite zu Fouss`, alors que le `z` de `zu` retient le `n` : la vitrine écrit
  `D'Zäiten zu Fouss` et diverge donc sciemment. **Et l'application hésite entre ses
  propres termes** — `Cycle` treize fois contre `Zyklus` trois, `Fahrt` douze contre
  `Faart` deux : les corrections ci-dessus suivent le terme majoritaire, pas une source
  unique. Ce que l'application garde et qui n'est donc pas une faute ici : `Statioun`,
  `Applikatioun`, `sinn`, `gesinn` devant consonne.

  Deux arbitrages restent à poser plutôt qu'à corriger : `comuna` contre `município` en
  portugais, qui touche quinze chaînes et engage les deux dépôts, et le mot employé pour la
  fiche de la semaine, qui diverge de `nav.semaine` dans les cinq langues. Un troisième s'y
  ajoute, que la revue n'avait pas relevé : le portugais dit `vale o documento oficial`
  trois fois pour ce que l'application appelle `prevalece`. Seul `faz fé` a été corrigé —
  aligner `vale` aussi est un choix de registre, pas une correction.

  Ce qu'elle N'A PAS tranché, faute de compétence native, et qui reste à relire :
  `Moiescher` (le pluriel de `Moien`), `dat ganzt Produit` (genre du mot `Produit`),
  `stiechen an der Säit` (le verbe, calqué de l'allemand `stecken in`). En portugais,
  `por um pai` traduit `un parent` par « un père » — l'application dit la même chose, donc
  la corriger ici seul les ferait diverger. Une relecture native reste nécessaire :
  ce qu'une machine sait vérifier est ce qui a une règle, et le naturel n'en a pas.

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
  **La barre, elle, a été regardée** — la réserve ne la couvre plus. C'est un signalement
  depuis un téléphone qui a montré les cinq segments de langue repliés en deux rangées ;
  la liste déroulante qui les remplace a été mesurée et photographiée dans Chromium, au
  doigt, à 320, 360, 393, 430, 768 et 1280 px, dans les deux thèmes. La rangée d'actions
  demande 331 px : une rangée jusqu'à 360 px de large (deux avec la marque au-dessus),
  une seule à partir de 393 px, et deux rangées d'actions seulement à 320 px, où elle n'a
  plus que 296 px. Ce qui reste non vu est ce que la réserve dit depuis le début : les
  polices du système, la barre d'adresse, les marges d'un écran à encoche.

- **La vitrine décrit une application plus ancienne que celle qui est en ligne.** Les
  quarante captures sont prises à la révision inscrite dans `scripts/captures.source.json`
  (`509b621`, le 10 août 2026), qui a depuis quarante-neuf révisions de retard. Une phrase
  y a déjà survécu à sa vérité : « Sept questions, une fois » — l'assistant en compte six
  depuis que `bus`, `périscolaire` et `adresses` ont fusionné en `matin`, `midi`, `soir`.
  La capture affiche bien « Étape 1 sur 7 », si bien que la page est cohérente **avec
  elle-même** et fausse contre l'application vivante : c'est l'écart qu'aucun test ne peut
  voir, puisque les deux sources concordent. La phrase et les captures doivent donc bouger
  dans le même lot — `captures.source.json`, puis `npm run captures:conteneur`, ce qui
  demande Docker et le dépôt de l'application à côté.

- **« Réduire les animations » ne réduit pas encore tout.** Le bloc
  `prefers-reduced-motion` de `vitrine.css` remet les *durées* à 0,01 ms mais jamais les
  *délais*, et l'entrée du héros est en CSS avec des retards jusqu'à 0,72 s. Mesuré sous la
  préférence : premier mot du titre à ~128 ms, capture à ~320 ms, légende à ~704 ms. Le
  commentaire au-dessus de la règle promet exactement le contraire. Deux voisines, vues à
  la même occasion : `Revele` passe d'une balise nue à une balise `motion` à
  l'hydratation, ce qui repeint en `opacity: 0` trente et un blocs déjà lus (~50 ms de noir,
  puis un fondu de 0,55 s) — sur une page dont l'argument est le pré-rendu, c'est le
  pré-rendu qui se fait défaire ; et le rideau, qui ne s'abstient qu'au niveau `aucun`,
  couvre du contenu déjà peint pendant 1 472 ms sur tout téléphone, où le niveau vaut
  `reduit`. Le premier tiers tient en une ligne (`animation-delay`), les deux autres non.

- **Deux cibles tactiles sous 44 px, et la réserve levée qui disait le contraire.** Relevé
  sur un profil Pixel 7 : le lien « Lire la page "Limites" » fait **168 × 19 px** — sous le
  minimum de 24 px de WCAG 2.5.8, et c'est le seul lien du corps de page sans hauteur
  minimale — et la marque de l'en-tête **30 × 44 px** sous 26 rem, où `.marque__nom`
  disparaît et ne laisse que la vignette. La ligne « le relevé sur Pixel 7 ne trouve
  **aucune** cible sous 44 px », plus bas dans les réserves levées, était vraie quand elle
  a été écrite et ne l'est plus.

- **La langue ne va pas jusqu'au bout de la page.** Le `<noscript>` d'`index.html` est
  recopié tel quel par le pré-rendu : `/de/`, `/lb/`, `/pt/` et `/en/` servent un
  paragraphe **français** sous leur propre `lang` — c'est-à-dire que le seul lecteur pour
  qui ce bloc existe est le seul à ne pas être servi dans sa langue. Et changer de langue
  en cours de page ne met à jour ni `<title>`, ni la description, ni la canonique, ni
  `og:url` ; le bouton Précédent, lui, change l'adresse sans changer la page, faute d'un
  écouteur `popstate` en face du `pushState`.

- **Ce que le conteneur produit et que nginx ne sert pas.** Le `Dockerfile` passe
  `brotli -q 11` sur tout le HTML, le JS, le CSS, le SVG, le XML et le TXT à chaque
  construction ; le bloc `location` que son commentaire annonce n'existe pas, et une
  requête `Accept-Encoding: br` reçoit **27 461 octets non compressés** là où `gzip_static`
  en rend 6 548. Deux voisines : `/index.html.gz` et `/index.html.br` répondent 200 en
  `application/octet-stream`, et les images de la racine — dont le QR, préchargé sur chaque
  page — sont servies en `no-cache`. Enfin, le `lastmod` du plan du site est **absent en
  production** : `.dockerignore` exclut `.git`, et `DATE_CONTENU` n'est pas posé dans les
  arguments de construction Dokploy, si bien que le raisonnement de `prerendu.mjs`
  — plutôt aucune balise qu'une date fausse — aboutit en permanence à aucune balise.

- **Cent deux kilo-octets de JavaScript, sans budget.** Premier écran, cache vide, thème
  clair : ≈ 212 ko, dont **102,6 ko de JS compressé** — la moitié du poids, pour une page
  entièrement pré-rendue dont l'interactivité se réduit à une liste déroulante, deux
  boutons de thème et des révélations au défilement. Deux requêtes seulement bloquent le
  premier rendu (6,4 ko de document, 6,0 ko de style), donc rien ne presse à l'affichage ;
  ce qui manque est une limite. Les captures en ont une (480 ko par langue, tenue à 352) ;
  le paquet, non — et c'est le seul poste où il reste une marge d'un ordre de grandeur.

- **Le titre luxembourgeois du héros fait 24 signes sur 24.** `heros.titre[0]` de `lb.ts`
  est exactement à la limite que la vignette de partage impose et qu'un test vérifie : il
  passe aujourd'hui, et la première retouche le fera tomber. Ce n'est pas un défaut, c'est
  un piège posé pour la prochaine personne.

- **Ce que l'application envoie à Google Agenda n'est pas nommé ici.** *(À vérifier avant
  d'agir.)* `bus-scolaire-beckerich/src/lib/agenda/google.ts` envoie à l'API de Google un
  titre d'événement construit comme `« prénom — trajet »` et le nom de l'arrêt en
  `location`. Si l'intégration est active en production — elle dépend de
  `VITE_ID_CLIENT_GOOGLE`, posée à la construction de l'application —, alors le prénom de
  l'enfant sort bel et bien de l'appareil, à la demande explicite du parent et vers son
  propre agenda, et `chiffres.envoiNote` devrait le nommer comme il nomme les deux autres.
  La page « Limites » de l'application ne le nomme pas non plus : si c'est un manque, il
  est d'abord là-bas.

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

### Réserves levées

- *« Un contexte WebGL par composante qui bouge. »* — Levée le 8 septembre, et la réserve
  se trompait deux fois. Le crochet n'était pas appelé onze fois mais **trente-neuf**, et
  ce n'est pas lui qui faisait tomber le navigateur sans écran : l'onglet tombe aussi avec
  `getContext` neutralisé, c'est l'environnement de cette machine. Mesuré à 1 440 px, avant
  et après, sur la même sonde : trente-neuf contextes `webgl2` dont aucun n'était relâché
  → **un** ; 235 objets `matchMedia` → **quatre** ; 117 écouteurs `change` permanents →
  **trois** ; vingt-trois « Too many active WebGL contexts » → **zéro**. La décision vaut
  pour la page entière : elle vit dans un magasin de module lu par `useSyncExternalStore`,
  dont le `getServerSnapshot` garde l'arbre servi à `aucun`. Le test qui prétendait tenir
  cette règle regardait le rendu client, déjà mesuré, et acceptait donc deux réponses.

- *« Le segment de thème choisi ne se disait pas choisi. »* — `useTheme` lisait
  `data-theme` **pendant le rendu** : `auto` au pré-rendu, où l'attribut n'existe pas, et
  `clair` dans le navigateur, où le script en ligne l'a déjà posé. React ne rattrape pas un
  attribut divergent, et son avertissement est retiré du paquet de production : la page
  s'affichait dans le bon thème avec `aria-pressed="false"` sur les deux segments, sans
  aucune erreur en console. **Le défaut ne frappait que les visiteurs ayant choisi** —
  c'est-à-dire les seuls pour qui le script anti-clignotement existe. L'état part
  désormais de `auto` des deux côtés, l'attribut se lit dans un effet, et le premier
  passage de l'effet d'application suit le script au lieu de l'effacer : sans cette garde,
  le correctif ramenait le clignotement qu'il venait d'éviter.

- *« La vitrine tenait un plan sur une parole que la commune n'avait plus donnée. »* —
  `chiffres.ts` annonçait une confirmation orale et une validité jusqu'en juillet 2027 ;
  l'application donnait la confirmation **écrite** depuis la brochure 2026/2027 et arrêtait
  le plan au 18 décembre 2026, à cause du nouveau campus. La limite disait donc le
  contraire de la page vers laquelle elle renvoie. Les chiffres sont repris, la limite est
  réécrite dans les cinq langues autour de la date, un test lie les deux — et
  l'intégration continue régénère désormais `chiffres.ts` à chaque révision. **C'était le
  seul fichier engendré-et-commité que rien ne revérifiait**, ce qui est exactement
  pourquoi c'est celui qui a vieilli. À la différence des captures, la comparaison se fait
  sur la branche par défaut de l'application : une capture est la photographie d'une
  version, un chiffre est une affirmation sur le plan d'aujourd'hui. Le prix est assumé —
  un changement de données là-bas fera rougir la CI d'ici.

- *« L'origine par défaut désignait un hôte qui redirige. »* — `schoulbus.lu` répond 308
  vers `www.schoulbus.lu`. Le `Dockerfile` portait seul la bonne valeur ; `vite.config.ts`,
  `scripts/prerendu.mjs`, `src/config.ts`, le test de fumée de la CI et l'exemple de ce
  README retombaient tous sur l'apex. Une construction lancée hors de Dokploy écrivait donc
  des canoniques, six `hreflang` et dix `<loc>` vers une redirection, sans que rien ne le
  dise — le bon hôte en ligne ne tenait qu'à un défaut d'argument que personne ne
  vérifiait. Deux tests le tiennent désormais.

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
  4. **L'en-tête collant de la section « Fonctions » ne décrochait jamais.** Trouvé plus
     tard, en photographiant la page défiler sur un profil tactile : replié, il restait
     cloué à 6 rem du haut et les neuf tuiles passaient dessous, sans fond entre elles et
     lui — deux textes superposés sur toute la hauteur de la section. La feuille de style
     affirmait le contraire (« le décrochage se fait tout seul »), et le raisonnement était
     faux : le bloc dans lequel un élément collant se déplace n'est pas sa propre rangée
     flexible, c'est la boîte de son conteneur, tuiles comprises. Il ne colle désormais que
     lorsqu'il y a un « à côté », par une requête de conteneur — la largeur dont la rangée
     dispose, et non celle de la fenêtre. **Une capture fixe ne pouvait pas voir ce
     défaut-là** : il ne se produit qu'en défilant.
  Reste, sur pointeur fin uniquement, les sélecteurs de l'en-tête à 34 px : c'est l'exception
  documentée, et elle tient — sur pointeur grossier ils passent à 44 px. La phrase qui
  suivait ici (« le relevé sur Pixel 7 ne trouve aucune cible sous 44 px ») était vraie de
  ce relevé-là ; un relevé plus large en a trouvé deux depuis, et c'est une réserve
  ouverte.

- *« Les pastilles d'icône des tuiles n'ont été vues par aucun navigateur. »* — Elles l'ont
  été. Chromium est installé ici depuis, et la page a été photographiée à 360, 390 et
  1 280 px, dans les deux thèmes. La pastille passe à 46 px et le tracé à 24 px : à 40/20
  les icônes se lisaient comme des vignettes de note de bas de page à côté du titre
  qu'elles coiffent. Ce qui reste vrai de la réserve d'origine, et qui vaut d'être retenu :
  le défaut qu'elle corrigeait — neuf tracés de 24 unités dessinés à 160 px, faute d'une
  règle de taille — a traversé une campagne de mesures dans Chromium, 81 tests et une mise
  en ligne. Le HTML était juste ; seule une page **regardée** pouvait le dire.

- *« Sur téléphone, le pied de page est le seul endroit d'où changer de langue. »* — Il ne
  l'est plus. Les commandes de l'en-tête ne disparaissent plus au pointeur grossier : elles
  passent à 44 px, et les deux gouttières intérieures de la barre se resserrent pour qu'une
  liste, deux cibles et une vignette tiennent sur une rangée. L'étiquette « bientôt
  disponible » quitte la barre au doigt — elle n'y est pas une commande, et le héros la
  redit trois lignes plus bas. Le sélecteur de thème y perd ses mots au passage : un soleil
  et un croissant, qui se comprennent sans être lus et ne coûtent pas cinq traductions. Les
  mots restent le nom accessible du bouton et son infobulle.

  La langue, elle, a cessé d'être un rail de cinq segments : le retour du bouton
  « Ouvrir l'application » dans la barre a fait passer les cinq pastilles à deux rangées,
  le soleil et le croissant à deux étages, et le libellé du bouton à deux lignes. C'est
  une **liste déroulante** depuis, en haut comme en bas de page — un `<select>` natif, qui
  occupe la largeur d'un choix au lieu de cinq et n'a rien à réécrire du clavier ni du
  lecteur d'écran. Le bouton de la barre y perd deux pixels de corps et huit de gouttière,
  et devient insécable.

- *« Le budget de poids des captures. »* — Il était global (1,4 Mio) et calibré sur trois
  langues ; cinq langues le faisaient échouer sans qu'aucune image n'ait grossi. Il est
  désormais **par langue** (480 ko), ce qui conserve la marge d'origine et ne se
  redemandera plus à chaque langue ajoutée.

## Le déploiement

Une image Docker en deux étapes : Node construit, nginx sert. Rien d'autre ne tourne — le
site est statique.

```bash
docker build -t vitrine \
  --build-arg URL_PUBLIQUE=https://www.schoulbus.lu \
  --build-arg DATE_CONTENU=$(git log -1 --format=%cs -- src index.html public) .
docker run --rm -p 8080:80 vitrine
```

`URL_PUBLIQUE` entre dans les métadonnées de partage, qui exigent des adresses absolues :
elle est donc connue à la construction, pas au démarrage. **Elle porte le `www`** : c'est
l'hôte qui répond, `schoulbus.lu` redirigeant vers lui en 308. Une canonique vers un hôte
qui redirige n'est pas une erreur visible — c'est une page qui désigne comme officielle une
adresse qu'elle n'est pas. `DATE_CONTENU` sert au `lastmod`
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
