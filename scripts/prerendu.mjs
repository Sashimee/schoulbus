/*
 * Pré-rendu des trois langues en HTML statique.
 *
 *     dist/index.html      français
 *     dist/de/index.html   allemand
 *     dist/lb/index.html   luxembourgeois
 *
 * Pourquoi : la vitrine n'a qu'un rôle, être trouvée et lue. Une coquille vide qui
 * attend JavaScript se référence mal, s'affiche en blanc pendant une seconde sur un
 * réseau lent, et ne dit rien du tout à qui a coupé les scripts. Trois pages complètes
 * coûtent trois secondes de construction et règlent les trois problèmes.
 *
 * L'application, elle, reste une SPA : elle est privée, en `noindex`, et son premier
 * écran dépend de données locales qu'un serveur ne peut pas connaître. Les deux projets
 * n'ont pas le même problème, ils n'ont pas la même réponse.
 *
 * S'exécute après `vite build` et `vite build --ssr` (voir le script `build`).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(ici, '../dist')
const GABARIT = resolve(DIST, 'index.html')
const SERVEUR = resolve(ici, '../dist-ssr/entree-serveur.js')

for (const [quoi, chemin] of [
  ['Le build client', GABARIT],
  ['Le build serveur', SERVEUR],
]) {
  if (!existsSync(chemin)) {
    console.error(`${quoi} est absent (${chemin}). Lancer « npm run build ».`)
    process.exit(1)
  }
}

const { rendre, metadonnees, LANGUES } = await import(pathToFileURL(SERVEUR).href)
const gabarit = readFileSync(GABARIT, 'utf8')

for (const langue of LANGUES) {
  const { html, tete, codeLangue } = rendre(langue)
  const { titre, description } = metadonnees(langue)

  let page = gabarit
    // L'attribut `lang` du document : c'est lui que lit un lecteur d'écran pour choisir
    // sa prononciation, et un moteur pour classer la page.
    .replace('<html lang="fr">', `<html lang="${codeLangue}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${titre}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace('<!--metas-partage-->', tete.trimStart())
    .replace('<!--contenu-vitrine-->', html)

  /*
   * Les chemins des ressources. Vite les a écrits en absolu depuis la racine du site
   * (`/assets/…`), ce qui reste juste dans un sous-dossier de langue — `/de/` n'est pas
   * une autre racine. Rien à réécrire, donc ; ce commentaire existe pour qu'on ne s'en
   * inquiète pas à la relecture.
   */

  if (langue === 'fr') {
    writeFileSync(GABARIT, page)
  } else {
    const dossier = resolve(DIST, langue)
    mkdirSync(dossier, { recursive: true })
    writeFileSync(resolve(dossier, 'index.html'), page)
  }

  const taille = (page.length / 1024).toFixed(1)
  console.log(`  ${langue.padEnd(3)} → ${langue === 'fr' ? 'index.html' : `${langue}/index.html`}  (${taille} Ko)`)
}

/*
 * Le plan du site. Trois adresses, aucune priorité déclarée : elles valent la même
 * chose, et un moteur qui reçoit des priorités inventées les ignore de toute façon.
 */
const origine = (process.env.URL_PUBLIQUE ?? 'https://schoulbus.lu').replace(/\/$/, '')
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...LANGUES.map((l) => {
    const url = l === 'fr' ? `${origine}/` : `${origine}/${l}/`
    const liens = LANGUES.map(
      (autre) =>
        `    <xhtml:link rel="alternate" hreflang="${autre}" href="${
          autre === 'fr' ? `${origine}/` : `${origine}/${autre}/`
        }" />`,
    ).join('\n')
    return `  <url>\n    <loc>${url}</loc>\n${liens}\n  </url>`
  }),
  '</urlset>',
].join('\n')
writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap)

writeFileSync(
  resolve(DIST, 'robots.txt'),
  // La vitrine, contrairement à l'application, est faite pour être indexée.
  `User-agent: *\nAllow: /\n\nSitemap: ${origine}/sitemap.xml\n`,
)

console.log('  sitemap.xml, robots.txt')
