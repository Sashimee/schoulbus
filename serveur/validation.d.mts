/*
 * Le contrat de `validation.mjs`, pour que les tests de la vitrine puissent l'importer.
 *
 * Écrit à la main plutôt qu'engendré : le relais est un paquet à part, sans étape de
 * construction et sans TypeScript — c'est un service de quatre-vingts lignes qui doit
 * pouvoir démarrer avec `node index.mjs`, et lui donner une chaîne de compilation pour
 * le seul confort des types d'en face serait payer cher un fichier de vingt lignes.
 */
export declare const PLAFONDS: {
  sujet: number
  message: number
  reponse: number
  delaiMinimal: number
  liensMaximum: number
  envoisParHeure: number
  fenetre: number
  octetsMaximum: number
}

/** Le motif du refus, ou `null` si le message peut partir. */
export declare function motifDeRefus(
  corps: unknown,
): 'leurre' | 'vide' | 'tropLong' | 'tropVite' | 'tropDeLiens' | null

export declare function creerCompteurDeDebit(maintenant?: () => number): {
  tropSouvent(empreinte: string): boolean
  oublierLesVieux(): void
  readonly taille: number
}
