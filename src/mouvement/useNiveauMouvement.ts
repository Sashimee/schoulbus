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
 * Le niveau est mesuré UNE FOIS pour la page, dans un magasin partagé, et l'arbre servi
 * par le pré-rendu vaut toujours 'aucun' : au pré-rendu, il n'existe ni `matchMedia` ni
 * WebGL, et deviner produirait une hydratation divergente. C'est ce que rend
 * `getServerSnapshot`, que React emploie aussi pendant l'hydratation ; la mesure ne
 * reprend la main qu'ensuite. 'aucun' est l'état où tout est visible et immobile : une
 * page qui s'affiche puis s'anime est correcte ; une page qui reste blanche parce que le
 * JavaScript n'est jamais arrivé ne l'est pas.
 */
import { useSyncExternalStore } from 'react'

export type NiveauMouvement = 'complet' | 'reduit' | 'aucun'

/*
 * UNE SEULE MESURE POUR TOUTE LA PAGE, et c'est le sujet de ce magasin.
 *
 * Le crochet est appelé trente-neuf fois dans l'arbre — une fois par `Revele`, une par
 * `Bouton`, plus le rideau, le défilement doux et la bande de chiffres. Tant que chaque
 * appel mesurait pour son compte, l'ouverture de la page demandait trente-neuf contextes
 * WebGL2 qu'aucun ne relâchait — Chromium en plafonne seize et perd les plus anciens en
 * s'en plaignant — et créait deux cent trente-cinq objets `matchMedia`, dont cent
 * dix-sept écouteurs permanents ; le moindre changement de média rejouait ensuite les
 * trente-neuf mesures. Rien de tout cela ne se voyait à l'écran : le résultat était juste,
 * et identique d'un appel à l'autre, puisque c'est UNE décision pour toute la page.
 */

let webgl: boolean | undefined

/** WebGL2 est-il réellement obtenable ? Un contexte perdu se voit ici, pas plus tard. */
function webglDisponible(): boolean {
  // La réponse ne change pas d'une composante à l'autre, ni d'une seconde à l'autre : la
  // toile n'est fabriquée qu'au premier appel.
  if (webgl === undefined) {
    try {
      const toile = document.createElement('canvas')
      webgl = Boolean(toile.getContext('webgl2'))
    } catch {
      webgl = false
    }
  }
  return webgl
}

let requetes: MediaQueryList[] | undefined

/*
 * Les trois conditions peuvent changer sans rechargement : on branche un clavier et une
 * souris sur une tablette, on redimensionne une fenêtre, on active « réduire les
 * animations » dans les réglages système pendant que la page est ouverte. Ce dernier cas
 * est le plus important : quelqu'un qui coupe les animations en pleine crise vestibulaire
 * ne doit pas avoir à recharger.
 */
function surveillees(): MediaQueryList[] {
  requetes ??= [
    window.matchMedia('(prefers-reduced-motion: reduce)'),
    window.matchMedia('(pointer: fine)'),
    window.matchMedia('(min-width: 62rem)'),
  ]
  return requetes
}

function mesurer(): NiveauMouvement {
  const [reduire, pointeurFin, assezLarge] = surveillees()
  if (reduire.matches) return 'aucun'

  // `hardwareConcurrency` est absent sur quelques navigateurs ; son absence ne doit pas
  // dégrader une machine capable, d'où le repli optimiste à 4.
  const coeurs = navigator.hardwareConcurrency ?? 4

  if (pointeurFin.matches && assezLarge.matches && coeurs >= 4 && webglDisponible()) {
    return 'complet'
  }
  return 'reduit'
}

let cache: NiveauMouvement | undefined
const abonnes = new Set<() => void>()

function relire(): void {
  cache = mesurer()
  for (const prevenir of abonnes) prevenir()
}

function sabonner(prevenir: () => void): () => void {
  // Les trois écouteurs sont posés pour la page entière, pas pour chaque abonné.
  if (abonnes.size === 0) for (const r of surveillees()) r.addEventListener('change', relire)
  abonnes.add(prevenir)
  return () => {
    abonnes.delete(prevenir)
    if (abonnes.size === 0) for (const r of surveillees()) r.removeEventListener('change', relire)
  }
}

/** Le niveau mesuré. React l'appelle à chaque rendu : il doit rendre la même valeur. */
function lire(): NiveauMouvement {
  cache ??= mesurer()
  return cache
}

/*
 * Au pré-rendu, il n'existe ni `matchMedia` ni WebGL, et deviner produirait une
 * hydratation divergente. React rend donc l'arbre servi avec cette valeur-ci, puis
 * repasse à la mesure une fois la page vivante. `aucun` est aussi l'état où tout est
 * visible et immobile : une page qui s'affiche puis s'anime est correcte ; une page
 * restée blanche parce que le JavaScript n'est jamais arrivé ne l'est pas.
 */
function auPreRendu(): NiveauMouvement {
  return 'aucun'
}

export function useNiveauMouvement(): NiveauMouvement {
  return useSyncExternalStore(sabonner, lire, auPreRendu)
}

/** Raccourci lisible : y a-t-il le droit de bouger, tout court ? */
export function anime(niveau: NiveauMouvement): boolean {
  return niveau !== 'aucun'
}
