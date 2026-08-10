/*
 * Les adresses extérieures, en un seul endroit.
 *
 * `URL_APP` est provisoire : l'application vit aujourd'hui sur GitHub Pages. Le jour où
 * elle prend un domaine propre — `app.schoulbus.lu` ou un sous-chemin de `schoulbus.lu` —
 * c'est cette ligne qui change, et rien d'autre. Même discipline que le `BASE_PATH` de
 * l'application, pour la même raison : une adresse recopiée dans quinze composantes est
 * une adresse qu'on oublie de corriger dans trois d'entre elles.
 */
export const URL_APP = 'https://sashimee.github.io/bus-scolaire-beckerich'

/**
 * La source officielle. Elle n'est pas décorative : le site est indépendant de la
 * commune, et tout ce qu'il affiche vient de ce document. Le lien doit rester visible
 * partout où l'on parle d'horaires.
 */
export const URL_SOURCE_OFFICIELLE = 'https://kanner.beckerich.lu/infos/horaires-de-bus'

/** Le dépôt de l'application. Le code est lisible par qui veut vérifier la promesse. */
export const URL_DEPOT = 'https://github.com/Sashimee/bus-scolaire-beckerich'

/** Pages d'information de l'application, citées depuis la vitrine. */
export const URL_LIMITES = `${URL_APP}/limites`
export const URL_INDEPENDANCE = `${URL_APP}/independance`
export const URL_CREDITS = `${URL_APP}/credits`
export const URL_INSTALLER = `${URL_APP}/installer`

/**
 * Origine publique de la vitrine, posée à la construction (voir `vite.config.ts`).
 * Sert aux métadonnées de partage, qui exigent des URL absolues.
 */
declare const __ORIGINE__: string
export const ORIGINE = typeof __ORIGINE__ === 'string' ? __ORIGINE__ : 'https://schoulbus.lu'
