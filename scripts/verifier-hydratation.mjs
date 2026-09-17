/*
 * L'hydratation, vérifiée dans un vrai navigateur.
 *
 * Ce script existe pour une raison précise : le passage de React à `preact/compat`
 * (ticket #58) a déplacé le seul endroit du dépôt où le pré-rendu et le navigateur
 * doivent dire exactement la même chose. Or ce qu'on risque là n'est pas une exception
 * dans une console — c'est un bloc qui reste sous l'opacité 0, c'est-à-dire du contenu
 * invisible sur une page qui, pour tous les tests, est parfaitement rendue. Aucune
 * assertion jsdom ne peut le voir : jsdom ne calcule pas de style.
 *
 * Trois choses sont donc relevées sur la page construite, dans l'ordre où elles cassent :
 *
 *   1. AUCUNE ERREUR de console, et aucune divergence d'hydratation signalée ;
 *   2. RIEN D'INVISIBLE une fois la page parcourue de haut en bas — c'est la garantie que
 *      `Revele` a bien reçu son niveau de mouvement ;
 *   3. LES QUATRE NOMBRES de la bande de chiffres arrivés à leur valeur, parce qu'ils sont
 *      le seul contenu que le navigateur ANIME jusqu'à sa valeur finale.
 *
 * Puis deux interactions, qui sont tout ce que la page sait faire : la liste des langues
 * et les deux boutons de thème. Si l'hydratation n'avait pas pris, elles ne feraient rien.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { chromium } from 'playwright'

const DIST = resolve(import.meta.dirname, '..', 'dist')
const PORT = 4183

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

function servir() {
  const serveur = createServer(async (requete, reponse) => {
    const chemin = decodeURIComponent(new URL(requete.url, 'http://x').pathname)
    let fichier = join(DIST, chemin)
    if (!extname(fichier)) fichier = join(fichier, 'index.html')
    try {
      const corps = await readFile(fichier)
      reponse.writeHead(200, { 'content-type': TYPES[extname(fichier)] ?? 'application/octet-stream' })
      reponse.end(corps)
    } catch {
      reponse.writeHead(404).end('introuvable')
    }
  })
  return new Promise((ok) => serveur.listen(PORT, '127.0.0.1', () => ok(serveur)))
}

const echecs = []
function exiger(condition, quoi) {
  if (condition) console.log(`  ok    ${quoi}`)
  else {
    console.log(`  ÉCHEC ${quoi}`)
    echecs.push(quoi)
  }
}

if (!existsSync(join(DIST, 'index.html'))) {
  console.error("dist/index.html est absent. Lancer « npm run build ».")
  process.exit(1)
}

const serveur = await servir()
const navigateur = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] })

try {
  for (const [langue, chemin] of [
    ['fr', '/'],
    ['de', '/de/'],
    ['lb', '/lb/'],
    ['pt', '/pt/'],
    ['en', '/en/'],
  ]) {
    console.log(`\n${langue} — ${chemin}`)
    const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 900 } })
    // Le rideau d'ouverture ne se lève jamais en sans-écran et couvrirait tout le reste.
    await contexte.addInitScript(() =>
      sessionStorage.setItem('vitrine-schoulbus.rideau-vu', '1'),
    )
    const page = await contexte.newPage()

    const plaintes = []
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') plaintes.push(m.text())
    })
    page.on('pageerror', (e) => plaintes.push(String(e)))

    await page.goto(`http://127.0.0.1:${PORT}${chemin}`, { waitUntil: 'networkidle' })

    // La page entière est parcourue : les révélations ne partent qu'à l'entrée en vue.
    await page.evaluate(async () => {
      const pas = window.innerHeight / 2
      for (let y = 0; y < document.body.scrollHeight; y += pas) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 400))
    })

    exiger(plaintes.length === 0, `aucune plainte du navigateur${plaintes.length ? ` — ${plaintes[0]}` : ''}`)

    const invisibles = await page.evaluate(() =>
      [...document.querySelectorAll('main *, header *, footer *')]
        .filter((e) => {
          const style = getComputedStyle(e)
          if (style.display === 'none' || style.visibility === 'hidden') return false
          return Number(style.opacity) < 0.99
        })
        .map((e) => e.className || e.tagName)
        .slice(0, 5),
    )
    exiger(invisibles.length === 0, `rien ne reste invisible${invisibles.length ? ` — ${invisibles.join(', ')}` : ''}`)

    const chiffres = await page.evaluate(() =>
      [...document.querySelectorAll('.chiffre__valeur')].map((e) => e.textContent.trim()),
    )
    exiger(
      chiffres.length === 4 && chiffres.every((c) => /^\d+$/.test(c)),
      `les quatre nombres sont arrivés — ${chiffres.join(' · ')}`,
    )

    const titre = await page.textContent('.heros__titre')
    exiger(Boolean(titre?.trim()), 'le titre du héros est là')

    /*
     * Le thème : un bouton qui ne fait rien est le symptôme d'une hydratation muette.
     * L'attribut est posé par un effet, donc APRÈS le clic d'une image : le relever sans
     * attendre le trouve absent et accuse à tort.
     */
    await page.click('.entete .segments--theme button:nth-child(2)')
    await page
      .waitForFunction(() => document.documentElement.dataset.theme === 'sombre', null, {
        timeout: 2000,
      })
      .catch(() => {})
    const sombre = await page.getAttribute('html', 'data-theme')
    const choisi = await page.getAttribute(
      '.entete .segments--theme button:nth-child(2)',
      'aria-pressed',
    )
    exiger(
      sombre === 'sombre' && choisi === 'true',
      `le bouton de thème répond — data-theme=${sombre}, aria-pressed=${choisi}`,
    )

    await contexte.close()
  }

  // La liste des langues navigue : c'est la seule interaction qui change de page.
  const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 900 } })
  await contexte.addInitScript(() => sessionStorage.setItem('vitrine-schoulbus.rideau-vu', '1'))
  const page = await contexte.newPage()
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
  await page.selectOption('.entete .liste-langue__champ', 'de')
  /*
   * L'ADRESSE ARRIVE AVANT LA LANGUE, et attendre la première pour relever la seconde
   * rendait cette vérification intermittente. Le changement de langue ne recharge pas la
   * page : le chemin est poussé dans l'historique, puis le dictionnaire est allé chercher
   * et l'attribut `lang` posé par un effet. C'est donc `lang` qu'il faut attendre — il
   * arrive après tout le reste.
   */
  await page
    .waitForFunction(() => document.documentElement.lang === 'de', null, { timeout: 5000 })
    .catch(() => {})
  console.log('\nnavigation')
  exiger(page.url().includes('/de'), `la liste des langues emmène à ${new URL(page.url()).pathname}`)
  exiger(
    (await page.getAttribute('html', 'lang')) === 'de',
    `et la langue du document suit — lang=${await page.getAttribute('html', 'lang')}`,
  )
  await page.goto(`http://127.0.0.1:${PORT}/contact/`, { waitUntil: 'networkidle' })
  /*
   * Le formulaire est la seule page où le visiteur ÉCRIT, donc le seul endroit où un champ
   * contrôlé peut refuser la frappe sans que rien d'autre ne bouge. Le message n'est pas
   * envoyé : ce qui est vérifié ici est que ce qui est tapé reste à l'écran.
   */
  await page.fill('#contact-message', 'Deux lignes, pour voir.')
  const tape = await page.inputValue('#contact-message')
  exiger(tape === 'Deux lignes, pour voir.', `le formulaire retient ce qu'on écrit — « ${tape} »`)
  await contexte.close()
} finally {
  await navigateur.close()
  serveur.close()
}

if (echecs.length > 0) {
  console.error(`\n${echecs.length} vérification(s) en échec.`)
  process.exit(1)
}
console.log("\nL'hydratation tient : rien d'invisible, rien de muet.")
