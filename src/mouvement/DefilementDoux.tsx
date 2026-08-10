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
import { useNiveauMouvement } from './useNiveauMouvement.ts'

export function DefilementDoux() {
  const niveau = useNiveauMouvement()

  useEffect(() => {
    if (niveau !== 'complet') return

    /*
     * La bibliothèque est chargée ICI, et non en haut du fichier.
     *
     * Elle pèse 5,4 ko une fois comprimée, et ne sert qu'au niveau 'complet' — souris,
     * écran large. Un téléphone ne l'exécute jamais ; importée en tête, il la
     * téléchargeait quand même, avant de pouvoir afficher quoi que ce soit. Le niveau
     * n'est connu qu'après le premier rendu, ce qui tombe bien : c'est aussi le moment
     * où un import dynamique ne retarde plus rien.
     */
    let vivant = true
    let arreter: (() => void) | undefined

    void import('lenis').then(({ default: Lenis }) => {
      // Le niveau a pu retomber pendant le chargement, ou la composante être démontée.
      if (!vivant) return

      const lenis = new Lenis({
        // 0.09 : assez pour adoucir la molette, trop peu pour qu'un arrêt se prolonge.
        lerp: 0.09,
        // La molette garde son amplitude ; seule la trajectoire est lissée.
        wheelMultiplier: 1,
        // Le tactile n'est jamais détourné, même si l'appareil a aussi une souris.
        syncTouch: false,
      })

      let image = requestAnimationFrame(function boucle(temps: number) {
        lenis.raf(temps)
        image = requestAnimationFrame(boucle)
      })

      arreter = () => {
        cancelAnimationFrame(image)
        lenis.destroy()
      }
    })

    return () => {
      vivant = false
      arreter?.()
    }
  }, [niveau])

  return null
}
