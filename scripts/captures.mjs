/*
 * Photographie l'application, pour de vrai.
 *
 *     node scripts/captures.mjs              (itération locale)
 *     npm run captures                       (dans le conteneur épinglé — le seul qui compte)
 *
 * Quatre écrans × quatre langues × deux thèmes = trente-deux fichiers, engendrés depuis
 * l'application elle-même. Les fichiers sont VERSIONNÉS : la vitrine doit pouvoir se
 * construire seule, sans l'application à côté, exactement comme pour `build-chiffres.mjs`
 * et les vignettes de partage.
 *
 * TROIS RÈGLES, ET LA RAISON DE CHACUNE
 * -------------------------------------
 *
 * 1. On photographie le SERVEUR DE DÉVELOPPEMENT de l'application, en local — jamais le
 *    site publié. Le service worker n'y existe pas, donc aucun actif périmé ne traîne ;
 *    et rien ne dépend du réseau ni d'une perturbation qu'un représentant de l'école
 *    publierait demain matin. La version affichée et la détection de mise à jour sont
 *    toutes deux fixées à la révision réellement photographiée (voir `lancerServeur`).
 *
 * 2. Le foyer de démonstration est posé par le LIEN DE PARTAGE de l'application. C'est une
 *    interface publique, versionnée et testée, dont la relecture des anciens formats est
 *    une garantie explicite (« les liens plus anciens restent lisibles »). Aucune clé de
 *    stockage interne n'est donc recopiée ici — et le jour où le stockage change de forme,
 *    ce script continue de fonctionner.
 *
 * 3. Tout ce qui n'est pas déterministe est neutralisé, et bruyamment. Les tuiles de carte
 *    viennent de fixtures versionnées, et une tuile manquante ARRÊTE la prise au lieu de
 *    produire une carte grise que personne ne remarquera. Une capture silencieusement
 *    dégradée est pire qu'une capture absente : elle a l'air d'aller.
 */
import { spawn } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

import {
  DENSITE,
  ECRANS,
  FOYER_DEMO,
  HAUTEUR,
  INSTANT_DEMO,
  LARGEUR,
  THEMES,
  fichierCapture,
} from '../src/contenu/captures.ts'

const ici = dirname(fileURLToPath(import.meta.url))
// Même variable, même raison que dans `build-chiffres.mjs` : l'intégration continue ne
// sait pas placer deux dépôts côte à côte.
const DEPOT_APP = process.env.DEPOT_APP ?? resolve(ici, '../../bus-scolaire-beckerich')
const SORTIE = resolve(ici, '../public/captures')
const TRAVAIL = resolve(ici, '../public/.captures-en-cours')
const TUILES = resolve(ici, 'fixtures/tuiles')
const PROVENANCE = resolve(ici, 'captures.source.json')

const { LANGUES } = await import('../src/contenu/langues.ts')
/**
 * L'application résout sa langue depuis `navigator.languages` faute de préférence : elle
 * en prend les deux premières lettres. C'est donc le TERRITOIRE qui est libre ici, et la
 * langue qui ne l'est pas.
 *
 * Une entrée manquante vaut `undefined`, que Playwright remplace par sa locale par défaut.
 * La prise ne s'arrête pas : elle produit des captures d'une AUTRE langue, classées sous le
 * nom de celle qu'on croyait photographier. C'est la panne la plus coûteuse de ce script,
 * parce qu'elle a l'air d'aller. D'où le contrôle qui suit, plutôt qu'une confiance.
 */
const ETIQUETTE_LOCALE = { fr: 'fr-LU', de: 'de-LU', lb: 'lb-LU', en: 'en-GB' }
const sansLocale = LANGUES.filter((l) => !ETIQUETTE_LOCALE[l])
if (sansLocale.length > 0) {
  console.error(
    `Aucune locale déclarée pour : ${sansLocale.join(', ')}.\n` +
      `Compléter ETIQUETTE_LOCALE — sans quoi les captures seraient prises dans la langue ` +
      `par défaut du navigateur et enregistrées sous le nom de celles-ci.`,
  )
  process.exit(1)
}
const PORT = Number(process.env.PORT_CAPTURES ?? 5183)
const RAFRAICHIR_TUILES = process.argv.includes('--rafraichir-tuiles')

