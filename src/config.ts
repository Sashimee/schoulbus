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

/**
 * Le nom de la vignette de partage d'une langue. Le français est à la racine, comme sa
 * page — même règle que `cheminLangue`, et c'est voulu : une vignette allemande sous un
 * lien français donnerait à un groupe de parents une page qu'ils n'ouvriront pas.
 *
 * Posé ici, et non dans `scripts/build-partage.mjs` : le script qui engendre les fichiers
 * et le pré-rendu qui les annonce doivent lire la même règle, sinon la balise pointe un
 * jour vers un fichier que personne n'écrit plus. Ce fichier est le seul des deux qui
 * s'importe aussi bien depuis Node que depuis le navigateur.
 */
export function imagePartage(langue: string): string {
  return langue === 'fr' ? 'partage.png' : `partage-${langue}.png`
}

/**
 * L'éditeur du site, tel qu'il figure aux mentions légales.
 *
 * Le nom est déjà public : il est dans les crédits de l'application, dont le fichier de
 * données précise que rien n'y est inscrit sans accord. L'ADRESSE, elle, ne l'est nulle
 * part — et c'est justement ce qu'une mention légale luxembourgeoise réclame.
 *
 * Tant que cette ligne porte la valeur de remplacement, LA PAGE N'EXISTE PAS : elle n'est
 * ni engendrée, ni annoncée au plan du site, ni liée depuis le pied de page (voir `PAGES`
 * dans `i18n/contexte.ts`). Une page de mentions légales qui afficherait
 * « adresse à compléter » serait pire que pas de page du tout — elle prouverait qu'on ne
 * l'a pas relue. Le jour où cette ligne est remplie, les six adresses apparaissent.
 */
export const ADRESSE_EDITEUR = 'ADRESSE-À-COMPLÉTER'

/** Le nom de l'éditeur. Repris des crédits de l'application. */
export const NOM_EDITEUR = 'Alex Baskewitsch'

/** Les mentions légales sont-elles complètes, et donc publiables ? */
export function mentionsPretes(): boolean {
  return !ADRESSE_EDITEUR.includes('À-COMPLÉTER')
}
