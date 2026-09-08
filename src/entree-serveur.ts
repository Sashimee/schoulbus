/*
 * Point d'entrée du pré-rendu.
 *
 * Construit à part (`vite build --ssr`) et exécuté une fois par langue au moment de la
 * construction, jamais servi au navigateur. Il rend l'arbre complet en chaîne, avec les
 * métadonnées propres à la langue, que `scripts/prerendu.mjs` insère dans le gabarit.
 *
 * Une contrainte gouverne tout ce fichier : ce qui est rendu ici doit être EXACTEMENT ce
 * que le navigateur rendra à l'hydratation. D'où le niveau de mouvement qui démarre à
 * 'aucun' des deux côtés (voir `useNiveauMouvement`), et l'absence de toute lecture de
 * `window` pendant le rendu.
 *
 * Fichier `.ts` et non `.tsx`, avec `createElement` au lieu de JSX : il n'exporte que
 * des fonctions de construction, et une extension `.tsx` le ferait passer pour un module
 * de composantes — que le rechargement à chaud tenterait alors de suivre, pour un
 * fichier qui ne s'exécute jamais dans un navigateur.
 */
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App.tsx'
import { FournisseurI18n } from './i18n/Fournisseur.tsx'
import { Independance } from './pages/Independance.tsx'
import { Mentions } from './pages/Mentions.tsx'
import { CONTENUS, LANGUES, PAGES, cheminPage, type Page } from './i18n/contexte.ts'
import { LOCALES_OG, textesDePage, urlDePage } from './i18n/metadonnees.ts'
import { APP_PUBLIEE, ORIGINE, URL_APP, URL_SOURCE_OFFICIELLE, imagePartage } from './config.ts'
import { THEMES, fichierCapture } from './contenu/captures.ts'
import type { Langue } from './contenu/type.ts'

export { LANGUES, PAGES }

/**
 * Échappe ce qui entre dans un attribut HTML. Les textes viennent de nous, mais un
 * guillemet oublié dans une traduction casserait la page entière, silencieusement.
 */