/** Le poids est une décision, pas une conséquence. Le script la fait respecter. */
const POIDS_FICHIER_MAX = 60 * 1024
/*
 * 1,8 Mo, et non 1,4 : le plafond avait été posé pour vingt-quatre fichiers, et l'anglais
 * en ajoute huit. Ce n'est donc pas la dépense par écran qui a bougé — elle reste d'une
 * quarantaine de kilo-octets —, c'est le nombre d'écrans.
 *
 * Il reste un CHIFFRE ÉCRIT, et non `LANGUES.length × THEMES.length × …` : dérivé, il
 * s'ajusterait tout seul et cesserait de dire quoi que ce soit. On veut qu'une cinquième
 * langue vienne buter ici et oblige à reprendre la décision, plutôt qu'elle n'y entre sans
 * que personne ait à peser ce que la page fait descendre.
 */
const POIDS_TOTAL_MAX = 1.8 * 1024 * 1024
/*
 * 0,68 plutôt que 0,73 : l'écran du plan est un tableau de chiffres sur toute la hauteur,
 * donc l'image la plus dense du lot, et c'est lui qui fixe le point haut. À
 * 0,73 il dépassait le budget de deux kilo-octets ; l'écart ne se voit pas sur du texte
 * rendu à deux fois la densité, le dépassement se serait vu au chargement.
 */
const QUALITE = 0.68

if (!existsSync(DEPOT_APP)) {
  console.error(
    `Application introuvable (${DEPOT_APP}).\n` +
      `Les captures sont versionnées : la construction de la vitrine reste possible sans elles.`,
  )
  process.exit(0)
}
if (!existsSync(resolve(DEPOT_APP, 'node_modules'))) {
  console.error(
    `L'application est là mais ses dépendances ne le sont pas (${DEPOT_APP}/node_modules).\n` +
      `Lancez-y « npm ci ». Les captures versionnées restent utilisables en attendant.`,
  )
  process.exit(0)
}

/* ------------------------------------------------------------------ *
 * Le foyer, dans la forme compacte du lien de partage
 * ------------------------------------------------------------------ */

/*
 * Version 5 du format, construite ici à la main plutôt qu'importée.
 *
 * Importer `encoderFoyer` de l'application entraînerait avec lui ses types, son module de
 * nettoyage et son moteur de plan, lequel charge des JSON — beaucoup de mécanique pour
 * fabriquer un tableau. Or l'application garantit de relire les formats antérieurs jusqu'à
 * la version 1 : un lien de version 5 écrit ici restera lisible même quand elle sera passée
 * à 6. C'est cette garantie, et non un hasard, qui rend le tableau littéral acceptable.
 *
 *   [version, libellé, localité, lat, lon, [ [prénom, cycle, repas, bus, dillendappJusqua,
 *     periscolaireMidi, dillendappDepuis, adresses, periscolaireHorsMidi], … ] ]
 */
const CYCLES = ['precoce', 'c1', 'c2', 'c3', 'c4']
const RIEN_PAR_JOUR = [null, null, null, null, null]

const compact = [
  5,
  FOYER_DEMO.libelle,
  FOYER_DEMO.localite,
  FOYER_DEMO.coord[0],
  FOYER_DEMO.coord[1],
  FOYER_DEMO.enfants.map((e) => [
    e.prenom,
    CYCLES.indexOf(e.cycle),
    // Déjeuner à la maison les cinq jours : c'est le cas courant, et c'est celui qui
    // laisse voir un retour de midi sur la fiche de la semaine.
    'mmmmm',
    'bbbbb',
    RIEN_PAR_JOUR,
    0,
    RIEN_PAR_JOUR,
    null,
    0,
  ]),
]

