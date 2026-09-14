/*
 * Ce qu'un message doit satisfaire pour partir, et rien d'autre.
 *
 * Séparé de `index.mjs` pour une raison précise : ce fichier-ci n'ouvre aucun port, ne lit
 * aucune variable d'environnement et ne parle à aucun serveur, donc il se teste. Le reste
 * du relais est de la plomberie — écouter, lire un corps, remettre à OVH — et ce sont ces
 * règles-ci qui décident si un formulaire de contact devient un relais de pourriel.
 *
 * AUCUN SERVICE TIERS, et c'est une contrainte du projet et non une préférence : un captcha
 * hébergé ailleurs ferait entrer un tiers dans une page qui n'en a aucun, et briserait la
 * seule promesse qui distingue ce site. Ce qui reste, faute de captcha : un leurre, un
 * délai, des plafonds, un compte de liens, et une limite de débit.
 */

/**
 * LES PLAFONDS.
 *
 * Ils ne protègent aucune base de données — il n'y en a pas. Ils existent pour que ce
 * service ne puisse pas servir à expédier autre chose qu'un message de contact.
 */
export const PLAFONDS = {
  sujet: 120,
  message: 4000,
  /* La longueur maximale d'une adresse de courrier, par la RFC 5321. */
  reponse: 254,
  /* Trois secondes : personne ne remplit trois champs plus vite. */
  delaiMinimal: 3000,
  /* Au-delà, ce n'est plus un signalement d'horaire. */
  liensMaximum: 2,
  /* Par empreinte d'adresse, et par heure. */
  envoisParHeure: 5,
  fenetre: 3600_000,
  /* Un corps plus gros que cela est refusé avant d'être lu en entier. */
  octetsMaximum: 16_384,
}

const LIEN = /https?:\/\/|www\./gi

const texte = (valeur) => (typeof valeur === 'string' ? valeur.trim() : '')

/**
 * Rend le motif du refus, ou `null` si le message peut partir.
 *
 * REFUSER FORT ET DIRE POURQUOI. Un formulaire qui accepte en silence un message qu'il
 * jette est pire que pas de formulaire du tout : le visiteur croit avoir écrit, et
 * personne ne saura jamais qu'il a essayé.
 */
export function motifDeRefus(corps) {
  if (!corps || typeof corps !== 'object') return 'vide'

  /*
   * Le leurre : un champ que la mise en page cache et qu'un humain ne voit donc jamais.
   * Un robot remplit tout ce qu'il trouve, y compris ce qu'il ne devrait pas voir.
   */
  if (texte(corps.site) !== '') return 'leurre'

  const sujet = texte(corps.sujet)
  const message = texte(corps.message)
  const reponse = texte(corps.reponse)

  if (sujet === '' || message === '') return 'vide'
  if (sujet.length > PLAFONDS.sujet) return 'tropLong'
  if (message.length > PLAFONDS.message) return 'tropLong'
  if (reponse.length > PLAFONDS.reponse) return 'tropLong'

  /*
   * Le délai est mesuré par le navigateur, il est donc falsifiable — et c'est dit plutôt
   * que caché. Il arrête les robots qui postent sans ouvrir la page, ce qui est
   * l'essentiel du bruit ; il n'arrête pas quelqu'un qui vise ce site-ci, et il ne
   * prétend pas le faire.
   */
  const duree = Number(corps.duree)
  if (!Number.isFinite(duree) || duree < PLAFONDS.delaiMinimal) return 'tropVite'

  const liens = (`${sujet} ${message}`.match(LIEN) ?? []).length
  if (liens > PLAFONDS.liensMaximum) return 'tropDeLiens'

  return null
}

/**
 * Le compteur de débit, en mémoire.
 *
 * Volontairement sans stockage : le service tourne en un exemplaire, et un redémarrage qui
 * remet les compteurs à zéro est un inconvénient sans gravité — bien moindre que de garder
 * sur disque la liste horodatée des adresses qui ont écrit.
 */
export function creerCompteurDeDebit(maintenant = () => Date.now()) {
  const envois = new Map()

  return {
    /** `true` si cette empreinte a déjà atteint son plafond dans la fenêtre. */
    tropSouvent(empreinte) {
      const t = maintenant()
      const recents = (envois.get(empreinte) ?? []).filter((d) => t - d < PLAFONDS.fenetre)
      if (recents.length >= PLAFONDS.envoisParHeure) {
        envois.set(empreinte, recents)
        return true
      }
      recents.push(t)
      envois.set(empreinte, recents)
      return false
    },
    /** Le ménage : sans lui, la carte grandit tant que le conteneur vit. */
    oublierLesVieux() {
      const t = maintenant()
      for (const [cle, dates] of envois) {
        const recents = dates.filter((d) => t - d < PLAFONDS.fenetre)
        if (recents.length === 0) envois.delete(cle)
        else envois.set(cle, recents)
      }
    },
    get taille() {
      return envois.size
    },
  }
}
