/*
 * La carte de verre, avec son projecteur optionnel.
 *
 * `projecteur` ne s'active que si le pointeur peut réellement s'y promener — le crochet
 * s'en charge tout seul, et la règle CSS ne s'allume qu'au survol : sur tactile, la
 * carte reste une carte, sans lueur morte au milieu.
 */
import type { ReactNode } from 'react'
import { useProjecteur } from '../mouvement/useProjecteur.ts'

type Props = {
  children: ReactNode
  accent?: boolean
  projecteur?: boolean
  className?: string
}

export function Carte({ children, accent = false, projecteur = false, className }: Props) {
  const ref = useProjecteur<HTMLDivElement>()

  const classes = [
    'carte',
    accent ? 'carte--accent' : '',
    projecteur ? 'carte--projecteur' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={projecteur ? ref : undefined} className={classes}>
      {children}
    </div>
  )
}
