/*
 * Le jeu d'icônes.
 *
 * Même facture que celles de l'application (`src/composants/Navigation.tsx`) : tracé
 * seul dans une boîte de 24, contour à 1,75, extrémités et jointures arrondies, couleur
 * héritée. Quatre d'entre elles — accueil, enfants, plan, réglages — sont recopiées
 * telles quelles, parce qu'elles apparaissent dans le rail de la maquette et doivent y
 * être exactement les mêmes que dans l'application.
 *
 * Les attributs de contour sont portés par le `<svg>` plutôt que par une règle CSS :
 * une icône est un dessin, pas une surface, et ses propriétés de tracé lui appartiennent
 * autant que sa boîte. Ce ne sont pas des valeurs de charte — aucune couleur, aucune
 * dimension — donc la règle « rien en dur hors des jetons » n'est pas en cause.
 */

export type NomIcone = keyof typeof TRACES

const TRACES = {
  /* --- Reprises de l'application, pour le rail de la maquette --- */
  accueil: 'M5 5h14v15H5zM9 3v4M15 3v4M5 10h14M12 14h.01',
  enfants:
    'M9 11a3 3 0 100-6 3 3 0 000 6zM3.5 20a5.5 5.5 0 0111 0M16 12a2.5 2.5 0 100-5M17 20h3.5a4.5 4.5 0 00-3-4.2',
  plan: 'M5 5h14v10H5zM5 15v3h3v-3M16 15v3h3v-3M5 10h14M9 5v5M15 5v5',
  reglages: 'M4 7h16M4 12h16M4 17h16M9 5v4M16 10v4M7 15v4',

  /* --- Propres à la vitrine --- */
  semaine: 'M4 6h16v14H4zM8 3v4M16 3v4M4 11h16M8 15h.01M12 15h.01M16 15h.01',
  agenda: 'M5 5h14v15H5zM9 3v4M15 3v4M5 10h14M9 15l2 2 4-4',
  alerte: 'M12 4l8.5 15h-17zM12 10v4M12 16.5h.01',
  imprimer: 'M7 9V4h10v5M7 15H5a1 1 0 01-1-1v-3a2 2 0 012-2h12a2 2 0 012 2v3a1 1 0 01-1 1h-2M7 14h10v6H7z',
  partage:
    'M18 7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 21.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.2 10.8l7.6-4.2M8.2 13.2l7.6 4.2',
  repas: 'M6 3v7a2 2 0 104 0V3M8 10v11M16.5 3c-1.6 1.6-1.6 5.4 0 7V21',
  adresse: 'M12 21s6.5-6 6.5-10.5a6.5 6.5 0 10-13 0C5.5 15 12 21 12 21zM12 8.5a2 2 0 100 4 2 2 0 000-4z',
  horloge: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5V12l3 1.8',

  /* --- Confidentialité --- */
  cadenas: 'M6 11h12v9H6zM9 11V8a3 3 0 016 0v3M12 15v2',
  loupe: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4.2-4.2',
  diese: 'M9.5 4L7.5 20M16.5 4l-2 16M4 9.5h16M3.5 14.5h16',

  /* --- Hors ligne --- */
  telecharger: 'M12 4v10M8 11l4 4 4-4M5 17v2a1 1 0 001 1h12a1 1 0 001-1v-2',
  appareil: 'M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM10.5 18h3',

  /* --- Contact --- */
  courrier: 'M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zM3.5 7.5l8.5 6 8.5-6',

  /* --- Divers --- */
  fleche: 'M5 12h14M13 6l6 6-6 6',
  externe: 'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
} as const

export function Icone({ nom, className }: { nom: NomIcone; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={TRACES[nom]} />
    </svg>
  )
}
