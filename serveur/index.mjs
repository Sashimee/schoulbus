/*
 * Le relais de courriel de la page de contact.
 *
 * Une seule route, `POST /api/contact`, qui remet un message au SMTP authentifié d'OVH.
 * Rien d'autre : pas de base, pas de session, pas de fichier écrit. Le message part, et
 * ce service l'oublie.
 *
 * POURQUOI IL EXISTE. La vitrine est du HTML statique servi par nginx. Un formulaire qui
 * ENVOIE demande donc un point d'entrée, et c'est le seul morceau de tout le projet qui
 * tourne côté serveur.
 *
 * POURQUOI IL PASSE PAR OVH EN AUTHENTIFIÉ, et jamais en direct. Le DNS de `schoulbus.lu`
 * porte `v=spf1 include:mx.ovh.com -all` : un envoi émis par ce conteneur est rejeté.
 * `bas.lu`, d'où part l'expéditeur, porte `~all` — il ne serait donc pas rejeté, mais il
 * ne passerait pas SPF pour autant, il serait toléré. Ce n'est pas la même chose, et c'est
 * exactement le genre de différence qui ne se voit qu'au bout de trois mois, quand les
 * messages commencent à tomber en indésirable. On remet donc au relais d'OVH, qui signe.
 *
 * NE PAS ÉLARGIR LE SPF pour se passer de cette authentification : cela ouvrirait le
 * domaine à l'usurpation pour la commodité d'un formulaire.
 *
 * CE QU'IL NE JOURNALISE PAS : ni le contenu du message, ni l'adresse du visiteur, ni son
 * IP. Un compteur de refus par motif suffit à comprendre ce qui se passe, et c'est tout ce
 * qu'on peut garder sans transformer un formulaire de contact en registre de passage.
 */
import { createServer } from 'node:http'
import { createHash, randomUUID } from 'node:crypto'
import { PLAFONDS, creerCompteurDeDebit, motifDeRefus } from './validation.mjs'
import { createTransport } from 'nodemailer'

const PORT = Number(process.env.PORT ?? 3000)

/*
 * La configuration vient ENTIÈREMENT de l'environnement. Aucune adresse, aucun hôte et
 * surtout aucun mot de passe n'est écrit dans ce dépôt — c'est Dokploy qui les pose.
 *
 * `EXPEDITEUR` est un alias `@bas.lu` de la boîte `@schoulbus.lu` qui s'authentifie :
 * l'expéditeur et le destinataire diffèrent donc, ce qui rend le filtrage et le débogage
 * possibles. Les deux étant identiques, un message perdu ne se distingue pas d'un message
 * jamais parti.
 */
const CONFIG = {
  hote: process.env.SMTP_HOTE,
  port: Number(process.env.SMTP_PORT ?? 587),
  tls: process.env.SMTP_TLS !== 'false',
  utilisateur: process.env.SMTP_UTILISATEUR,
  motDePasse: process.env.SMTP_MOTDEPASSE,
  expediteur: process.env.SMTP_EXPEDITEUR,
  destinataire: process.env.COURRIEL_DESTINATAIRE,
}

/*
 * Échouer au démarrage, et non à la première tentative d'envoi.
 *
 * Une variable oubliée qui ne se voit qu'au moment où un parent écrit est un défaut qui
 * coûte un message réel. Le conteneur refuse de démarrer, Dokploy le déclare en panne, et
 * on l'apprend au déploiement.
 */
const manquantes = Object.entries(CONFIG)
  .filter(([, valeur]) => valeur === undefined || valeur === '')
  .map(([nom]) => nom)
if (manquantes.length > 0) {
  console.error(
    `Configuration incomplète : ${manquantes.join(', ')}. ` +
      'Poser SMTP_HOTE, SMTP_PORT, SMTP_TLS, SMTP_UTILISATEUR, SMTP_MOTDEPASSE, ' +
      'SMTP_EXPEDITEUR et COURRIEL_DESTINATAIRE dans les variables du service.',
  )
  process.exit(1)
}

const facteur = createTransport({
  host: CONFIG.hote,
  port: CONFIG.port,
  secure: CONFIG.port === 465,
  requireTLS: CONFIG.tls,
  auth: { user: CONFIG.utilisateur, pass: CONFIG.motDePasse },
})

/* Ce qui est compté, et rien d'autre. Aucune adresse, aucun contenu, aucun message. */
const refus = { leurre: 0, tropVite: 0, tropLong: 0, tropDeLiens: 0, tropSouvent: 0, vide: 0 }