const CODE_PARTAGE = Buffer.from(JSON.stringify(compact), 'utf8')
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')

/* ------------------------------------------------------------------ *
 * Les libellés de boutons, lus dans l'application
 * ------------------------------------------------------------------ */

/*
 * Deux portes à franchir avant de voir quoi que ce soit : l'avertissement d'indépendance,
 * que l'application impose au premier lancement, et l'offre de reprendre la configuration
 * reçue par lien. On clique les vrais boutons, dans la vraie langue — d'où la lecture des
 * dictionnaires de l'application plutôt qu'une liste de chaînes recopiées ici, qui aurait
 * vieilli à la première reformulation.
 */
function libelles(langue) {
  const chemin = resolve(DEPOT_APP, `src/i18n/${langue}.json`)
  const dico = JSON.parse(readFileSync(chemin, 'utf8'))
  const accepterAvertissement = dico.avertissement?.accepter
  const accepterPartage = dico.partage?.accepter
  if (!accepterAvertissement || !accepterPartage) {
    throw new Error(
      `Libellés introuvables dans ${chemin} (avertissement.accepter, partage.accepter). ` +
        `L'application a dû renommer ses clés : corrigez ce script plutôt que de le contourner.`,
    )
  }
  return { accepterAvertissement, accepterPartage }
}

/* ------------------------------------------------------------------ *
 * Le serveur de développement de l'application
 * ------------------------------------------------------------------ */

/*
 * Le port doit être libre AVANT de lancer quoi que ce soit.
 *
 * Sans ce contrôle, un serveur resté d'une exécution précédente répond à sa place : le
 * nôtre meurt sur `--strictPort` sans bruit (sa sortie est ignorée), et l'on photographie
 * pendant vingt minutes une application lancée avec d'autres variables d'environnement.
 * C'est exactement ce qui est arrivé — les captures portaient « Version dev » alors que
 * la révision était bien passée au serveur qui, lui, n'écoutait rien.
 */
async function portLibre(url) {
  try {
    await fetch(url)
    return false
  } catch {
    return true
  }
}

async function attendre(url, essais = 150) {
  for (let i = 0; i < essais; i++) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {
      /* pas encore debout */
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error(`Le serveur de l'application n'a pas répondu sur ${url}.`)
}

function lancerServeur(revision) {
  const proc = spawn(
    'npm',
    ['run', 'dev', '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    {
      cwd: DEPOT_APP,
      env: {
        ...process.env,
        // `BASE_PATH=/` sert l'application à la racine : les chemins de `ECRANS` restent
        // lisibles, et aucun préfixe ne se glisse dans ce fichier.
        BASE_PATH: '/',
        /*
         * L'application tire sa version de `GITHUB_SHA`, et retombe sur « dev » quand la
         * variable manque. Le pied de page l'affiche : sans cela, les trente-deux
         * captures porteraient la mention « Version dev », qui n'apprend rien à un parent
         * et trahit la façon dont l'image a été faite. On lui donne donc la révision
         * réellement photographiée — la même que celle inscrite dans
         * `captures.source.json`.
         *
         * Cela réveille en échange la détection de nouvelle version, qui dort tant que la
         * version vaut « dev ». Elle est neutralisée juste en dessous, en servant à
         * `version.json` exactement la révision courante : l'écart est nul, donc le
         * bandeau ne peut pas apparaître. Neutralisé par construction, pas par chance.
         */
        GITHUB_SHA: revision,
      },
      stdio: 'ignore',
      // `npm run dev` lance Vite comme processus-fils : tuer npm laisserait Vite orphelin,
      // toujours accroché au port. En groupe détaché, on peut abattre l'arbre entier.
      detached: true,
    },
  )
  return proc
}

/** Abat le serveur ET sa descendance. Voir `detached` ci-dessus. */
function arreterServeur(proc) {
  try {
    process.kill(-proc.pid, 'SIGTERM')
  } catch {
    proc.kill('SIGTERM')
  }
}

/* ------------------------------------------------------------------ *
 * Les tuiles de carte
 * ------------------------------------------------------------------ */

/*
 * La fiche de la semaine dessine le trajet à pied sur une carte OpenStreetMap. C'est le
 * seul élément de l'application qui ait besoin du réseau, et donc le seul qui puisse
 * changer sous nos pieds entre deux prises.
 *
 * Les tuiles sont donc servies depuis des fixtures versionnées. Une tuile manquante fait
 * ÉCHOUER la prise : si le cadrage de la carte change, on veut l'apprendre, pas hériter
 * d'une carte à trous qui passera inaperçue jusqu'à la mise en ligne.
 */
function cheminTuile(url) {
  const m = /\/(\d+)\/(\d+)\/(\d+)(@2x)?\.png/.exec(url)
  if (!m) return null
  return resolve(TUILES, `${m[1]}-${m[2]}-${m[3]}${m[4] ? '@2x' : ''}.png`)
}

async function brancherTuiles(contexte) {
  /*
   * Les manques sont COLLECTÉS, pas levés sur place : une exception jetée dans un
   * gestionnaire de route est avalée par Playwright, qui se contente d'un avertissement
   * et laisse la tuile vide. On saurait donc trop tard, et seulement à l'œil.
   */
  const manquantes = []

  await contexte.route(/tile\.openstreetmap\.org/, async (route) => {
    const url = route.request().url()
    const fichier = cheminTuile(url)
    if (!fichier) return route.abort()

    if (existsSync(fichier)) {
      return route.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(fichier) })
    }
    if (RAFRAICHIR_TUILES) {
      const reponse = await route.fetch()
      const corps = await reponse.body()
      mkdirSync(TUILES, { recursive: true })
      writeFileSync(fichier, corps)
      return route.fulfill({ response: reponse, body: corps })
    }
    manquantes.push(url)
    return route.abort()
  })

  return manquantes
}

