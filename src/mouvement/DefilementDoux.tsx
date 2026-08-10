/*
 * Le défilement doux (Lenis).
 *
 * Il n'est posé qu'au niveau 'complet', c'est-à-dire à la souris. Sur tactile, il serait
 * une faute : le défilement inertiel du système est déjà doux, précis, et surtout
 * attendu — le remplacer donne cette sensation caoutchouteuse qui fait croire que la
 * page rame.
 *
 * L'accessibilité est le point délicat d'un défilement détourné : une navigation au
 * clavier (Tab, Page suivante, Début/Fin) doit continuer d'amener l'élément visé à
 * l'écran. Lenis s'en charge en réécrivant `scrollTo`, mais seulement tant qu'il vit ;
 * d'où la destruction soigneuse au démontage, et le retour au natif quand le niveau
 * retombe.
 */
import { useEffect } from 'react'
import Lenis from 'lenis'
import { useNiveauMouvement } from './useNiveauMouvement.ts'

export function DefilementDoux() {
  const niveau = useNiveauMouvement()

  useEffect(() => {
    if (niveau !== 'complet') return

    const lenis = new Lenis({
      // 0.09 : assez pour adoucir la molette, trop peu pour qu'un arrêt se prolonge.
      lerp: 0.09,
      // La molette garde son amplitude ; seule la trajectoire est lissée.
      wheelMultiplier: 1,
      // Le tactile n'est jamais détourné, même si l'appareil a aussi une souris.
      syncTouch: false,
    })

    let image = 0
    const boucle = (temps: number) => {
      lenis.raf(temps)
      image = requestAnimationFrame(boucle)
    }
    image = requestAnimationFrame(boucle)

    return () => {
      cancelAnimationFrame(image)
      lenis.destroy()
    }
  }, [niveau])

  return null
}
