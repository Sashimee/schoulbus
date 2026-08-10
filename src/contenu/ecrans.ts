/*
 * Les libellés de la maquette — c'est-à-dire de l'application rejouée à l'intérieur du
 * téléphone dessiné.
 *
 * Ils sont tenus à l'écart de `Contenu` volontairement. Ce ne sont pas des textes de
 * présentation mais des bouts d'interface : ils appartiennent à l'application, ils sont
 * courts, et ils changeront le jour où l'application changera — pas le jour où l'on
 * réécrira l'argumentaire. Les mélanger aurait fait relire cent lignes de maquette à
 * chaque retouche de la page.
 *
 * Le prénom « Léa » et l'arrêt « Huttange » sont un exemple, pas une donnée : Huttange
 * est un arrêt réel du plan (`arrets.json`), ce qui évite d'inventer un nom de village
 * que personne ne reconnaîtrait dans la commune.
 */
import type { Langue } from './type.ts'

export type TextesEcran = {
  marque: string
  prochainDepart: string
  dans: (minutes: number) => string
  partezMaintenant: string
  enfant: string
  arret: string
  aFied: (minutes: number) => string
  aller: string
  retour: string
  ecole: string
  jours: [string, string, string, string, string]
  semaineDe: string
  planOfficiel: string
  ligne: string
  arretsDesservis: string
  perturbation: string
  perturbationTexte: string
  adresse: string
  prenom: string
  cycle: string
  etape: (n: number, total: number) => string
  rail: { accueil: string; enfants: string; plan: string; reglages: string }
}

const commun = {
  jours: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'] as [string, string, string, string, string],
}

export const ECRANS: Record<Langue, TextesEcran> = {
  fr: {
    ...commun,
    marque: 'Bus scolaire',
    prochainDepart: 'Prochain départ',
    dans: (m) => `dans ${m} min`,
    partezMaintenant: 'Partez maintenant',
    enfant: 'Léa',
    arret: 'Huttange',
    aFied: (m) => `${m} min à pied`,
    aller: 'Aller',
    retour: 'Retour',
    ecole: 'Noerdange',
    semaineDe: 'La semaine de Léa',
    planOfficiel: 'Plan officiel',
    ligne: 'Ligne',
    arretsDesservis: 'arrêts desservis',
    perturbation: 'Perturbation',
    perturbationTexte: 'Mardi : ramassage retardé de 10 min à Huttange.',
    adresse: 'Adresse du domicile',
    prenom: 'Prénom de l’enfant',
    cycle: 'Cycle',
    etape: (n, total) => `Étape ${n} sur ${total}`,
    rail: { accueil: 'Aujourd’hui', enfants: 'Enfants', plan: 'Plan', reglages: 'Réglages' },
  },

  de: {
    ...commun,
    jours: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    marque: 'Schulbus',
    prochainDepart: 'Nächste Abfahrt',
    dans: (m) => `in ${m} Min.`,
    partezMaintenant: 'Jetzt losgehen',
    enfant: 'Léa',
    arret: 'Huttange',
    aFied: (m) => `${m} Min. zu Fuß`,
    aller: 'Hinfahrt',
    retour: 'Rückfahrt',
    ecole: 'Noerdange',
    semaineDe: 'Léas Woche',
    planOfficiel: 'Offizieller Plan',
    ligne: 'Linie',
    arretsDesservis: 'Haltestellen',
    perturbation: 'Störung',
    perturbationTexte: 'Dienstag: Abholung in Huttange 10 Min. später.',
    adresse: 'Wohnadresse',
    prenom: 'Vorname des Kindes',
    cycle: 'Zyklus',
    etape: (n, total) => `Schritt ${n} von ${total}`,
    rail: { accueil: 'Heute', enfants: 'Kinder', plan: 'Plan', reglages: 'Einstellungen' },
  },

  lb: {
    ...commun,
    jours: ['Mé', 'Dë', 'Më', 'Do', 'Fr'],
    marque: 'Schoulbus',
    prochainDepart: 'Nächst Offaart',
    dans: (m) => `an ${m} Min.`,
    partezMaintenant: 'Elo lassgoen',
    enfant: 'Léa',
    arret: 'Huttange',
    aFied: (m) => `${m} Min. zu Fouss`,
    aller: 'Hifaart',
    retour: 'Réckfaart',
    ecole: 'Noerdange',
    semaineDe: 'Léa hir Woch',
    planOfficiel: 'Offizielle Plang',
    ligne: 'Linn',
    arretsDesservis: 'Haltestellen',
    perturbation: 'Stéierung',
    perturbationTexte: 'Dënschdeg: Ofhuelen zu Huttange 10 Min. méi spéit.',
    adresse: 'Wunnadress',
    prenom: 'Virnumm vum Kand',
    cycle: 'Cycle',
    etape: (n, total) => `Schrëtt ${n} vun ${total}`,
    rail: { accueil: 'Haut', enfants: 'Kanner', plan: 'Plang', reglages: 'Astellungen' },
  },
}