/*
 * Les deux fichiers que l'application relit à chaque ouverture, hors du paquet : les
 * perturbations et la surcouche de traductions. Servis vides, pour que les captures ne
 * portent pas l'annulation d'un mardi de septembre 2026 jusqu'à la fin des temps.
 */
async function brancherFichiersVivants(contexte, revision) {
  await contexte.route(/\/(urgences|traductions|version)\.json/, (route) => {
    const url = route.request().url()
    let corps = {}
    if (url.includes('urgences')) corps = { perturbations: [] }
    // Même révision que celle servie : l'application se compare à elle-même et ne peut
    // donc pas annoncer une mise à jour au milieu d'une capture.
    else if (url.includes('version')) corps = { version: revision }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(corps),
    })
  })
}

/*
 * Attendre que la page ait FINI de bouger.
 *
 * Les sélecteurs de `pret` disent qu'un écran a commencé à se remplir ; ils ne disent pas
 * qu'il a fini. L'assistant, en particulier, monte son formulaire puis le remonte une
 * fraction de seconde plus tard — et entre les deux, il existe un instant où la carte est
 * vide. Photographier là donnait un écran au milieu creux, une fois sur trois, dans une
 * langue au hasard.
 *
 * On observe donc les mutations du document et l'on ne déclenche qu'après un silence. Ce
 * n'est pas une temporisation déguisée : une page qui a fini de se construire ne mute
 * plus, et celle qui mute encore n'est pas prête à être photographiée, quel qu'en soit le
 * motif. Le silence exigé vaut pour tous les écrans, présents et à venir.
 */
async function attendreDomStable(page, silenceMs = 400, limiteMs = 15000) {
  await page.evaluate(
    ([silence, limite]) =>
      new Promise((resolve, reject) => {
        let minuteur
        const observateur = new MutationObserver(() => {
          clearTimeout(minuteur)
          minuteur = setTimeout(fini, silence)
        })
        const fini = () => {
          observateur.disconnect()
          clearTimeout(secours)
          resolve()
        }
        const secours = setTimeout(() => {
          observateur.disconnect()
          reject(new Error(`Le document mute encore après ${limite} ms`))
        }, limite)
        observateur.observe(document.body, { childList: true, subtree: true, attributes: true })
        minuteur = setTimeout(fini, silence)
      }),
    [silenceMs, limiteMs],
  )
}

