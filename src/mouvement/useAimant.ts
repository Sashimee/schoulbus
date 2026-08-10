/*
 * L'aimant : un bouton qui se penche vers le pointeur qui l'approche.
 *
 * Le déplacement est volontairement petit — 10 px au plus. Un aimant généreux est
 * amusant à la première rencontre et pénible à la dixième : la cible se dérobe, on
 * clique à côté, et un bouton qui esquive le clic est un défaut, pas un effet. Dix
 * pixels se sentent sans jamais déplacer la cible hors du doigt.
 *
 * La translation est écrite sur le nœud, hors de React : suivre un pointeur par l'état
 * relancerait un rendu à chaque pixel.
 */
import { useEffect, useRef } from 'react'
import { useNiveauMouvement } from './useNiveauMouvement.ts'

/** Distance au-delà de laquelle le bouton ignore le pointeur. */
const PORTEE = 90
/** Déplacement maximal. Voir plus haut : la retenue est le sujet. */
const AMPLITUDE = 10

export function useAimant<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const niveau = useNiveauMouvement()

  useEffect(() => {
    const noeud = ref.current
    if (!noeud || niveau !== 'complet') return

    let x = 0
    let y = 0
    let cx = 0
    let cy = 0
    let image = 0

    const surDeplacement = (e: PointerEvent) => {
      const boite = noeud.getBoundingClientRect()
      const dx = e.clientX - (boite.left + boite.width / 2)
      const dy = e.clientY - (boite.top + boite.height / 2)
      const distance = Math.hypot(dx, dy)

      if (distance > PORTEE + Math.max(boite.width, boite.height) / 2) {
        cx = 0
        cy = 0
        return
      }
      // Normalisé puis borné : un pointeur au centre ne déplace rien, un pointeur au
      // bord de la portée déplace au maximum.
      const force = Math.min(1, distance / PORTEE)
      cx = (dx / (distance || 1)) * AMPLITUDE * force
      cy = (dy / (distance || 1)) * AMPLITUDE * force
    }

    const boucle = () => {
      x += (cx - x) * 0.16
      y += (cy - y) * 0.16
      // Sous le dixième de pixel, on cesse d'écrire : inutile de garder une couche
      // composée vivante pour un déplacement que personne ne voit.
      if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05) noeud.style.transform = ''
      else noeud.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      image = requestAnimationFrame(boucle)
    }
    image = requestAnimationFrame(boucle)

    window.addEventListener('pointermove', surDeplacement, { passive: true })
    return () => {
      cancelAnimationFrame(image)
      window.removeEventListener('pointermove', surDeplacement)
      noeud.style.transform = ''
    }
  }, [niveau])

  return ref
}
