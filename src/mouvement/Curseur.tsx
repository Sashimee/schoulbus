/*
 * Le curseur : un anneau qui suit la main, un point qui la colle.
 *
 * Ce qu'il ne fait PAS, et c'est l'essentiel :
 *
 *  - Il ne masque pas le curseur système. Un anneau qui traîne de trois images derrière
 *    la main rend le clic imprécis, et quiconque n'a pas chargé le JavaScript doit
 *    toujours voir où il pointe. Il s'ajoute, il ne remplace pas.
 *  - Il ne remplace jamais `:focus-visible`. La souris et le clavier sont deux publics
 *    distincts ; embellir l'un ne donne pas le droit d'appauvrir l'autre.
 *
 * La position est écrite directement dans le style du nœud, sans passer par l'état de
 * React : à 120 Hz, un rendu par déplacement de souris ferait plus de travail que toute
 * la page réunie. `motion` porte l'inertie du seul anneau, le point reste collé.
 */
import { useEffect, useRef } from 'react'
import { useNiveauMouvement } from './useNiveauMouvement.ts'

/** Ce qui fait grossir l'anneau : tout ce sur quoi on peut réellement agir. */
const INTERACTIF = 'a, button, [role="button"], input, select, summary, .carte--projecteur'

export function Curseur() {
  const niveau = useNiveauMouvement()
  const anneau = useRef<HTMLDivElement>(null)
  const point = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (niveau !== 'complet') return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let ax = x
    let ay = y
    let image = 0
    let vu = false

    const surDeplacement = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!vu) {
        // Avant le premier mouvement, l'anneau n'a aucune position légitime : le poser au
        // centre le ferait traverser l'écran en diagonale au premier geste.
        vu = true
        ax = x
        ay = y
        if (anneau.current) anneau.current.style.opacity = '1'
        if (point.current) point.current.style.opacity = '1'
      }
      if (point.current) point.current.style.transform = `translate3d(${x}px, ${y}px, 0)`

      const cible = (e.target as Element | null)?.closest?.(INTERACTIF)
      anneau.current?.setAttribute('data-actif', cible ? 'oui' : 'non')
    }

    // La main quitte la fenêtre : l'anneau doit partir avec elle, pas rester figé au bord.
    const surSortie = () => {
      if (anneau.current) anneau.current.style.opacity = '0'
      if (point.current) point.current.style.opacity = '0'
      vu = false
    }

    const boucle = () => {
      // Poursuite exponentielle : l'anneau rattrape 18 % de l'écart par image. C'est ce
      // retard qui donne la matière ; au-delà de ~25 %, il n'y a plus d'inertie du tout.
      ax += (x - ax) * 0.18
      ay += (y - ay) * 0.18
      if (anneau.current) anneau.current.style.transform = `translate3d(${ax}px, ${ay}px, 0)`
      image = requestAnimationFrame(boucle)
    }
    image = requestAnimationFrame(boucle)

    window.addEventListener('pointermove', surDeplacement, { passive: true })
    document.addEventListener('pointerleave', surSortie)
    return () => {
      cancelAnimationFrame(image)
      window.removeEventListener('pointermove', surDeplacement)
      document.removeEventListener('pointerleave', surSortie)
    }
  }, [niveau])

  if (niveau !== 'complet') return null

  return (
    <div aria-hidden="true">
      <div ref={anneau} className="curseur curseur__anneau" data-actif="non" />
      <div ref={point} className="curseur curseur__point" />
    </div>
  )
}