/* ------------------------------------------------------------------ *
 * L'encodage en WebP
 * ------------------------------------------------------------------ */

/*
 * Le même Chromium qui a pris la capture l'encode : pas de dépendance native de plus, et
 * un résultat stable au bit près à l'intérieur du conteneur épinglé — ce qui est toute la
 * condition pour qu'un contrôle de dérive ait un sens.
 */
async function versWebp(page, png) {
  const base64 = png.toString('base64')
  const rendu = await page.evaluate(
    async ([donnees, qualite]) => {
      const reponse = await fetch(`data:image/png;base64,${donnees}`)
      const image = await createImageBitmap(await reponse.blob())
      const toile = new OffscreenCanvas(image.width, image.height)
      toile.getContext('2d').drawImage(image, 0, 0)
      const blob = await toile.convertToBlob({ type: 'image/webp', quality: qualite })
      const tampon = await blob.arrayBuffer()
      return [...new Uint8Array(tampon)]
    },
    [base64, QUALITE],
  )
  return Buffer.from(rendu)
}

/* ------------------------------------------------------------------ *
 * La prise
 * ------------------------------------------------------------------ */

async function prendre(navigateur, langue, theme, base, revision) {
  const contexte = await navigateur.newContext({
    viewport: { width: LARGEUR, height: HAUTEUR },
    deviceScaleFactor: DENSITE,
    colorScheme: theme === 'sombre' ? 'dark' : 'light',
    locale: ETIQUETTE_LOCALE[langue],
    timezoneId: 'Europe/Luxembourg',
    // Coupe aussi les fondus de Leaflet, qui feraient une carte à demi peinte.
    reducedMotion: 'reduce',
  })

  const tuilesManquantes = await brancherTuiles(contexte)
  await brancherFichiersVivants(contexte, revision)

  const page = await contexte.newPage()
  // `setFixedTime` et non `install` : `install` simule aussi les minuteurs, ce qui
  // enrayerait l'ordonnanceur de React et laisserait la carte à moitié dessinée.
  await page.clock.setFixedTime(new Date(INSTANT_DEMO))

  const { accepterAvertissement, accepterPartage } = libelles(langue)

  await page.goto(`${base}/#partage=${CODE_PARTAGE}`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: accepterAvertissement }).click()
  await page.getByRole('button', { name: accepterPartage }).click()

  /*
   * Attendre que le foyer soit VRAIMENT là avant d'aller ailleurs.
   *
   * Sans cette attente, la navigation suivante partait parfois avant que l'application
   * ait fini de poser la configuration reçue, et l'on photographiait un foyer d'un seul
   * enfant au lieu de deux — une fois sur deux environ, sans rien qui le signale. C'est
   * ce qui rendait les captures irreproductibles d'une exécution à l'autre.
   *
   * On attend donc chaque prénom à l'écran : c'est l'application elle-même qui dit
   * qu'elle a terminé, plutôt qu'un délai choisi au jugé.
   */
  /*
   * Attendre l'état FINAL, et non un état qui lui ressemble.
   *
   * Deux tentatives ont échoué avant celle-ci, et elles méritent d'être écrites parce que
   * la panne était la même à chaque fois — une capture d'un foyer d'un seul enfant, une
   * fois sur trois, sans rien qui le signale.
   *
   *   1. Attendre les prénoms : la carte de réception AFFICHE DÉJÀ les deux prénoms avant
   *      qu'aucun ne soit enregistré. L'attente était donc satisfaite trop tôt.
   *   2. Les attendre visibles seulement : même problème, la carte est bien visible.
   *
   * On compte donc les cartes d'enfant sur l'accueil — une par enfant, chacune avec son
   * lien vers la semaine. C'est le seul état qui prouve que la configuration est posée, et
   * il ne dépend d'aucune traduction.
   */
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(
    (attendus) => document.querySelectorAll('a[href*="/enfant/"]').length === attendus,
    FOYER_DEMO.enfants.length,
    { timeout: 15000 },
  )

  const pris = []
  for (const ecran of ECRANS) {
    await page.goto(`${base}${ecran.chemin}`, { waitUntil: 'domcontentloaded' })
    if (ecran.parEnfant) {
      // Autant d'occurrences que d'enfants : voir `parEnfant` dans le manifeste.
      await page.waitForFunction(
        ([selecteur, attendus]) => document.querySelectorAll(selecteur).length >= attendus,
        [ecran.pret, FOYER_DEMO.enfants.length],
        { timeout: 15000 },
      )
    } else {
      await page.locator(ecran.pret).first().waitFor({ state: 'visible', timeout: 15000 })
    }

    // Une carte n'est prête que quand ses tuiles le sont. Leaflet les pose une par une et
    // marque chacune `leaflet-tile-loaded` ; photographier avant, c'est photographier un
    // damier gris. `waitForFunction` plutôt qu'une attente fixe : la durée dépend du
    // nombre de tuiles, et une seconde arbitraire serait tantôt trop, tantôt trop peu.
    if (await page.locator('.leaflet-container').count()) {
      await page.waitForFunction(
        () => {
          const posees = document.querySelectorAll('.leaflet-tile').length
          const chargees = document.querySelectorAll('.leaflet-tile-loaded').length
          return posees > 0 && posees === chargees
        },
        undefined,
        { timeout: 20000 },
      )

      /*
       * Leaflet fait apparaître ses tuiles en fondu, et pilote ce fondu avec `Date.now()`.
       * Or l'horloge est figée : le fondu commence à `opacity: 0` et n'en repart jamais.
       * Les tuiles sont pourtant bien là et bien chargées — mesuré : quatre tuiles,
       * quatre `leaflet-tile-loaded`, quatre opacités à zéro. Sans cette règle, la carte
       * sort uniformément grise, avec les deux épingles et le trait posés sur du vide.
       *
       * On termine donc l'animation à la main. Ce n'est pas un maquillage : rien n'est
       * ajouté ni retiré à ce que l'application dessine, on rend seulement visible ce
       * qu'elle a déjà chargé. L'alternative — laisser courir l'horloge — reprendrait
       * d'une main le déterminisme qu'on vient de poser de l'autre.
       */
      await page.addStyleTag({
        content: '.leaflet-tile { opacity: 1 !important; transition: none !important; }',
      })
    }

    // Une police de repli attrapée au vol donnerait une capture aux mauvaises chasses.
    await page.evaluate(() => document.fonts.ready)
    if (ecran.cadrer) {
      await page.evaluate((selecteur) => {
        const cible = document.querySelector(selecteur)
        if (!cible) throw new Error(`Rien à cadrer pour « ${selecteur} »`)

        // L'application garde son en-tête collé en haut. Cadrer sans en tenir compte
        // glisserait la première ligne du tableau dessous — celle qui porte justement les
        // jours desservis. On mesure l'en-tête au lieu de deviner un décalage : sa hauteur
        // n'est pas la même selon la langue ni selon la largeur.
        const entete = document.querySelector('header')
        const collee =
          entete && ['sticky', 'fixed'].includes(getComputedStyle(entete).position)
            ? entete.getBoundingClientRect().height
            : 0

        // `scrollTo` sur la position absolue, et non `scrollIntoView` : ce dernier a un
        // comportement doux qui, horloge figée, ne s'achèverait jamais — le même piège
        // que le fondu de Leaflet, quelques lignes plus haut.
        window.scrollTo(0, cible.getBoundingClientRect().top + window.scrollY - collee - 12)
      }, ecran.cadrer)
    }

    /*
     * L'assistant place le focus sur son titre à chaque étape — c'est la bonne conduite
     * pour qui navigue au clavier, et cela dessine un cadre autour du titre. Sur une
     * capture, ce cadre se lit comme un défaut de mise en page plutôt que comme l'état
     * transitoire qu'il est. On rend donc le focus au corps du document : l'application
     * n'est pas modifiée, elle est seulement photographiée au repos.
     */
    await page.evaluate(() => document.activeElement?.blur())

    // En dernier, quand tout est en place : on ne déclenche qu'une fois la page immobile.
    await attendreDomStable(page)

    // L'invitation à installer ne peut pas surgir en navigateur sans tête, et le bandeau
    // de version est neutralisé plus haut. On l'affirme plutôt que de l'espérer : une
    // carte modale par-dessus une capture se verrait, mais seulement une fois publiée.
    const modales = await page.locator('dialog[open]').count()
    if (modales > 0) {
      throw new Error(
        `Une carte modale couvre l'écran « ${ecran.nom} » (${langue}/${theme}). ` +
          `Capture refusée : elle aurait montré autre chose que l'application.`,
      )
    }
    if (await page.getByText(/Version dev|version dev/).count()) {
      throw new Error(
        `L'écran « ${ecran.nom} » porte la mention « Version dev » : la révision n'a pas ` +
          `été transmise au serveur de développement.`,
      )
    }

    if (tuilesManquantes.length > 0) {
      throw new Error(
        `Tuiles absentes des fixtures, écran « ${ecran.nom} » (${langue}/${theme}) :\n` +
          `${tuilesManquantes.map((u) => `  ${u}`).join('\n')}\n` +
          `Le cadrage de la carte a changé. Relancez avec --rafraichir-tuiles, puis versionnez ` +
          `scripts/fixtures/tuiles/.`,
      )
    }

    /*
     * Dernier garde-fou, et le plus utile : chaque écran doit porter les prénoms qu'on
     * attend de lui. C'est ce contrôle qui aurait attrapé du premier coup les captures à
     * un seul enfant, au lieu de les laisser filer jusqu'à la comparaison d'octets.
     */
    if (ecran.nom === 'aujourdhui') {
      for (const enfant of FOYER_DEMO.enfants) {
        if (!(await page.getByText(enfant.prenom).filter({ visible: true }).count())) {
          throw new Error(
            `« ${enfant.prenom} » manque à l'écran d'accueil (${langue}/${theme}) : ` +
              `la configuration partagée n'est pas entièrement posée.`,
          )
        }
      }
    }

    const png = await page.screenshot({ type: 'png' })
    const webp = await versWebp(page, png)
    const nom = fichierCapture(ecran.nom, langue, theme).replace(/^captures\//, '')
    writeFileSync(resolve(TRAVAIL, nom), webp)
    pris.push({ nom, poids: webp.length })
  }

  // Les tuiles hors champ peuvent être encore en vol : les détourner après la fermeture
  // du contexte lèverait une erreur qui n'apprend rien sur les captures.
  await contexte.unrouteAll({ behavior: 'ignoreErrors' })
  await contexte.close()
  return pris
}

