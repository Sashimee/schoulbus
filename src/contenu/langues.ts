/*
 * Les langues de la vitrine, et rien d'autre.
 *
 * Un module à part, sans React et sans rien lire de Vite. C'est la seule façon d'avoir
 * UNE liste : `scripts/build-partage.mjs` et `scripts/captures.mjs` tournent sous Node nu
 * et importent les modules TypeScript directement ; `src/i18n/contexte.ts`, lui, importe
 * `createContext` et lit `import.meta.env.BASE_URL` à l'ouverture du module — deux choses
 * qui n'existent pas hors du navigateur. Les scripts ne pouvaient donc pas le lire, et ils
 * recopiaient la liste. Une recopie qu'on oublie ne casse rien : elle saute une langue en
 * silence, et l'on découvre bien plus tard qu'une vignette de partage n'a jamais été
 * engendrée.
 *
 * Même remède que dans l'application, pour la même raison : voir
 * `../bus-scolaire-beckerich/src/i18n/langues.ts`.
 *
 *     /        français       (langue de référence, celle de l'application)
 *     /de/     allemand
 *     /lb/     luxembourgeois
 *     /en/     anglais
 *
 * AJOUTER UNE LANGUE ICI NE SUFFIT PAS. Une seule chose ne s'en déduit pas et n'est tenue
 * par aucun test : la redirection sans barre oblique dans `nginx.conf`
 * (`location = /xx { return 301 /xx/; }`). Sans elle, `/en` répond 404 en production
 * pendant que `/en/` fonctionne, et rien ici ne le voit.
 */

export const LANGUES = ['fr', 'de', 'lb', 'en'] as const
export type Langue = (typeof LANGUES)[number]
