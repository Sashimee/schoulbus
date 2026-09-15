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

/**
 * Le motif du refus de l'ORIGINE, ou `null`. Une origine absente est acceptée : un client
 * qui n'est pas un navigateur n'en déclare pas.
 */
export declare function origineRefusee(origine: unknown, attendue: unknown): 'origine' | null

/**
 * Le motif du refus de la CONFIGURATION, ou `null` si elle peut expédier : OVH exige que le
 * domaine du `From` s'aligne sur celui du compte authentifié.
 */
export declare function desalignementExpediteur(
  utilisateur: unknown,
  expediteur: unknown,
): 'compteSansDomaine' | 'expediteurSansDomaine' | 'domainesDifferents' | null

export declare function creerCompteurDeDebit(maintenant?: () => number): {
  tropSouvent(empreinte: string): boolean
  oublierLesVieux(): void
  readonly taille: number
}