/* ------------------------------------------------------------------ *
 * Le déroulé
 * ------------------------------------------------------------------ */

/** La révision de l'application photographiée. Elle sert deux fois : à l'affichage dans
 *  le pied de page des captures, et à la provenance versionnée à côté d'elles. */
const revision = await new Promise((res) => {
  const p = spawn('git', ['rev-parse', '--short=7', 'HEAD'], { cwd: DEPOT_APP })
  let sortie = ''
  p.stdout.on('data', (d) => (sortie += d))
  p.on('close', () => res(sortie.trim()))
})
if (!revision) {
  console.error(`Impossible de lire la révision de l'application (${DEPOT_APP}).`)
  process.exit(1)
}

const base = `http://127.0.0.1:${PORT}`
if (!(await portLibre(base))) {
  console.error(
    `Le port ${PORT} est déjà occupé.\n` +
      `Un serveur d'une exécution précédente y répond sans doute encore : arrêtez-le, ` +
      `ou choisissez un autre port avec PORT_CAPTURES.`,
  )
  process.exit(1)
}

const serveur = lancerServeur(revision)
let code = 0

try {
  await attendre(base)

  /*
   * On écrit dans un dossier de travail, et l'on ne remplace les captures versionnées
   * qu'une fois les trente-deux prises et validées. Vider `public/captures` d'emblée
   * faisait qu'une exécution interrompue — tuile manquante, sélecteur qui bouge — laissait
   * le dépôt sans aucune capture, c'est-à-dire dans un état pire que celui d'avant.
   */
  rmSync(TRAVAIL, { recursive: true, force: true })
  mkdirSync(TRAVAIL, { recursive: true })

  const navigateur = await chromium.launch()
  const tous = []
  for (const langue of LANGUES) {
    for (const theme of THEMES) {
      const pris = await prendre(navigateur, langue, theme, base, revision)
      tous.push(...pris)
      console.log(`  ${langue}/${theme} — ${pris.map((p) => p.nom).join(', ')}`)
    }
  }
  await navigateur.close()

  const total = tous.reduce((s, p) => s + p.poids, 0)
  const trop = tous.filter((p) => p.poids > POIDS_FICHIER_MAX)
  if (trop.length > 0) {
    throw new Error(
      `Captures trop lourdes (> ${Math.round(POIDS_FICHIER_MAX / 1024)} ko) :\n` +
        trop.map((p) => `  ${p.nom} — ${Math.round(p.poids / 1024)} ko`).join('\n'),
    )
  }
  if (total > POIDS_TOTAL_MAX) {
    throw new Error(
      `L'ensemble des captures pèse ${Math.round(total / 1024)} ko, au-delà du budget de ` +
        `${Math.round(POIDS_TOTAL_MAX / 1024)} ko.`,
    )
  }

  writeFileSync(
    PROVENANCE,
    `${JSON.stringify(
      {
        $commentaire:
          "Provenance des captures. L'intégration continue extrait l'application à ce " +
          'révision avant de régénérer et de comparer.',
        revisionApplication: revision,
        instantSimule: INSTANT_DEMO,
        largeur: LARGEUR,
        hauteur: HAUTEUR,
        densite: DENSITE,
        playwright: JSON.parse(
          readFileSync(resolve(ici, '../node_modules/playwright/package.json'), 'utf8'),
        ).version,
      },
      null,
      2,
    )}\n`,
  )

  // Tout est pris, pesé et validé : seulement maintenant, les captures versionnées
  // laissent la place aux nouvelles.
  rmSync(SORTIE, { recursive: true, force: true })
  renameSync(TRAVAIL, SORTIE)

  console.log(
    `\n${tous.length} captures — ${Math.round(total / 1024)} ko au total, ` +
      `la plus lourde ${Math.round(Math.max(...tous.map((p) => p.poids)) / 1024)} ko.`,
  )
  console.log(`Application photographiée à la révision ${revision}.`)
} catch (e) {
  console.error(`\n${e.message}`)
  code = 1
} finally {
  arreterServeur(serveur)
  // Le dossier de travail ne survit jamais à l'exécution, réussie ou non.
  rmSync(TRAVAIL, { recursive: true, force: true })
}

if (code === 0) {
  // Un fichier qui traîne dans `public/captures/` sans être au manifeste finirait servi
  // sans jamais être affiché. Le test de rendu le refuse ; autant le dire ici aussi.
  const attendus = new Set(
    LANGUES.flatMap((l) =>
      THEMES.flatMap((t) => ECRANS.map((e) => fichierCapture(e.nom, l, t).replace(/^captures\//, ''))),
    ),
  )
  const orphelins = readdirSync(SORTIE).filter((f) => !attendus.has(f))
  if (orphelins.length > 0) {
    console.error(`Fichiers hors manifeste dans public/captures : ${orphelins.join(', ')}`)
    code = 1
  }
}

process.exit(code)
