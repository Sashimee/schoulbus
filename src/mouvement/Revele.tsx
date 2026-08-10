/*
 * La révélation au défilement, en une seule composante.
 *
 * Elle reprend exactement les deux gestes de l'application : `monte` (14 px vers le
 * haut) et `glisse` (18 px depuis la droite), avec sa courbe de sortie et son décalage
 * de 60 ms entre voisins. Une carte qui apparaît sur la vitrine et une carte qui
 * apparaît dans l'application doivent être le même mouvement, sinon les deux sites ne
 * se ressemblent que sur l'image fixe.
 *
 * Deux garde-fous :
 *
 *  - `once: true`. Un élément qui rejoue son entrée à chaque passage transforme un
 *    retour en arrière dans la page en clignotement.
 *  - L'état de départ n'est posé que si le mouvement est autorisé. Sans cela, une page
 *    dont le JavaScript échoue à mi-parcours resterait à `opacity: 0` — invisible et
 *    irrécupérable. Le défaut, ici, est d'être visible.
 */
import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { useNiveauMouvement } from './useNiveauMouvement.ts'

type Props = {
  children: ReactNode
  /** Rang dans une série : décale l'entrée de 60 ms par cran, trois crans au plus. */
  rang?: number
  /** `monte` par défaut ; `glisse` pour ce qui vient du bord. */
  geste?: 'monte' | 'glisse'
  className?: string
  /** Balise portée par l'élément animé (`li`, `article`…). */
  as?: 'div' | 'li' | 'article' | 'section' | 'p'
}

/*
 * Trois crans suffisent — c'est la règle de l'application. Au-delà, le dernier élément
 * d'une liste de neuf attendrait plus d'une demi-seconde après le premier, et la grille
 * se lirait comme un chargement plutôt que comme une apparition.
 */
const PAS = 0.06
const CRANS_MAX = 3

export function Revele({ children, rang = 0, geste = 'monte', className, as = 'div' }: Props) {
  const niveau = useNiveauMouvement()
  const Balise = m[as]

  if (niveau === 'aucun') {
    const Simple = as
    return <Simple className={className}>{children}</Simple>
  }

  const depart = geste === 'monte' ? { opacity: 0, y: 14 } : { opacity: 0, x: 18 }

  return (
    <Balise
      className={className}
      initial={depart}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={{
        duration: 0.55,
        delay: Math.min(rang, CRANS_MAX) * PAS,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      {children}
    </Balise>
  )
}
