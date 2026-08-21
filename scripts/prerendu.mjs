/*
 * Pré-rendu des cinq langues en HTML statique.
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
import { execFileSync } from 'node:child_process'
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

const { rendre, metadonnees, LANGUES, PAGES } = await import(pathToFileURL(SERVEUR).href)
const gabarit = readFileSync(GABARIT, 'utf8')

/** Le dossier d'une page dans une langue, relatif à `dist/`. '' pour l'accueil français. */
function dossier(langue, page) {
  const bouts = []
  if (langue !== 'fr') bouts.push(langue)
  if (page !== 'accueil') bouts.push(page)
  return bouts.join('/')
}

for (const langue of LANGUES) {
  for (const page of PAGES) {
    const { html, tete, codeLangue } = rendre(langue, page)
    const { titre, description } = metadonnees(langue, page)

    const sortie = gabarit
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
     * (`/assets/…`), ce qui reste juste dans un sous-dossier — `/de/mentions/` n'est pas
     * une autre racine. Rien à réécrire, donc ; ce commentaire existe pour qu'on ne s'en
     * inquiète pas à la relecture.
     */

    const sousDossier = dossier(langue, page)
    const cible = sousDossier ? resolve(DIST, sousDossier, 'index.html') : GABARIT
    if (sousDossier) mkdirSync(resolve(DIST, sousDossier), { recursive: true })
    writeFileSync(cible, sortie)

    const taille = (sortie.length / 1024).toFixed(1)
    const nom = sousDossier ? `${sousDossier}/index.html` : 'index.html'
    console.log(`  ${langue.padEnd(3)} ${page.padEnd(9)} → ${nom.padEnd(24)} (${taille} Ko)`)
  }
}

/*
 * La date du contenu, pour `lastmod`.
 *
 * Surtout PAS la date de construction. Elle changerait à chaque déploiement sans qu'une
 * ligne de la page ait bougé ; un moteur qui reçoit un `lastmod` toujours égal à
 * « maintenant » cesse d'en tenir compte, et on aurait alors payé une balise pour la
 * rendre inutile. C'est le même raisonnement qui fait qu'on ne déclare aucune priorité
 * plus bas.
 *
 * On prend donc la date du dernier commit qui a touché le contenu. Si elle n'est pas
 * connaissable — construction dans un conteneur, où le dépôt n'est pas copié — on passe
 * la date par `DATE_CONTENU`, et à défaut on n'écrit pas de `lastmod` du tout. Une balise
 * absente est lue correctement ; une balise fausse, non.
 */
function dateDuContenu() {
  if (process.env.DATE_CONTENU) return process.env.DATE_CONTENU

  try {
    const sortie = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', 'src', 'index.html', 'public'],
      { cwd: resolve(ici, '..'), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim()
    // `%cs` rend déjà AAAA-MM-JJ, le format court que la spécification accepte.
    return /^\d{4}-\d{2}-\d{2}$/.test(sortie) ? sortie : null
  } catch {
    return null
  }
}

/*
 * Le plan du site. Trois adresses, aucune priorité déclarée : elles valent la même
 * chose, et un moteur qui reçoit des priorités inventées les ignore de toute façon.
 */
const origine = (process.env.URL_PUBLIQUE ?? 'https://schoulbus.lu').replace(/\/$/, '')
const modifie = dateDuContenu()
/** L'adresse publique d'une page, dans une langue. Même règle que `dossier`. */
const adresse = (langue, page) => {
  const d = dossier(langue, page)
  return d ? `${origine}/${d}/` : `${origine}/`
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  // Dix adresses : deux pages dans cinq langues. Les alternatives d'une entrée pointent
  // la MÊME page dans les autres langues, jamais l'accueil.
  ...PAGES.flatMap((page) =>
    LANGUES.map((l) => {
      const liens = LANGUES.map(
        (autre) =>
          `    <xhtml:link rel="alternate" hreflang="${autre}" href="${adresse(autre, page)}" />`,
      ).join('\n')
      const date = modifie ? `\n    <lastmod>${modifie}</lastmod>` : ''
      return `  <url>\n    <loc>${adresse(l, page)}</loc>${date}\n${liens}\n  </url>`
    }),
  ),
  '</urlset>',
].join('\n')
writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap)

writeFileSync(
  resolve(DIST, 'robots.txt'),
  // La vitrine, contrairement à l'application, est faite pour être indexée.
  `User-agent: *\nAllow: /\n\nSitemap: ${origine}/sitemap.xml\n`,
)

console.log('  sitemap.xml, robots.txt')
