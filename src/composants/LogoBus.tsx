/*
 * Le bus, repris de `public/favicon.svg` de l'application.
 *
 * La géométrie est identique au pixel près — c'est la même marque, elle ne doit pas
 * exister en deux dessins. Seules les couleurs changent : l'icône de l'application est
 * restée sur l'ancienne palette (`#14161f` / `#82a9ff`), antérieure à la refonte
 * « verre » du lot 18, et son propre script de génération note qu'il faudra la
 * réaligner. La vitrine ne recopie donc pas ces valeurs : elle prend les jetons
 * courants, `--fond` et `--accent`, via `currentColor` et une variable.
 *
 * `variante="trace"` sert au rideau d'ouverture : le même dessin, en traits, pour qu'il
 * puisse s'écrire au lieu d'apparaître.
 */

type Props = {
  className?: string
  variante?: 'plein' | 'trace'
}

export function LogoBus({ className, variante = 'plein' }: Props) {
  if (variante === 'trace') {
    return (
      <svg className={className} viewBox="0 0 512 512" fill="none" aria-hidden="true">
        {/* La longueur du tracé, que `stroke-dasharray` consomme, est posée en CSS
            (`.rideau__trace`) : elle dépend du dessin, pas de qui l'affiche. */}
        <g
          className="rideau__trace"
          stroke="var(--accent)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="116" y="112" width="280" height="248" rx="44" />
          <rect x="152" y="152" width="208" height="104" rx="20" />
          <circle cx="180" cy="306" r="24" />
          <circle cx="332" cy="306" r="24" />
          <rect x="150" y="360" width="52" height="46" rx="16" />
          <rect x="310" y="360" width="52" height="46" rx="16" />
        </g>
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="var(--fond)" />
      <rect x="116" y="112" width="280" height="248" rx="44" fill="var(--accent)" />
      {/* Les vitres et les roues sont creusées dans la carrosserie : même teinte que le fond. */}
      <rect x="152" y="152" width="208" height="104" rx="20" fill="var(--fond)" />
      <circle cx="180" cy="306" r="24" fill="var(--fond)" />
      <circle cx="332" cy="306" r="24" fill="var(--fond)" />
      <rect x="150" y="360" width="52" height="46" rx="16" fill="var(--encre)" />
      <rect x="310" y="360" width="52" height="46" rx="16" fill="var(--encre)" />
    </svg>
  )
}
