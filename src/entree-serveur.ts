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
import { CONTENUS, LANGUES, cheminLangue } from './i18n/contexte.ts'
import { ORIGINE } from './config.ts'
import type { Langue } from './contenu/type.ts'

export { LANGUES }

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

export function rendre(langue: Langue): { html: string; tete: string; codeLangue: string } {
  const contenu = CONTENUS[langue]

  const html = renderToString(
    createElement(FournisseurI18n, { langueInitiale: langue }, createElement(App)),
  )

  const url = `${ORIGINE}${cheminLangue(langue)}`
  const titre = echapper(contenu.meta.titre)
  const description = echapper(contenu.meta.description)

  /*
   * Les alternatives de langue. `hreflang` dit à un moteur que ces trois adresses sont
   * la même page en trois langues, et non trois pages qui se copient — sans quoi elles
   * se concurrenceraient l'une l'autre dans les résultats.
   */
  const alternatives = LANGUES.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${ORIGINE}${cheminLangue(l)}" />`,
  ).join('\n')

  const tete = [
    `    <link rel="canonical" href="${url}" />`,
    alternatives,
    `    <link rel="alternate" hreflang="x-default" href="${ORIGINE}${cheminLangue('fr')}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="${echapper(contenu.general.marque)}" />`,
    `    <meta property="og:title" content="${titre}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:image" content="${ORIGINE}/partage.png" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${echapper(contenu.general.marque)}" />`,
    `    <meta property="og:locale" content="${contenu.codeLangue}_LU" />`,
    // `summary_large_image` : la vignette occupe toute la largeur de la carte, ce qui
    // rend la mention d'indépendance lisible au lieu d'une miniature carrée.
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${titre}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${ORIGINE}/partage.png" />`,
  ].join('\n')

  return { html, tete, codeLangue: contenu.codeLangue }
}

/** Titre et description, pour remplacer ceux du gabarit dans chaque page engendrée. */
export function metadonnees(langue: Langue) {
  const c = CONTENUS[langue]
  return { titre: echapper(c.meta.titre), description: echapper(c.meta.description) }
}
