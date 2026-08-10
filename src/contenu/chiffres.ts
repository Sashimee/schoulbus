/*
 * Chiffres de la vitrine — FICHIER ENGENDRÉ, NE PAS MODIFIER À LA MAIN.
 *
 * Source : bus-scolaire-beckerich/src/data/ (arrets, ecoles, plan, adresses).
 * Régénérer :  node scripts/build-chiffres.mjs
 *
 * Aucun de ces nombres n'est estimé. Une page qui annonce un chiffre qu'elle n'a pas
 * compté finit par en annoncer un faux — et l'application, elle, promet de dire ce
 * qu'elle ne sait pas.
 */
export const CHIFFRES = {
  "arrets": 17,
  "villages": 8,
  "sites": 5,
  "cycles": 5,
  "lignes": 7,
  "rues": 59,
  "langues": 5,
  "anneeScolaire": "2025/2026",
  "donneesEnvoyees": 0
} as const

export type Chiffres = typeof CHIFFRES
