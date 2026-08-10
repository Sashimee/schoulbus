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
```

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

## Réserves ouvertes

- **La traduction luxembourgeoise n'a pas été relue par une personne dont c'est la langue
  maternelle.** C'est la langue du foyer dans une bonne part de la commune ; une tournure
  fausse s'y remarque immédiatement. À faire relire avant toute mise en ligne publique.
- **Les largeurs de téléphone et de tablette n'ont pas été vues à l'écran.** La mise en
  page a été vérifiée sur écran large, en thème clair et sombre, dans les trois langues,
  et relue dans la feuille de style pour les points de bascule (40 rem, 48 rem, 62 rem) —
  mais pas ouverte sur un appareil étroit.
- **Les contrastes sont calculés, pas mesurés à la pipette.** `npm run contraste` compose
  ce que le navigateur devrait afficher ; il ne lit pas l'écran.
- **Le nuage WebGL n'a été vu qu'à l'arrêt.** L'environnement de vérification suspendait
  les images d'animation ; la composition a été validée sur une image fixe, le mouvement
  seulement relu dans le code.
- **Le déploiement n'est pas décidé.** Aucun fichier d'intégration continue n'est posé.
  La construction est purement statique : GitHub Pages, Cloudflare Pages ou autre restent
  ouverts.

## Source des données

Les chiffres affichés — arrêts, villages, lignes, rues — sont engendrés depuis les données
de l'application (`npm run chiffres`), elles-mêmes tirées du plan officiel de la commune,
année scolaire 2025/2026. Aucun n'est estimé.

Ce site est indépendant, réalisé à titre privé, sans lien avec l'administration communale
de Beckerich ni avec l'école. En cas de doute, le document officiel de la commune fait
foi : <https://kanner.beckerich.lu/infos/horaires-de-bus>.
