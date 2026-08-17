/*
 * Le contexte de langue, et les deux crochets qui le lisent.
 *
 * Séparé de la composante fournisseur : `react-refresh` demande qu'un fichier exporte
 * soit des composantes, soit autre chose, jamais les deux — sinon le rechargement à
 * chaud perd l'état de la page à chaque frappe.
 *
 * Quatre langues, quatre adresses distinctes :
 *
 *     /        français   (langue de référence, celle de l'application)
 *     /de/     allemand
 *     /lb/     luxembourgeois
 *     /en/     anglais
 *
 * Chacune est pré-rendue en HTML statique à la construction. Un moteur de recherche
 * trouve donc quatre pages complètes, et non une coquille vide qui attendrait JavaScript
 * — ce qui, pour une page dont le rôle est justement d'être trouvée, serait absurde.
 *
 * La LISTE, elle, n'est pas ici : elle vit dans `../contenu/langues.ts`, que les scripts
 * de construction savent lire — ce fichier-ci ne s'ouvre pas hors du navigateur.
 */
import { createContext, useContext } from 'react'
import { mentionsPretes } from '../config.ts'
import type { Contenu, Langue } from '../contenu/type.ts'
import { LANGUES } from '../contenu/langues.ts'
import { fr } from '../contenu/fr.ts'
import { de } from '../contenu/de.ts'
import { lb } from '../contenu/lb.ts'
import { en } from '../contenu/en.ts'

export const CONTENUS: Record<Langue, Contenu> = { fr, de, lb, en }
export { LANGUES }

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
 * `contact` est la seule qui attende quelque chose du visiteur, et la seule à porter
 * l'adresse à laquelle on écrit. Elle la porte SEULE, délibérément : le pied de page et
 * l'en-tête mènent à la page, jamais à un `mailto:`, de sorte que l'adresse figure dans
 * quatre fichiers pré-rendus — un par langue — au lieu de la totalité qu'aurait produite
 * un lien dans le pied de page, présent lui sur chaque page de chaque langue.
 * Son formulaire n'envoie rien — il ouvre le logiciel de courrier de qui écrit.
 *
 * Chacune est pré-rendue dans les quatre langues.
 */
export type Page = 'accueil' | 'mentions' | 'independance' | 'contact'

/*
 * Les mentions n'entrent dans la liste que si elles sont complètes. Tout ce qui parcourt
 * `PAGES` — le pré-rendu, le plan du site, le lien du pied de page — s'aligne donc d'un
 * seul geste, et il n'existe aucun état où la page serait publiée à moitié.
 */
export const PAGES: Page[] = mentionsPretes()
  ? ['accueil', 'contact', 'independance', 'mentions']
  : ['accueil', 'contact', 'independance']

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
  changerLangue: (langue: Langue) => void
}

export const ContexteI18n = createContext<ValeurI18n>({
  langue: 'fr',
  contenu: fr,
  changerLangue: () => {},
})

/** Le contenu de la langue courante. C'est ce que lit chaque section. */
export function useContenu(): Contenu {
  return useContext(ContexteI18n).contenu
}

/** La langue courante et de quoi en changer. Réservé aux sélecteurs. */
export function useLangue(): ValeurI18n {
  return useContext(ContexteI18n)
}
