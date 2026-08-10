/*
 * Trois niveaux de mouvement, et une seule décision pour toute la page.
 *
 * La demande était « au maximum, expérimental ». Ce fichier est l'endroit où cette
 * demande rencontre le public réel de l'application : des parents à un arrêt de bus, à
 * sept heures du matin, souvent sur un téléphone de cinq ans. Un nuage animé en WebGL et
 * un curseur qui traîne coûtent, sur un tel appareil, exactement ce qu'ils rapportent —
 * rien.
 *
 * D'où l'étagement plutôt que l'interrupteur :
 *
 *   'complet'  Pointeur fin, WebGL2 disponible, au moins 4 cœurs. Tout : nuage animé,
 *              défilement doux, curseur, brouillage, aimants, projecteurs.
 *   'reduit'   Tactile, ou machine modeste. Le fond redevient le dégradé CSS de
 *              l'application, pas de curseur ni de défilement doux. Les révélations au
 *              défilement restent : elles ne coûtent qu'une transformation.
 *   'aucun'    « Réduire les animations » est demandé. Rien ne bouge. Ce n'est pas un
 *              réglage de confort : c'est un besoin médical, et la page doit rester
 *              entièrement lisible et utilisable sans une seule animation.
 *
 * Le niveau est calculé APRÈS le montage, jamais pendant le rendu : au pré-rendu, il
 * n'existe ni `matchMedia` ni WebGL, et deviner produirait une hydratation divergente.
 * Le premier rendu est donc toujours 'aucun' — l'état où tout est visible et immobile.
 * Une page qui s'affiche puis s'anime est correcte ; une page qui reste blanche parce
 * que le JavaScript n'est jamais arrivé ne l'est pas.
 */
import { useEffect, useState } from 'react'

export type NiveauMouvement = 'complet' | 'reduit' | 'aucun'

/** WebGL2 est-il réellement obtenable ? Un contexte perdu se voit ici, pas plus tard. */
function webglDisponible(): boolean {
  try {
    const toile = document.createElement('canvas')
    return Boolean(toile.getContext('webgl2'))
  } catch {
    return false
  }
}

function mesurer(): NiveauMouvement {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'aucun'

  const pointeurFin = window.matchMedia('(pointer: fine)').matches
  const assezLarge = window.matchMedia('(min-width: 62rem)').matches
  // `hardwareConcurrency` est absent sur quelques navigateurs ; son absence ne doit pas
  // dégrader une machine capable, d'où le repli optimiste à 4.
  const coeurs = navigator.hardwareConcurrency ?? 4

  if (pointeurFin && assezLarge && coeurs >= 4 && webglDisponible()) return 'complet'
  return 'reduit'
}

export function useNiveauMouvement(): NiveauMouvement {
  const [niveau, setNiveau] = useState<NiveauMouvement>('aucun')

  useEffect(() => {
    const relire = () => setNiveau(mesurer())
    relire()

    /*
     * Les trois conditions peuvent changer sans rechargement : on branche un clavier et
     * une souris sur une tablette, on redimensionne une fenêtre, on active « réduire les
     * animations » dans les réglages système pendant que la page est ouverte. Ce dernier
     * cas est le plus important : quelqu'un qui coupe les animations en pleine crise
     * vestibulaire ne doit pas avoir à recharger.
     */
    const requetes = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(min-width: 62rem)'),
    ]
    for (const r of requetes) r.addEventListener('change', relire)
    return () => {
      for (const r of requetes) r.removeEventListener('change', relire)
    }
  }, [])

  return niveau
}

/** Raccourci lisible : y a-t-il le droit de bouger, tout court ? */
export function anime(niveau: NiveauMouvement): boolean {
  return niveau !== 'aucun'
}
