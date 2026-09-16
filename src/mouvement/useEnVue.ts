/*
 * « Cet élément est-il entré dans l'écran ? », sans bibliothèque.
 *
 * Deux lecteurs : la révélation au défilement et le décompte de la bande de chiffres.
 * C'est le seul service que `motion` rendait encore une fois ses animations passées en
 * CSS, et un `IntersectionObserver` le rend en quinze lignes.
 *
 * Le résultat ne repasse jamais à faux : les deux appelants veulent une entrée qui ne
 * rejoue pas, et un élément qui se révèle à chaque passage transforme un retour en
 * arrière dans la page en clignotement.
 */
import { useCallback, useRef, useState } from 'react'

export function useEnVue(part: number) {
  const [vu, setVu] = useState(false)
  const observateur = useRef<IntersectionObserver | null>(null)

  /*
   * Une référence de rappel plutôt qu'un effet : l'élément observé change de balise
   * entre le rendu nu et le rendu animé, et un effet qui lit `ref.current` observerait
   * alors la balise précédente.
   */
  const observer = useCallback(
    (element: Element | null) => {
      observateur.current?.disconnect()
      if (!element || typeof IntersectionObserver === 'undefined') return

      observateur.current = new IntersectionObserver(
        ([entree]) => {
          if (!entree.isIntersecting) return
          setVu(true)
          observateur.current?.disconnect()
        },
        { threshold: part },
      )
      observateur.current.observe(element)
    },
    [part],
  )

  return { observer, vu }
}
