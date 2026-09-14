/*
 * Le bouton.
 *
 * Tous les appels à l'action de la vitrine sont des LIENS, jamais des `<button>` : ils
 * mènent à l'application, qui est un autre site. Un bouton annonce une action dans la
 * page ; un lien annonce un départ. Confondre les deux prive une personne au clavier de
 * « ouvrir dans un nouvel onglet », et un lecteur d'écran de la seule information qui
 * compte ici — qu'on va quitter la page.
 */
import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  variante?: 'primaire' | 'discret' | 'fantome'
  grand?: boolean
  /** Un lien sortant s'annonce ; un lien interne à la page, non. */
  externe?: boolean
  className?: string
}

export function Bouton({
  href,
  children,
  variante = 'discret',
  grand = false,
  externe = false,
  className,
}: Props) {
  const classes = ['bouton', `bouton--${variante}`, grand ? 'bouton--grand' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
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
}
