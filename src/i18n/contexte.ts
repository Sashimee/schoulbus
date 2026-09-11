/*
 * Le contexte de langue, et les deux crochets qui le lisent.
 *
 * Séparé de la composante fournisseur : `react-refresh` demande qu'un fichier exporte
 * soit des composantes, soit autre chose, jamais les deux — sinon le rechargement à
 * chaud perd l'état de la page à chaque frappe.
 *
 * Cinq langues, cinq adresses distinctes :
 *
 *     /        français        (langue de référence, celle de l'application)
 *     /de/     allemand
 *     /lb/     luxembourgeois
 *     /pt/     portugais
 *     /en/     anglais
 *
 * Chacune est pré-rendue en HTML statique à la construction. Un moteur de recherche
 * trouve donc cinq pages complètes, et non une coquille vide qui attendrait JavaScript
 * — ce qui, pour une page dont le rôle est justement d'être trouvée, serait absurde.
 *
 * LA VITRINE N'EN PARLAIT QUE TROIS jusqu'à la refonte, quand l'application en parlait
 * cinq — et la page l'annonçait elle-même en grand dans sa bande de chiffres. Une page
 * qui vante cinq langues en trois langues se contredit à voix haute, et elle se contredit
 * précisément devant les deux familles qui avaient le plus besoin d'être lues.
 */
import { createContext, useContext } from 'react'
import { mentionsPretes } from '../config.ts'
import type { Contenu, Langue } from '../contenu/type.ts'

/*
 * LES CINQ DICTIONNAIRES NE SONT PLUS IMPORTÉS ICI. Ce fichier est lu par chaque
 * composante de la page : les y importer mettait les cinq langues dans le paquet, soit
 * environ 14 ko comprimés dont quatre cinquièmes ne servaient à personne. Ils vivent
 * maintenant dans `registre.ts`, qui n'en charge qu'un ; `contenu/tous.ts` garde la forme
 * réunie pour le pré-rendu et pour les tests, qui ne sont jamais expédiés.
 */

/* L'ordre est celui de l'application : les trois langues du pays, puis les deux autres. */
export const LANGUES: Langue[] = ['fr', 'de', 'lb', 'pt', 'en']

/** Le préfixe sous lequel le site est servi ('/' en général). */
const base = import.meta.env.BASE_URL

/** L'adresse d'une langue. Le français est à la racine, il n'a pas de segment. */
export function cheminLangue(langue: Langue): string {
  return langue === 'fr' ? base : `${base}${langue}/`
}

/*
 * Les pages du site. `accueil` est la présentation ; les deux autres portent ce qui doit
 * exister sans encombrer l'argumentaire.
 *
 * `mentions` porte l'obligation administrative — une adresse postale ne conduit personne
 * à ouvrir quoi que ce soit, et n'avait donc sa place ni au milieu du propos ni à sa fin.
 *
 * `independance` porte la mention d'indépendance, qui occupait naguère une section entière
 * de l'accueil. Elle en est sortie pour n'être plus au premier plan, PAS pour disparaître :
 * l'accueil continue de dire « site indépendant » dans son étiquette, son pied de page et
 * sa vignette de partage, et cette page-ci porte la phrase qui n'existe nulle part ailleurs
 * — celle qui dit lequel, du document communal ou de ce site, fait foi.
 *
 * `contact` porte l'adresse à laquelle on écrit. Elle ne dépend d'aucune constante, à la
 * différence des mentions : une adresse de courrier suffit à la rendre utile, et elle l'est
 * même sans le formulaire qui viendra s'y ajouter.
 *
 * Chacune est pré-rendue dans les cinq langues.
 */
export type Page = 'accueil' | 'mentions' | 'independance' | 'contact'

/*
 * Les mentions n'entrent dans la liste que si elles sont complètes. Tout ce qui parcourt
 * `PAGES` — le pré-rendu, le plan du site, le lien du pied de page — s'aligne donc d'un
 * seul geste, et il n'existe aucun état où la page serait publiée à moitié.
 */
export const PAGES: Page[] = mentionsPretes()
  ? ['accueil', 'independance', 'contact', 'mentions']
  : ['accueil', 'independance', 'contact']

/**
 * L'adresse d'une page dans une langue : `/`, `/de/`, `/independance/`, `/de/mentions/`…
 *
 * Le nom de la page EST son segment d'adresse. C'est la même règle que celle de
 * `dossier()` dans `scripts/prerendu.mjs`, et il faut qu'elle le reste : le pré-rendu écrit
 * les fichiers, cette fonction écrit les liens qui les désignent. Deux règles séparées, et
 * un jour un lien mène à un dossier que personne n'écrit plus.
 */
export function cheminPage(langue: Langue, page: Page): string {
  const racine = cheminLangue(langue)
  return page === 'accueil' ? racine : `${racine}${page}/`
}

/** Déduit la page d'un chemin. Tout ce qui n'est pas reconnu retombe sur l'accueil. */
export function pageDuChemin(chemin: string): Page {
  const segment = chemin.replace(/\/+$/, '').split('/').pop() ?? ''
  return segment === 'mentions' || segment === 'independance' || segment === 'contact'
    ? segment
    : 'accueil'
}

/**
 * Déduit la langue d'un chemin. Tout ce qui n'est pas reconnu retombe sur le français —
 * une adresse mal formée doit montrer la page, pas une erreur.
 */
export function langueDuChemin(chemin: string): Langue {
  const reste = chemin.startsWith(base) ? chemin.slice(base.length) : chemin.replace(/^\//, '')
  const segment = reste.split('/')[0]
  return LANGUES.includes(segment as Langue) ? (segment as Langue) : 'fr'
}

export type ValeurI18n = {
  langue: Langue
  contenu: Contenu
  /*
   * Rend une promesse depuis que les dictionnaires sont chargés un par un : changer de
   * langue demande d'abord d'aller chercher celle-là. Un appelant qui n'a rien à
   * enchaîner l'ignore par `void`.
   */
  changerLangue: (langue: Langue) => Promise<void>
}

/*
 * Pas de valeur par défaut, et c'est délibéré. L'ancienne portait le dictionnaire
 * français, ce qui suffisait à ramener une langue entière dans le paquet par la porte de
 * derrière. Une composante rendue hors du fournisseur est une faute de programmation ;
 * elle doit le dire, pas se rabattre en silence sur le français.
 */
export const ContexteI18n = createContext<ValeurI18n | null>(null)

function useContexteI18n(): ValeurI18n {
  const valeur = useContext(ContexteI18n)
  if (!valeur) throw new Error('Rendu hors de « FournisseurI18n » : il n’y a pas de langue.')
  return valeur
}

/** Le contenu de la langue courante. C'est ce que lit chaque section. */
export function useContenu(): Contenu {
  return useContexteI18n().contenu
}

/** La langue courante et de quoi en changer. Réservé aux sélecteurs. */
export function useLangue(): ValeurI18n {
  return useContexteI18n()
}
