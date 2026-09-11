/*
 * Préparation des tests.
 *
 * jsdom ne fournit ni `matchMedia` ni `IntersectionObserver` ni `requestAnimationFrame`
 * utilisable pour une boucle : trois choses dont toute la couche mouvement dépend. On
 * les pose ici, en versions minimales et prévisibles, plutôt que dans chaque test.
 *
 * Par défaut, `matchMedia` répond « non » à tout — ce qui place la page au niveau
 * 'reduit'. Un test qui veut vérifier le niveau 'complet' ou 'aucun' surcharge la
 * fonction lui-même : voir `useNiveauMouvement.test.ts`.
 *
 * Les cinq dictionnaires sont posés dans le registre, comme le fait le pré-rendu et pour
 * la même raison : un test rend de façon synchrone et compare les langues entre elles. Le
 * navigateur, lui, n'en charge qu'un (`src/i18n/registre.ts`) — c'est tout l'objet du
 * découpage, et c'est `src/entree.tsx` qui l'attend.
 */
import '@testing-library/jest-dom/vitest'
import { CONTENUS } from '../contenu/tous.ts'
import { LANGUES } from '../i18n/contexte.ts'
import { enregistrerContenu } from '../i18n/registre.ts'

for (const langue of LANGUES) enregistrerContenu(langue, CONTENUS[langue])

if (!window.matchMedia) {
  window.matchMedia = ((requete: string) => ({
    matches: false,
    media: requete,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

// La garde passe par une vue non typée : `'X' in window` réduit le type de `window` à
// `never` dans la branche négative, puisque TypeScript sait que la propriété existe.
const global = window as unknown as Record<string, unknown>
if (!global.IntersectionObserver) {
  class ObservateurFactice {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds = []
  }
  global.IntersectionObserver = ObservateurFactice
}
