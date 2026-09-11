/*
 * Le registre des dictionnaires chargés, et de quoi en charger un.
 *
 * Pourquoi il existe : les cinq dictionnaires pesaient ensemble environ 14 ko comprimés
 * dans un paquet unique, et un lecteur francophone téléchargeait le luxembourgeois, le
 * portugais, l'allemand et l'anglais qu'il ne lirait jamais. Chacun est désormais un
 * morceau séparé, et la page n'en demande qu'un.
 *
 * LA DIFFICULTÉ EST QUE LA LECTURE DOIT RESTER SYNCHRONE. `useContenu()` est appelé au
 * milieu d'un rendu React, qui ne sait pas attendre ; et `import()` n'est pas synchrone,
 * quoi qu'on précharge dans le document — la résolution d'un module passe au minimum par
 * une micro-tâche. D'où la séparation en deux gestes : `chargerContenu` attend, et
 * `contenuCharge` lit ce qui est déjà là.
 *
 * CE N'EST DONC PAS LE RENDU QU'ON RETARDE, C'EST L'HYDRATATION. Le document arrive
 * pré-rendu, complet et dans la bonne langue ; `src/entree.tsx` attend le dictionnaire
 * avant d'appeler `hydrateRoot`, et le HTML servi reste à l'écran pendant ce temps. Rien
 * ne clignote : React ne touche au DOM qu'au moment où elle s'y accroche. Le seul coût
 * est que l'interactivité arrive quelques millisecondes plus tard — le marché déjà passé
 * pour `lenis` et pour `motion`.
 *
 * Trois endroits alimentent ce registre, et il n'en existe pas de quatrième : le
 * navigateur par `chargerContenu`, le pré-rendu et les tests par `enregistrerContenu`.
 */
import type { Contenu, Langue } from '../contenu/type.ts'

/*
 * Les morceaux, écrits un par un plutôt que par un chemin calculé : c'est cette liste
 * littérale que l'empaqueteur lit pour découper le paquet, et un `import(`./${langue}.ts`)`
 * l'obligerait à tout embarquer par précaution. Le `Record<Langue, …>` force le compilateur
 * à réclamer la ligne manquante le jour où une sixième langue arrive.
 */
const MORCEAUX: Record<Langue, () => Promise<Record<string, Contenu>>> = {
  fr: () => import('../contenu/fr.ts'),
  de: () => import('../contenu/de.ts'),
  lb: () => import('../contenu/lb.ts'),
  pt: () => import('../contenu/pt.ts'),
  en: () => import('../contenu/en.ts'),
}

const charges = new Map<Langue, Contenu>()

/** Pose un dictionnaire déjà en main. Le pré-rendu et les tests les ont tous les cinq. */
export function enregistrerContenu(langue: Langue, contenu: Contenu): void {
  charges.set(langue, contenu)
}

/** Charge le dictionnaire d'une langue, ou rend celui qui est déjà là. */
export async function chargerContenu(langue: Langue): Promise<Contenu> {
  const dejaLa = charges.get(langue)
  if (dejaLa) return dejaLa

  const module = await MORCEAUX[langue]()
  const contenu = module[langue]
  charges.set(langue, contenu)
  return contenu
}

/**
 * Le dictionnaire d'une langue, tout de suite.
 *
 * Échoue fort si la langue n'a pas été chargée. C'est une faute de programmation et non
 * un cas de figure : rendre un contenu de repli dans une autre langue donnerait une page
 * à moitié traduite que personne ne remarquerait avant un lecteur.
 */
export function contenuCharge(langue: Langue): Contenu {
  const contenu = charges.get(langue)
  if (!contenu) {
    throw new Error(
      `Le dictionnaire « ${langue} » n'est pas chargé. Attendre « chargerContenu('${langue}') » ` +
        `avant de rendre, comme le fait « src/entree.tsx » avant d'hydrater.`,
    )
  }
  return contenu
}
