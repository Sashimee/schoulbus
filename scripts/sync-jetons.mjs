/*
 * Reprend la couche `tokens` de l'application dans `src/styles/jetons.css`.
 *
 * Pourquoi copier plutôt qu'importer : la vitrine est un projet distinct, déployable
 * seul, et destinée à survivre à un déménagement de l'application. Un `@import` vers
 * `../bus-scolaire-beckerich/` la rendrait incapable de se construire ailleurs.
 *
 * Le prix de la copie est la dérive. Ce script la rend visible :
 *   node scripts/sync-jetons.mjs             reprend la version de l'application
 *   node scripts/sync-jetons.mjs --verifier  échoue si les deux ont divergé
 *
 * Si l'application n'est pas là (vitrine déplacée seule), les deux modes se contentent
 * de le signaler : la copie en place reste valable, elle ne peut simplement plus être
 * confrontée à sa source.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(ici, '../../bus-scolaire-beckerich/src/index.css')
const CIBLE = resolve(ici, '../src/styles/jetons.css')

const ENTETE = `/*
 * Jetons de conception — REPRIS DE L'APPLICATION, NE PAS MODIFIER ICI.
 *
 * Copie conforme de la couche \`tokens\` de bus-scolaire-beckerich/src/index.css.
 * Couleurs, échelle typographique, espacements, rayons, ombres et courbes y sont
 * mesurés : chaque couple encre/fond tient >= 4,58:1 sur les 24 compositions réelles
 * (dégradé + halo + voiles de verre). Éclaircir un voile ici désaccorderait la vitrine
 * de l'application ET casserait ce calcul.
 *
 * Ce que la vitrine ajoute en propre — échelle d'affichage, durées longues, rythme des
 * sections — vit dans \`vitrine.css\`, préfixé \`--vitrine-\`.
 *
 * Reprendre la version de l'application :  npm run jetons:reprendre
 * Vérifier qu'elles n'ont pas divergé :    npm run jetons:verifier
 */
`

/** Extrait le bloc `@layer tokens { … }` en comptant les accolades. */
function extraireCouche(css, nom) {
  const debut = css.indexOf(`@layer ${nom} {`)
  if (debut === -1) throw new Error(`Couche « ${nom} » introuvable dans ${SOURCE}`)

  let profondeur = 0
  for (let i = css.indexOf('{', debut); i < css.length; i++) {
    if (css[i] === '{') profondeur++
    else if (css[i] === '}') {
      profondeur--
      if (profondeur === 0) return css.slice(debut, i + 1)
    }
  }
  throw new Error(`Couche « ${nom} » non refermée dans ${SOURCE}`)
}

const verifier = process.argv.includes('--verifier')

if (!existsSync(SOURCE)) {
  console.log(
    `Application absente (${SOURCE}).\n` +
      `La copie en place reste valable, elle ne peut simplement pas être confrontée à sa source.`,
  )
  process.exit(0)
}

const attendu = ENTETE + extraireCouche(readFileSync(SOURCE, 'utf8'), 'tokens') + '\n'

if (verifier) {
  const actuel = existsSync(CIBLE) ? readFileSync(CIBLE, 'utf8') : ''
  if (actuel !== attendu) {
    console.error(
      'Les jetons de la vitrine ont divergé de ceux de l\'application.\n' +
        'Relire la différence, puis : npm run jetons:reprendre',
    )
    process.exit(1)
  }
  console.log('Jetons conformes à l\'application.')
} else {
  writeFileSync(CIBLE, attendu)
  console.log(`Jetons repris depuis l'application → ${CIBLE}`)
}
