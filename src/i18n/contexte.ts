/*
 * Le contexte de langue, et les deux crochets qui le lisent.
 *
 * Séparé de la composante fournisseur : `react-refresh` demande qu'un fichier exporte
 * soit des composantes, soit autre chose, jamais les deux — sinon le rechargement à
 * chaud perd l'état de la page à chaque frappe.
 *
 * Trois langues, trois adresses distinctes :
 *
 *     /        français   (langue de référence, celle de l'application)
 *     /de/     allemand
 *     /lb/     luxembourgeois
 *
 * Chacune est pré-rendue en HTML statique à la construction. Un moteur de recherche
 * trouve donc trois pages complètes, et non une coquille vide qui attendrait JavaScript
 * — ce qui, pour une page dont le rôle est justement d'être trouvée, serait absurde.
 */
import { createContext, useContext } from 'react'
import type { Contenu, Langue } from '../contenu/type.ts'
import { fr } from '../contenu/fr.ts'
import { de } from '../contenu/de.ts'
import { lb } from '../contenu/lb.ts'

export const CONTENUS: Record<Langue, Contenu> = { fr, de, lb }
export const LANGUES: Langue[] = ['fr', 'de', 'lb']

/** Le préfixe sous lequel le site est servi ('/' en général). */
const base = import.meta.env.BASE_URL

/** L'adresse d'une langue. Le français est à la racine, il n'a pas de segment. */
export function cheminLangue(langue: Langue): string {
  return langue === 'fr' ? base : `${base}${langue}/`
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
