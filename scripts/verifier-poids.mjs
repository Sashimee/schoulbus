/*
 * Le poids du premier écran est une décision, pas une conséquence.
 *
 * La vitrine est entièrement pré-rendue et son interactivité tient en une liste
 * déroulante, deux boutons de thème et des révélations au défilement. Elle expédiait
 * pourtant 103,6 ko de JavaScript comprimé — la moitié du poids du premier écran — sans
 * qu'aucune limite ne le dise. Rien ne pressait à l'affichage (deux requêtes seulement
 * bloquent le premier rendu, le document et la feuille de style) ; ce qui manquait était
 * une limite, et une limite absente ne se voit jamais : elle se constate.
 *
 * Ce script mesure ce que le premier écran demande VRAIMENT, en lisant `dist/index.html`
 * plutôt qu'en additionnant `dist/assets/` : `lenis` et les fonctions de `motion` sont des
 * imports dynamiques, ils ne partent pas avec la page et n'ont pas à peser sur son budget.
 * Le total de `dist/assets/` est mesuré à part, comme plafond de ce qu'une visite entière
 * peut coûter.
 *
 * Lire le document plutôt que le dossier est ce qui rend la mesure juste depuis que les
 * dictionnaires sont découpés par langue : le pré-rendu annonce le morceau de SA langue
 * en `modulepreload`, la page le NOMME donc, et il entre dans le compte. Les quatre autres
 * langues sont dans `dist/assets/` sans être nommées nulle part, et n'y entrent pas.
 *
 * En gzip niveau 9, parce que c'est ce que nginx sert (`gzip_static`, voir `nginx.conf`) —
 * pas la taille sur disque, que personne ne télécharge.
 *
 * S'exécute après `scripts/prerendu.mjs` (voir le script `build`), et seul :
 *
 *     npm run poids
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(ici, '../dist')

/*
 * LES BUDGETS.
 *
 * Ils ENREGISTRENT le poids d'aujourd'hui, ils ne l'approuvent pas. La réserve reste
 * ouverte au README : quatre-vingt-seize kilo-octets pour une page pré-rendue dont
 * l'interactivité tient en une liste déroulante et deux boutons, c'est encore beaucoup. Un
 * budget ne rend pas une page légère ; il empêche qu'elle s'alourdisse sans que personne
 * ne l'ait décidé.
 *
 * LES DEUX CHIFFRES ONT BOUGÉ EN SENS CONTRAIRES le 11 septembre 2026, quand les cinq
 * dictionnaires ont cessé d'être dans le paquet (voir `src/i18n/registre.ts`), et c'est
 * le marché qu'il faut avoir en tête avant de les toucher :
 *
 *  - le PREMIER ÉCRAN tombe de 106,4 à 96,7 ko, parce qu'un lecteur francophone ne
 *    télécharge plus l'allemand, le luxembourgeois, le portugais et l'anglais ;
 *  - TOUT LE SITE monte de 115,7 à 120,8 ko, parce que gzip partageait la structure des
 *    cinq dictionnaires tant qu'ils étaient dans le même fichier : comprimés séparément,
 *    ils passent de ≈ 13,9 à ≈ 18,5 ko. On paie cinq kilo-octets qu'une visite ne
 *    téléchargera jamais pour en économiser dix que toute visite téléchargeait.
 *
 * Le second budget mesure donc désormais un plafond théorique — il faudrait passer par les
 * cinq langues d'affilée pour l'atteindre — et le premier est le seul qui décrive une
 * visite réelle. C'est lui qu'on resserre : sa marge était de 3 %, elle passe à 5 %, ce qui
 * suffit à rattraper une régression qui remettrait les dictionnaires dans le paquet.
 *
 * Les relever est permis. Les relever SANS RIEN DIRE ne l'est pas : la ligne du README qui
 * les cite dit d'où vient le chiffre, et c'est elle qui rend le relèvement visible.
 */
const BUDGETS = {
  'JavaScript du premier écran': 102 * 1024,
  'feuille de style du premier écran': 8 * 1024,
  'JavaScript de tout le site': 128 * 1024,
}

if (!existsSync(resolve(DIST, 'index.html'))) {
  console.error("dist/index.html est absent. Lancer « npm run build ».")
  process.exit(1)
}

const accueil = readFileSync(resolve(DIST, 'index.html'), 'utf8')

/** Le poids d'un fichier de `dist/`, comprimé comme nginx le sert. */
function poids(chemin) {
  return gzipSync(readFileSync(resolve(DIST, chemin)), { level: 9 }).length
}

/** Les ressources que la page NOMME : ce qui part avec elle, imports dynamiques exclus. */
function referencees(html, extension) {
  const trouvees = new Set()
  for (const [, chemin] of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    if (chemin.endsWith(extension)) trouvees.add(chemin.slice(1))
  }
  return [...trouvees]
}

const premierEcranJs = referencees(accueil, '.js')
const premierEcranCss = referencees(accueil, '.css')
const toutLeJs = readdirSync(resolve(DIST, 'assets'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => `assets/${f}`)

const mesures = [
  ['JavaScript du premier écran', premierEcranJs],
  ['feuille de style du premier écran', premierEcranCss],
  ['JavaScript de tout le site', toutLeJs],
]

const ko = (octets) => (octets / 1024).toFixed(1).replace('.', ',')

let depasse = false
console.log('\nPoids servi (gzip -9, comme nginx) :\n')

for (const [quoi, fichiers] of mesures) {
  const total = fichiers.reduce((somme, f) => somme + poids(f), 0)
  const budget = BUDGETS[quoi]
  const marge = Math.round(((budget - total) / budget) * 100)
  const etat = total > budget ? 'TROP' : 'ok  '
  if (total > budget) depasse = true
  console.log(
    `  ${etat}  ${ko(total).padStart(7)} ko / ${ko(budget).padStart(7)} ko  ` +
      `${quoi} (${fichiers.length} fichier${fichiers.length > 1 ? 's' : ''}, ${marge} % de marge)`,
  )
}

console.log('')

if (depasse) {
  console.error(
    'Le budget est dépassé. Deux réponses possibles, et il faut choisir :\n' +
      '  — alléger, en regardant ce qui vient d’entrer dans le paquet ;\n' +
      '  — relever le budget dans ce fichier, ET dire dans le README pourquoi.\n' +
      'Ce qu’il ne faut pas faire est de le relever en silence : le budget cesse alors de\n' +
      'décider quoi que ce soit, il enregistre.',
  )
  process.exit(1)
}

console.log('Le premier écran tient dans son budget.')