function echapper(texte: string): string {
  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Données structurées (JSON-LD).
 *
 * Deux objets seulement : le site, et l'application qu'il décrit. Ce qui n'y figure pas
 * est aussi délibéré que ce qui y figure :
 *
 * - Pas d'`author` ni de `publisher` nommé. La page dit « fait par un parent, à
 *   Beckerich » et s'arrête là ; inscrire un nom dans le balisage publierait ce que le
 *   texte a choisi de taire.
 * - Pas d'`aggregateRating` ni de `review`. Ce sont eux qui déclenchent l'affichage
 *   enrichi de Google, et c'est précisément pour cela qu'on les invente ; il n'y a pas
 *   une seule note réelle derrière ce site.
 * - Pas d'`Organization`. Le premier principe du projet est de ne pas passer pour la
 *   commune, et une organisation dans le balisage est exactement ce qu'un moteur lirait
 *   comme un émetteur institutionnel.
 *
 * `<` est échappé : une traduction contenant `</script>` clorait la balise et le reste de
 * la page serait interprété comme du texte.
 */
function donneesStructurees(langue: Langue, url: string, vignette: string): string {
  const contenu = CONTENUS[langue]

  const site = {
    '@type': 'WebSite',
    '@id': `${url}#site`,
    url,
    name: contenu.general.marque,
    description: contenu.meta.description,
    inLanguage: contenu.codeLangue,
    image: vignette,
  }

  /*
   * L'application n'est décrite que si elle est publique.
   *
   * Un `SoftwareApplication` porte une `url`, et c'est là tout le problème : le décrire
   * reviendrait à donner aux moteurs l'adresse exacte vers laquelle la page refuse
   * délibérément de conduire. On ne peut pas retirer un lien de la page et le laisser dans
   * le balisage — c'est le même lien, simplement écrit pour une machine.
   */
  const application = {
    '@type': 'SoftwareApplication',
    '@id': `${URL_APP}#application`,
    name: contenu.general.marque,
    description: contenu.meta.description,
    url: URL_APP,
    applicationCategory: 'TravelApplication',
    // Une application web installable : elle tourne partout où tourne un navigateur.
    operatingSystem: 'Web',
    // Les cinq langues de l'application, et non les trois de la vitrine.
    inLanguage: ['fr', 'de', 'lb', 'pt', 'en'],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    isPartOf: { '@id': `${url}#site` },
  }

  const graphe = {
    '@context': 'https://schema.org',
    '@graph': APP_PUBLIEE ? [site, application] : [site],
  }

  return `    <script type="application/ld+json">${JSON.stringify(graphe).replace(/</g, '\\u003c')}</script>`
}

/**
 * Les mêmes textes que le navigateur, échappés pour un attribut HTML.
 *
 * Le calcul lui-même est dans `i18n/metadonnees.ts`, parce qu'il sert des deux côtés : ce
 * fichier écrit l'en-tête servi, et le changement de langue le réécrit sans recharger.
 * Deux calculs séparés, c'est une page allemande sous un titre français.
 */
function textesEchappes(langue: Langue, page: Page) {
  const { titre, description } = textesDePage(langue, page)
  return { titre: echapper(titre), description: echapper(description) }
}

/**
 * Le bloc servi à qui n'a pas de JavaScript, dans la langue de la page.
 *
 * Il était écrit en dur dans `index.html` et recopié tel quel par le pré-rendu : les cinq
 * langues recevaient le paragraphe français. Les deux liens réemploient des libellés déjà
 * relus (`general.ouvrirApp`, `independance.lien`) plutôt que d'en inventer cinq de plus,
 * et celui de l'application ne paraît que si elle est publique — ce bloc n'échappe donc
 * plus à l'interrupteur.
 */
export function blocNoscript(langue: Langue): string {
  const c = CONTENUS[langue]
  const lignes = [`      <p>${echapper(c.meta.sansScript)}</p>`]
  if (APP_PUBLIEE) {
    lignes.push(`      <p><a href="${URL_APP}">${echapper(c.general.ouvrirApp)}</a></p>`)
  }
  lignes.push(
    `      <p><a href="${URL_SOURCE_OFFICIELLE}">${echapper(c.independance.lien)}</a></p>`,
  )
  return lignes.join('\n')
}

export function rendre(
  langue: Langue,
  page: Page = 'accueil',
): { html: string; tete: string; codeLangue: string } {
  const contenu = CONTENUS[langue]

  const html = renderToString(
    createElement(
      FournisseurI18n,
      { langueInitiale: langue, pageInitiale: page },
      createElement(page === 'mentions' ? Mentions : page === 'independance' ? Independance : App),
    ),
  )

  const url = urlDePage(langue, page)
  const { titre, description } = textesEchappes(langue, page)

  /*
   * Les alternatives de langue. `hreflang` dit à un moteur que ces cinq adresses sont
   * la même page en cinq langues, et non cinq pages qui se copient — sans quoi elles
   * se concurrenceraient l'une l'autre dans les résultats. Elles pointent la MÊME page
   * dans les autres langues, pas l'accueil : depuis les mentions allemandes, on doit
   * arriver aux mentions françaises.
   */
  const alternatives = LANGUES.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${ORIGINE}${cheminPage(l, page)}" />`,
  ).join('\n')

  /*
   * Les autres langues de la même page. `og:locale` seul laisse croire qu'il n'existe
   * qu'une version : un partage dans un groupe germanophone ouvrirait la page française.
   */
  const localesAlternatives = LANGUES.filter((l) => l !== langue)
    .map((l) => `    <meta property="og:locale:alternate" content="${LOCALES_OG[l]}" />`)
    .join('\n')

  // La vignette de la langue rendue, pas celle du français (voir `imagePartage`).
  const vignette = `${ORIGINE}/${imagePartage(langue)}`

  /*
   * Le préchargement de la capture du héros.
   *
   * Elle est au-dessus de la ligne de flottaison, à l'intérieur du téléphone : découverte
   * par le navigateur seulement après l'analyse du corps, elle apparaîtrait après le
   * texte qui l'accompagne. Annoncée ici, elle part avec la page.
   *
   * Deux annonces, portées par `media` : `rel="preload"` l'honore, donc un seul des deux
   * fichiers est réellement demandé. Le pire cas — un visiteur qui a forcé un thème
   * contraire à celui de son système — coûte une image inutile d'une cinquantaine de
   * kilo-octets, et c'est le seul cas où les deux descendent.
   *
   * Réservé à l'accueil : la page de mentions ne montre aucun appareil.
   */
  const prechargements =
    page === 'accueil'
      ? THEMES.map(
          (theme) =>
            `    <link rel="preload" as="image" fetchpriority="high" media="(prefers-color-scheme: ${
              theme === 'sombre' ? 'dark' : 'light'
            })" href="/${fichierCapture('aujourdhui', langue, theme)}" />`,
        ).join('\n')
      : ''

  const tete = [
    `    <link rel="canonical" href="${url}" />`,
    prechargements,
    alternatives,
    `    <link rel="alternate" hreflang="x-default" href="${ORIGINE}${cheminPage('fr', page)}" />`,
    /*
     * `index, follow` est déjà le comportement par défaut ; ce qui justifie la balise,
     * c'est `max-image-preview:large`. Sans elle, Google réduit la vignette à un timbre
     * dans lequel la mention d'indépendance devient illisible — or c'est précisément ce
     * qu'elle doit dire avant qu'on ouvre le site.
     */
    `    <meta name="robots" content="index, follow, max-image-preview:large" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="${echapper(contenu.general.marque)}" />`,
    `    <meta property="og:title" content="${titre}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:image" content="${vignette}" />`,
    `    <meta property="og:image:type" content="image/png" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${echapper(contenu.general.marque)}" />`,
    `    <meta property="og:locale" content="${LOCALES_OG[langue]}" />`,
    localesAlternatives,
    // `summary_large_image` : la vignette occupe toute la largeur de la carte, ce qui
    // rend la mention d'indépendance lisible au lieu d'une miniature carrée.
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${titre}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${vignette}" />`,
    // Le balisage structuré décrit le site et l'application : il n'a rien à dire d'une
    // page de mentions légales, et l'y répéter la ferait passer pour une deuxième
    // application du même nom.
    page === 'accueil' ? donneesStructurees(langue, url, vignette) : '',
  ]
    .filter((l) => l !== '')
    .join('\n')

  return { html, tete, codeLangue: contenu.codeLangue }
}

/** Titre et description, pour remplacer ceux du gabarit dans chaque page engendrée. */
export function metadonnees(langue: Langue, page: Page = 'accueil') {
  return textesEchappes(langue, page)
}
