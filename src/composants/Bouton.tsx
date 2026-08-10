/*
 * Le bouton, et sa variante aimantée.
 *
 * Tous les appels à l'action de la vitrine sont des LIENS, jamais des `<button>` : ils
 * mènent à l'application, qui est un autre site. Un bouton annonce une action dans la
 * page ; un lien annonce un départ. Confondre les deux prive une personne au clavier de
 * « ouvrir dans un nouvel onglet », et un lecteur d'écran de la seule information qui
 * compte ici — qu'on va quitter la page.
 *
 * L'enveloppe `.aimant` porte la translation calculée par `useAimant`, le lien garde ses
 * propres transitions : deux transformations sur un même nœud s'écraseraient.
 */
import type { ReactNode } from 'react'
import { useAimant } from '../mouvement/useAimant.ts'

type Props = {
  href: string
  children: ReactNode
  variante?: 'primaire' | 'discret' | 'fantome'
  grand?: boolean
  aimante?: boolean
  /** Un lien sortant s'annonce ; un lien interne à la page, non. */
  externe?: boolean
  className?: string
}

export function Bouton({
  href,
  children,
  variante = 'discret',
  grand = false,
  aimante = false,
  externe = false,
  className,
}: Props) {
  const ref = useAimant<HTMLSpanElement>()

  const classes = ['bouton', `bouton--${variante}`, grand ? 'bouton--grand' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  const lien = (
    <a
      href={href}
      className={classes}
      {...(externe
        ? {
            target: '_blank',
            // `noreferrer` autant que `noopener` : la page ouverte n'a pas à savoir d'où
            // vient la visite.
            rel: 'noopener noreferrer',
          }
        : {})}
    >
      {children}
    </a>
  )

  if (!aimante) return lien

  return (
    <span ref={ref} className="aimant">
      {lien}
    </span>
  )
}
