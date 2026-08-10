/*
 * Le projecteur : une lueur qui suit le pointeur à l'intérieur d'une carte.
 *
 * Tout le travail est fait par le CSS (`.carte--projecteur`, dans `composants.css`) ;
 * ce crochet n'écrit que deux variables, `--x` et `--y`, en pourcentage de la carte.
 * Passer par l'état de React reviendrait à rendre l'arbre une centaine de fois par
 * seconde pour animer un dégradé.
 *
 * L'écouteur est posé sur la carte, pas sur la fenêtre : neuf tuiles font neuf
 * écouteurs, mais chacun ne s'éveille que sous le pointeur. Un écouteur global, lui,
 * aurait fait travailler les neuf cartes en permanence.
 */
import { useEffect, useRef } from 'react'
import { useNiveauMouvement } from './useNiveauMouvement.ts'

export function useProjecteur<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const niveau = useNiveauMouvement()

  useEffect(() => {
    const noeud = ref.current
    if (!noeud || niveau !== 'complet') return

    const surDeplacement = (e: PointerEvent) => {
      const boite = noeud.getBoundingClientRect()
      noeud.style.setProperty('--x', `${((e.clientX - boite.left) / boite.width) * 100}%`)
      noeud.style.setProperty('--y', `${((e.clientY - boite.top) / boite.height) * 100}%`)
    }

    noeud.addEventListener('pointermove', surDeplacement, { passive: true })
    return () => noeud.removeEventListener('pointermove', surDeplacement)
  }, [niveau])

  return ref
}
