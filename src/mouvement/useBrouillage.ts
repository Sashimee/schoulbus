/*
 * Le brouillage : une suite de chiffres qui se stabilise, caractère par caractère.
 *
 * Employé sur une seule chose dans toute la page — l'heure du héros — et jamais sur du
 * texte courant : un mot qui se recompose est illisible pendant qu'il se recompose, et
 * la bibliothèque de mouvement du projet est formelle, « l'heure ne défile pas, elle est
 * là ». Le compromis retenu : elle se pose en 700 ms à l'ouverture, puis ne bouge plus
 * jamais. C'est une entrée en scène, pas un compteur.
 *
 * Deux détails qui font la différence entre un effet et un défaut :
 *
 *  - Les séparateurs (« : ») ne sont jamais brouillés. Ils tiennent la forme de l'heure,
 *    et les voir changer donnerait l'impression d'un format instable.
 *  - Les caractères de remplacement sont des chiffres, dans une fonte à chasse fixe avec
 *    `tabular-nums` : la largeur ne bouge pas d'un pixel, donc rien ne saute autour.
 */
import { useEffect, useRef, useState } from 'react'

const CHIFFRES = '0123456789'
/** Durée totale, séparateurs compris. Sous la seconde, comme tout le reste du projet. */
const DUREE = 700

export function useBrouillage(texte: string, actif: boolean): string {
  const [affiche, setAffiche] = useState(texte)
  const fait = useRef(false)

  useEffect(() => {
    if (!actif || fait.current) return
    fait.current = true

    const debut = performance.now()
    let image = 0

    const etape = (maintenant: number) => {
      const avance = Math.min(1, (maintenant - debut) / DUREE)

      const rendu = texte
        .split('')
        .map((caractere, i) => {
          if (!/[0-9]/.test(caractere)) return caractere
          // Chaque caractère se fige un peu après le précédent : le seuil monte de gauche
          // à droite, si bien que l'heure se lit d'abord par ses dizaines.
          const seuil = (i + 1) / (texte.length + 1)
          if (avance >= seuil) return caractere
          return CHIFFRES[Math.floor(Math.random() * CHIFFRES.length)]
        })
        .join('')

      setAffiche(rendu)
      if (avance < 1) image = requestAnimationFrame(etape)
      else setAffiche(texte)
    }

    image = requestAnimationFrame(etape)
    return () => cancelAnimationFrame(image)
  }, [texte, actif])

  // Sans mouvement, l'heure est simplement là — ce qui est de toute façon sa vocation.
  return actif ? affiche : texte
}
