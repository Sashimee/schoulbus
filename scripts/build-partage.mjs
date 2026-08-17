/*
 * Engendre les images de partage (Open Graph), une par langue, et les icônes matricielles.
 *
 *     node scripts/build-partage.mjs
 *
 * Ce que produit ce script est COMMITÉ, comme le QR et pour la même raison : la
 * construction ne doit dépendre ni de `satori`, ni de `resvg`, ni d'une bibliothèque
 * native. L'image de partage ne change que si le titre change ; la régénérer à chaque
 * déploiement ferait porter au conteneur trois dépendances qu'il n'ouvrirait jamais.
 *
 * Pourquoi `satori` plutôt qu'un SVG rendu par `sharp`, comme le fait l'application :
 * `sharp` confie le texte à `librsvg`, qui le confie à `fontconfig`, qui prend la
 * police du système. Sur cette machine, `fc-match "IBM Plex Sans"` répond Liberation
 * Sans — la vignette la plus vue du projet serait dans une police que le site n'emploie
 * nulle part, et changerait d'aspect selon la machine qui la construit. `satori` lit le
 * fichier de police que le site sert déjà et convertit le texte en tracés : la vignette
 * est exacte, et identique partout.
 *
 * Le texte n'est pas écrit ici. Il est lu depuis `src/contenu/{fr,de,lb,en}.ts`, comme le
 * QR lit `config.ts` : une phrase recopiée dans un script finit par contredire la page.
 * C'est aussi pourquoi la vignette ne dit rien que la page ne dise déjà — aucune des
 * quatre langues n'a eu à être traduite pour elle, et ni le luxembourgeois ni l'anglais
 * n'attendent donc une relecture de plus.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const ici = dirname(fileURLToPath(import.meta.url))
const racine = resolve(ici, '..')
const PUBLIC = resolve(racine, 'public')

/*
 * Palette. Reprise de `src/styles/jetons.css` (thème sombre), et non de l'application :
 * son propre script d'icônes est resté sur l'ancienne palette, ce que `public/favicon.svg`
 * documente déjà. Recopiées à la main faute de savoir lire une variable CSS ici — à
 * réaligner si la charte bouge.
 */
const FOND = '#0e1a2e'
const FOND_HAUT = '#142b47'
const FOND_BAS = '#080d19'
const ACCENT = '#a9dcf5'
const ENCRE = '#e9eff6'
const ENCRE_DOUCE = '#c2cdda'

/** Le bus de `public/favicon.svg`, à la géométrie près. */
const MARQUE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${FOND}"/>
  <rect x="116" y="112" width="280" height="248" rx="44" fill="${ACCENT}"/>
  <rect x="152" y="152" width="208" height="104" rx="20" fill="${FOND}"/>
  <circle cx="180" cy="306" r="24" fill="${FOND}"/>
  <circle cx="332" cy="306" r="24" fill="${FOND}"/>
  <rect x="150" y="360" width="52" height="46" rx="16" fill="${ENCRE}"/>
  <rect x="310" y="360" width="52" height="46" rx="16" fill="${ENCRE}"/>
