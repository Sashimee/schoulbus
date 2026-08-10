/*
 * Engendre le QR code vers l'application, en SVG, une fois pour toutes.
 *
 *     node scripts/build-qr.mjs
 *
 * Pourquoi à la construction et non dans le navigateur : ce code ne dépend que de
 * `URL_APP`, il ne change donc jamais entre deux déploiements. L'engendrer à l'ouverture
 * ferait télécharger une bibliothèque entière à chaque visiteur pour redessiner à
 * l'identique une image de deux kilo-octets.
 *
 * En SVG et non en PNG : il reste net à toute taille et sur tout écran, et il pèse moins.
 * Les couleurs sont fixes — un QR se lit par son contraste, et le poser sur une surface
 * de verre translucide le rendrait illisible pour la moitié des appareils photo. C'est
 * pourquoi `.qr` lui donne un fond blanc franc dans les deux thèmes.
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const ici = dirname(fileURLToPath(import.meta.url))
const CIBLE = resolve(ici, '../public/qr-application.svg')

// Lu depuis `config.ts` plutôt que recopié : une adresse écrite à deux endroits finit
// par diverger, et un QR qui mène à l'ancienne adresse est pire que pas de QR du tout.
const config = readFileSync(resolve(ici, '../src/config.ts'), 'utf8')
const trouve = config.match(/export const URL_APP = '([^']+)'/)
if (!trouve) {
  console.error('URL_APP introuvable dans src/config.ts')
  process.exit(1)
}
const url = trouve[1]

const svg = await QRCode.toString(url, {
  type: 'svg',
  // `M` corrige environ 15 % du code. Assez pour un écran sale ou une photo de biais,
  // sans densifier la trame au point de gêner un appareil photo d'entrée de gamme.
  errorCorrectionLevel: 'M',
  margin: 1,
  color: { dark: '#0e1a2e', light: '#ffffff' },
})

writeFileSync(CIBLE, svg)
console.log(`QR vers ${url} → ${CIBLE}`)