const debit = creerCompteurDeDebit()
setInterval(() => debit.oublierLesVieux(), PLAFONDS.fenetre).unref()

/** Lit le corps de la requête, en refusant tout de suite ce qui est trop gros. */
async function lireCorps(requete) {
  let octets = 0
  const morceaux = []
  for await (const morceau of requete) {
    octets += morceau.length
    if (octets > PLAFONDS.octetsMaximum) throw new Error('corps trop gros')
    morceaux.push(morceau)
  }
  return JSON.parse(Buffer.concat(morceaux).toString('utf8'))
}

function repondre(reponse, code, charge) {
  const corps = JSON.stringify(charge)
  reponse.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(corps),
    'cache-control': 'no-store',
  })
  reponse.end(corps)
}

/*
 * L'empreinte qui sert au plafond de débit.
 *
 * L'IP est hachée avec un sel tiré au démarrage : deux requêtes de la même adresse
 * tombent sur la même clé tant que le conteneur vit, et l'adresse elle-même n'est jamais
 * en mémoire. Un vidage de la mémoire du processus ne rendrait pas la liste des visiteurs.
 *
 * `x-forwarded-for` N'EST DIGNE DE FOI QUE DERRIÈRE LE PROXY. C'est nginx qui le pose, et
 * ce service n'écoute que sur le réseau interne du conteneur — il n'est jamais joignable
 * directement. Publier son port rendrait le plafond de débit contournable d'un en-tête,
 * et c'est la seule raison pour laquelle `compose.yml` ne l'expose pas.
 */
const sel = randomUUID()
function empreinteDe(requete) {
  const brute =
    requete.headers['x-forwarded-for']?.split(',')[0]?.trim() ??
    requete.socket.remoteAddress ??
    'inconnue'
  return createHash('sha256').update(sel + brute).digest('hex').slice(0, 32)
}

const serveur = createServer(async (requete, reponse) => {
  // La sonde de Dokploy. Sans elle, un conteneur en panne se déclarerait en bonne santé.
  if (requete.method === 'GET' && requete.url === '/sante') {
    return repondre(reponse, 200, { etat: 'ok', refus })
  }

  if (requete.method !== 'POST' || !requete.url?.startsWith('/api/contact')) {
    return repondre(reponse, 404, { erreur: 'route inconnue' })
  }

  let corps
  try {
    corps = await lireCorps(requete)
  } catch {
    return repondre(reponse, 400, { erreur: 'requete-illisible' })
  }

  const empreinte = empreinteDe(requete)
  if (debit.tropSouvent(empreinte)) {
    refus.tropSouvent += 1
    return repondre(reponse, 429, { erreur: 'trop-souvent' })
  }

  const motif = motifDeRefus(corps)
  if (motif) {
    refus[motif] += 1
    return repondre(reponse, 400, { erreur: motif })
  }

  /*
   * L'adresse du visiteur va en `Reply-To`, JAMAIS en `From`.
   *
   * La mettre en `From` serait une usurpation de son domaine, et c'est précisément ce que
   * DMARC existe pour détecter : le message serait rejeté par la moitié des serveurs, ou
   * classé en indésirable par l'autre. `Reply-To` obtient le même confort — on répond
   * d'un clic — sans mentir sur l'émetteur.
   */
  const reponseDemandee = typeof corps.reponse === 'string' ? corps.reponse.trim() : ''

  try {
    await facteur.sendMail({
      from: CONFIG.expediteur,
      to: CONFIG.destinataire,
      subject: `[schoulbus.lu] ${corps.sujet.trim().slice(0, PLAFONDS.sujet)}`,
      text: corps.message.trim(),
      ...(reponseDemandee ? { replyTo: reponseDemandee } : {}),
    })
  } catch (erreur) {
    // Le motif technique va au journal du conteneur, jamais au visiteur : il n'en peut
    // rien, et un message d'erreur de SMTP en dit trop sur le montage.
    console.error('Envoi refusé par le relais :', erreur.message)
    return repondre(reponse, 502, { erreur: 'relais-indisponible' })
  }

  repondre(reponse, 200, { etat: 'envoye' })
})

serveur.listen(PORT, () => {
  console.log(`Relais de contact à l'écoute sur ${PORT}, vers ${CONFIG.destinataire}.`)
})
