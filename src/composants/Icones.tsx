/*
 * Le jeu d'icônes.
 *
 * Même facture que celles de l'application (`src/composants/Navigation.tsx`) : tracé
 * seul dans une boîte de 24, contour à 1,75, extrémités et jointures arrondies, couleur
 * héritée.
 *
 * LE JEU A MAIGRI AVEC LA REFONTE. Il portait dix-huit tracés ; il en reste douze — les
 * neuf des tuiles, la flèche de lien sortant, et les deux du sélecteur de thème. Sont
 * partis avec leurs sections : les
 * quatre du rail de la maquette de téléphone (accueil, enfants, réglages), les trois du
 * schéma de confidentialité (cadenas, loupe, dièse), et trois autres qu'aucune section
 * n'appelait plus. Une icône qu'on garde « au cas où » est une icône que personne ne
 * relit et que le prochain venu croit utilisée.
 *
 * Les attributs de contour sont portés par le `<svg>` plutôt que par une règle CSS :
 * une icône est un dessin, pas une surface, et ses propriétés de tracé lui appartiennent
 * autant que sa boîte. Ce ne sont pas des valeurs de charte — aucune couleur, aucune
 * dimension — donc la règle « rien en dur hors des jetons » n'est pas en cause.
 */

export type NomIcone = keyof typeof TRACES

const TRACES = {
  /* --- Les neuf tuiles, dans l'ordre de `fonctions.tuiles` --- */
  semaine: 'M4 6h16v14H4zM8 3v4M16 3v4M4 11h16M8 15h.01M12 15h.01M16 15h.01',
  plan: 'M5 5h14v10H5zM5 15v3h3v-3M16 15v3h3v-3M5 10h14M9 5v5M15 5v5',
  agenda: 'M5 5h14v15H5zM9 3v4M15 3v4M5 10h14M9 15l2 2 4-4',
  alerte: 'M12 4l8.5 15h-17zM12 10v4M12 16.5h.01',
  imprimer: 'M7 9V4h10v5M7 15H5a1 1 0 01-1-1v-3a2 2 0 012-2h12a2 2 0 012 2v3a1 1 0 01-1 1h-2M7 14h10v6H7z',
  partage:
    'M18 7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 21.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.2 10.8l7.6-4.2M8.2 13.2l7.6 4.2',
  repas: 'M6 3v7a2 2 0 104 0V3M8 10v11M16.5 3c-1.6 1.6-1.6 5.4 0 7V21',
  adresse: 'M12 21s6.5-6 6.5-10.5a6.5 6.5 0 10-13 0C5.5 15 12 21 12 21zM12 8.5a2 2 0 100 4 2 2 0 000-4z',
  horloge: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5V12l3 1.8',

  /* --- La flèche d'un lien sortant --- */
  externe: 'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',

  /*
   * --- Le sélecteur de thème ---
   *
   * Le soleil et le croissant, et non deux mots. « Clair » et « Sombre » demandaient de
   * lire pour agir, dans cinq langues et dans une barre où la place manque ; ces deux
   * dessins-là sont compris sans être lus, ce qui est exactement ce qu'on attend d'une
   * commande qu'on actionne d'un pouce. Les mots ne disparaissent pas pour autant : ils
   * restent le nom accessible du bouton (`aria-label`) et son infobulle — voir
   * `Selecteurs.tsx`. Une icône seule sans nom accessible serait un bouton muet.
   */
  soleil:
    'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  lune: 'M12 3.2a6.4 6.4 0 008.8 8.8 8.8 8.8 0 11-8.8-8.8z',
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
