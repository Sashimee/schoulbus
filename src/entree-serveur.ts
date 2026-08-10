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
import { Mentions } from './pages/Mentions.tsx'
import { CONTENUS, LANGUES, PAGES, cheminPage, type Page } from './i18n/contexte.ts'
import { APP_PUBLIEE, ORIGINE, URL_APP, imagePartage } from './config.ts'
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

export function rendre(
  langue: Langue,
  page: Page = 'accueil',
): { html: string; tete: string; codeLangue: string } {
  const contenu = CONTENUS[langue]

  const html = renderToString(
    createElement(
      FournisseurI18n,
      { langueInitiale: langue, pageInitiale: page },
      createElement(page === 'mentions' ? Mentions : App),
    ),
  )

  const url = `${ORIGINE}${cheminPage(langue, page)}`
  /*
   * Les mentions légales ont leur propre titre : servies avec celui de l'accueil, les
   * deux pages se disputeraient le même résultat de recherche, et un moteur en
   * déclasserait une des deux comme copie.
   */
  const titre =
    page === 'mentions'
      ? echapper(`${contenu.mentions.titre} — ${contenu.general.marque}`)
      : echapper(contenu.meta.titre)
  const description =
    page === 'mentions' ? echapper(contenu.mentions.intro) : echapper(contenu.meta.description)

  /*
   * Les alternatives de langue. `hreflang` dit à un moteur que ces trois adresses sont
   * la même page en trois langues, et non trois pages qui se copient — sans quoi elles
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
    .map((l) => `    <meta property="og:locale:alternate" content="${CONTENUS[l].codeLangue}_LU" />`)
    .join('\n')

  // La vignette de la langue rendue, pas celle du français (voir `imagePartage`).
  const vignette = `${ORIGINE}/${imagePartage(langue)}`

  const tete = [
    `    <link rel="canonical" href="${url}" />`,
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
    `    <meta property="og:locale" content="${contenu.codeLangue}_LU" />`,
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
  const c = CONTENUS[langue]
  if (page === 'mentions') {
    return {
      titre: echapper(`${c.mentions.titre} — ${c.general.marque}`),
      description: echapper(c.mentions.intro),
    }
  }
  return { titre: echapper(c.meta.titre), description: echapper(c.meta.description) }
}
