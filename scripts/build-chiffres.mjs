/*
 * Engendre `src/contenu/chiffres.ts` à partir des données réelles de l'application.
 *
 * Une page de présentation qui annonce « 17 arrêts » doit tenir ce chiffre de la même
 * source que l'application, sinon elle finit par mentir : un arrêt ajouté dans
 * `arrets.json` ne se propage pas tout seul dans une phrase écrite à la main.
 *
 *   node scripts/build-chiffres.mjs
 *
 * Le fichier engendré est versionné : la vitrine doit pouvoir se construire seule, sans
 * l'application à côté. Le régénérer fait partie de la mise à jour d'un plan de bus.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const DONNEES = resolve(ici, '../../bus-scolaire-beckerich/src/data')
const CIBLE = resolve(ici, '../src/contenu/chiffres.ts')

if (!existsSync(DONNEES)) {
  console.error(
    `Données de l'application introuvables (${DONNEES}).\n` +
      `Le fichier engendré est versionné : la construction reste possible sans lui.`,
  )
  process.exit(0)
}

const lire = (nom) => JSON.parse(readFileSync(resolve(DONNEES, nom), 'utf8'))

const arrets = lire('arrets.json').arrets
const ecoles = lire('ecoles.json')
const plan = lire('plan-2025-2026.json')
const adresses = lire('adresses-beckerich.json')

const chiffres = {
  arrets: arrets.length,
  villages: new Set(arrets.map((a) => a.village)).size,
  sites: ecoles.sites.length,
  cycles: ecoles.cycles.length,
  lignes: plan.lignes.length,
  rues: adresses.rues.length,
  // Les cinq dictionnaires de l'application : fr, de, lb, pt, en.
  langues: 5,
  anneeScolaire: plan.anneeScolaire,
  // Ce qui part de l'appareil vers un serveur. C'est le premier principe du projet,
  // et c'est un chiffre, pas une formule creuse.
  donneesEnvoyees: 0,
}

const sortie = `/*
 * Chiffres de la vitrine — FICHIER ENGENDRÉ, NE PAS MODIFIER À LA MAIN.
 *
 * Source : bus-scolaire-beckerich/src/data/ (arrets, ecoles, plan, adresses).
 * Régénérer :  node scripts/build-chiffres.mjs
 *
 * Aucun de ces nombres n'est estimé. Une page qui annonce un chiffre qu'elle n'a pas
 * compté finit par en annoncer un faux — et l'application, elle, promet de dire ce
 * qu'elle ne sait pas.
 */
export const CHIFFRES = ${JSON.stringify(chiffres, null, 2)} as const

export type Chiffres = typeof CHIFFRES
`

writeFileSync(CIBLE, sortie)
console.log(`Chiffres repris depuis l'application → ${CIBLE}`)
console.log(chiffres)