</svg>`

const marqueDataUri = `data:image/svg+xml;base64,${Buffer.from(MARQUE_SVG).toString('base64')}`

/*
 * Les fichiers de police, pris dans la variante à graisses fixes du même paquet que
 * celle servie au navigateur. `satori` ne lit pas le woff2 ; le woff porte les mêmes
 * dessins.
 */
function police(graisse) {
  return readFileSync(
    resolve(racine, `node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-${graisse}-normal.woff`),
  )
}

const polices = [
  { name: 'IBM Plex Sans', data: police(400), weight: 400, style: 'normal' },
  { name: 'IBM Plex Sans', data: police(600), weight: 600, style: 'normal' },
]

/** `satori` accepte l'arbre que produirait JSX ; on l'écrit à la main, ce script n'étant pas compilé. */
const e = (type, props, ...enfants) => ({
  type,
  props: { ...props, children: enfants.length === 0 ? undefined : enfants.length === 1 ? enfants[0] : enfants },
})

function vignette(contenu) {
  return e(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 88,
        backgroundColor: FOND,
        // Le dégradé de la page, transposé : `satori` ne connaît pas les positions en
        // pourcentage à deux axes, l'ellipse centrée en haut à gauche en tient lieu.
        backgroundImage: `radial-gradient(120% 90% at 15% 0%, ${FOND_HAUT} 0%, ${FOND} 45%, ${FOND_BAS} 100%)`,
        fontFamily: 'IBM Plex Sans',
      },
    },
    // Marque
    e(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 28 } },
      e('img', { src: marqueDataUri, width: 92, height: 92 }),
      e(
        'div',
        {
          style: {
            fontSize: 34,
            fontWeight: 600,
            color: ENCRE,
            letterSpacing: '-0.01em',
          },
        },
        contenu.general.marque,
      ),
    ),
    // Titre — les mêmes trois lignes que la page, à la même coupe.
    e(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      ...contenu.heros.titre.map((ligne, i) =>
        e(
          'div',
          {
            style: {
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              // La dernière ligne porte la promesse ; l'accent la détache des deux autres.
              color: i === contenu.heros.titre.length - 1 ? ACCENT : ENCRE,
            },
          },
          ligne,
        ),
      ),
    ),
    // Mention d'indépendance. Une vignette qui aurait l'air d'une communication de la
    // commune contredirait le premier principe du projet avant même qu'on ouvre le site.
    e(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 26 } },
      e('div', { style: { display: 'flex', height: 2, backgroundColor: ENCRE_DOUCE, opacity: 0.28 } }),
      e(
        'div',
        { style: { fontSize: 28, color: ENCRE_DOUCE } },
        contenu.heros.etiquette,
      ),
    ),
  )
}

async function enPng(element, largeur, hauteur) {
  const svg = await satori(element, { width: largeur, height: hauteur, fonts: polices })
  return new Resvg(svg, { fitTo: { mode: 'width', value: largeur } }).render().asPng()
}

/*
 * Les vignettes, une par langue. Le nom vient de `config.ts`, que le pré-rendu lit aussi :
 * c'est ce qui garantit que la balise `og:image` désigne un fichier qui existe.
 */
const { imagePartage } = await import('../src/config.ts')
/*
 * La liste des langues, lue et non recopiée. `langues.ts` existe pour cela : il ne tire ni
 * React ni `import.meta.env`, et s'ouvre donc sous Node nu. Une liste recopiée ici aurait
 * simplement sauté une langue en silence — la balise `og:image` de la page anglaise aurait
 * désigné un fichier que personne n'engendre.
 */
const { LANGUES } = await import('../src/contenu/langues.ts')

for (const langue of LANGUES) {
  const module = await import(`../src/contenu/${langue}.ts`)
  const nom = imagePartage(langue)
  const png = await enPng(vignette(module[langue]), 1200, 630)
  writeFileSync(resolve(PUBLIC, nom), png)
  console.log(`${nom} (1200×630, ${langue})`)
}

/*
 * Icônes matricielles.
 *
 * `apple-touch-icon` : iOS ignore un favicon SVG au moment de poser un raccourci sur
 * l'écran d'accueil, et fabrique alors une vignette de la page — illisible. Sans marge :
 * iOS arrondit lui-même, et rentrer le dessin le ferait flotter.
 *
 * `favicon-32` : quelques agrégateurs et lecteurs de flux ne lisent toujours pas le SVG.
 */
// Le commentaire d'en-tête de `favicon.svg` nomme les jetons `--fond` et `--accent` ;
// `--` est interdit dans un commentaire XML, et l'analyseur de resvg, lui, le refuse.
// Il n'a rien à faire dans une image matricielle : on le retire avant de rastériser.
const favicon = readFileSync(resolve(PUBLIC, 'favicon.svg'), 'utf8').replace(/<!--[\s\S]*?-->/g, '')

for (const [nom, taille] of [
  ['apple-touch-icon.png', 180],
  ['favicon-32.png', 32],
]) {
  const png = new Resvg(favicon, { fitTo: { mode: 'width', value: taille } }).render().asPng()
  writeFileSync(resolve(PUBLIC, nom), png)
  console.log(`${nom} (${taille}px)`)
}
