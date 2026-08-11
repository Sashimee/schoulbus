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
// Le dépôt de l'application est normalement un frère du nôtre. `DEPOT_APP` existe pour
// l'intégration continue, qui ne sait pas placer deux dépôts côte à côte : elle extrait
// l'application où elle veut et nous dit où. Même variable dans `scripts/captures.mjs`.
const DEPOT_APP = process.env.DEPOT_APP ?? resolve(ici, '../../bus-scolaire-beckerich')
const DONNEES = resolve(DEPOT_APP, 'src/data')
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
  // Le nombre d'adresses embarquées dans l'application. Il étaie deux phrases de la
  // vitrine : la recherche d'adresse est hors ligne, et elle ne connaît que la commune.
  adresses: adresses.adresses.length,
  // Les cinq dictionnaires de l'application : fr, de, lb, pt, en.
  langues: 5,
  // Les années que le plan couvre — au pluriel, parce qu'il en couvre deux. Écrire
  // « 2025/2026 » seul reviendrait à annoncer périmé un plan qui ne l'est pas.
  anneesCouvertes: plan.anneesCouvertes,
  valideAu: plan.valideAu,
  // La commune a confirmé par téléphone que le plan ne changeait pas pour 2026/2027.
  // Une confirmation orale n'est pas un document : la vitrine le dit dans ses limites,
  // et ce booléen est ce qui l'y oblige.
  confirmationOrale: plan.source.confirmationOrale === true,
  // Ce qui part de l'appareil vers un serveur — DES DONNÉES DE LA FAMILLE, et de celles-là
  // seulement. Le cadrage n'est pas une précaution de langage : deux choses sortent bel et
  // bien de l'appareil, et la vitrine les nomme (`chiffres.envoiNote`, et une limite
  // entière). Élargir ce chiffre à « rien ne sort » serait faux ; le lecteur qui voudrait
  // le faire trouvera les deux exceptions dans `src/tests/contenu.test.ts`.
  donneesFamilleEnvoyees: 0,
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
