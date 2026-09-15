/*
 * Les règles du relais de courriel.
 *
 * Elles sont le seul code de tout le projet qui tourne côté serveur, et le seul endroit où
 * une négligence coûte autre chose qu'un défaut d'affichage : un formulaire ouvert sans
 * plafond est un relais de pourriel avec une jolie mise en page.
 *
 * Ce fichier teste `serveur/validation.mjs`, qui n'ouvre aucun port et ne lit aucune
 * variable d'environnement — c'est précisément pour cela qu'il est séparé de `index.mjs`.
 *
 * Ce qu'il NE teste pas, et qu'il faut donc vérifier à la main au premier déploiement : un
 * envoi réel reçu, en-têtes lus, SPF et DKIM en `pass` et l'alignement DMARC correct. Une
 * remise à OVH ne se simule pas utilement.
 */
import { describe, expect, it } from 'vitest'
import {
  PLAFONDS,
  creerCompteurDeDebit,
  desalignementExpediteur,
  motifDeRefus,
  origineRefusee,
} from '../../serveur/validation.mjs'

/** Un message qui doit passer. Chaque test n'en change qu'une chose. */
const valide = {
  sujet: 'Horaire du 22 septembre',
  message: 'Le bus de 07:25 au Kneppchen est annoncé à 07:45 sur le site.',
  reponse: 'parent@exemple.lu',
  duree: 12_000,
  site: '',
}

describe('Le relais accepte', () => {
  it('un message complet', () => {
    expect(motifDeRefus(valide)).toBeNull()
  })

  /*
   * L'adresse de réponse est FACULTATIVE, et c'est une décision de contenu autant que de
   * code : un formulaire qui exige une adresse pour signaler une faute d'horaire perd le
   * signalement.
   */
  it('un message sans adresse de réponse', () => {
    expect(motifDeRefus({ ...valide, reponse: '' })).toBeNull()
    expect(motifDeRefus({ ...valide, reponse: undefined })).toBeNull()
  })

  it('un message qui cite un lien ou deux', () => {
    const message = 'Vu sur https://kanner.beckerich.lu et sur www.beckerich.lu'
    expect(motifDeRefus({ ...valide, message })).toBeNull()
  })

  it('un message pile aux plafonds', () => {
    expect(motifDeRefus({ ...valide, sujet: 'a'.repeat(PLAFONDS.sujet) })).toBeNull()
    expect(motifDeRefus({ ...valide, message: 'b'.repeat(PLAFONDS.message) })).toBeNull()
    expect(motifDeRefus({ ...valide, duree: PLAFONDS.delaiMinimal })).toBeNull()
  })
})

describe('Le relais refuse, et dit pourquoi', () => {
  /*
   * Le leurre. Un champ que la mise en page cache : un humain ne le voit jamais, un robot
   * remplit tout ce qu'il trouve.
   */
  it('un leurre rempli', () => {
    expect(motifDeRefus({ ...valide, site: 'https://pourriel.exemple' })).toBe('leurre')
  })

  it('un envoi trop rapide pour être humain', () => {
    expect(motifDeRefus({ ...valide, duree: 900 })).toBe('tropVite')
  })

  /*
   * Une durée absente est refusée comme une durée trop courte. C'est le cas d'un robot qui
   * poste sans avoir ouvert la page — donc le cas le plus courant, et il ne doit pas
   * passer au travers parce que le champ manque.
   */
  it('un envoi sans durée du tout', () => {
    expect(motifDeRefus({ ...valide, duree: undefined })).toBe('tropVite')
    expect(motifDeRefus({ ...valide, duree: 'douze' })).toBe('tropVite')
  })

  it('un champ vide', () => {
    expect(motifDeRefus({ ...valide, sujet: '   ' })).toBe('vide')
    expect(motifDeRefus({ ...valide, message: '' })).toBe('vide')
    expect(motifDeRefus(null)).toBe('vide')
    expect(motifDeRefus('bonjour')).toBe('vide')
  })

  it('un dépassement de plafond, sur chacun des trois champs', () => {
    expect(motifDeRefus({ ...valide, sujet: 'a'.repeat(PLAFONDS.sujet + 1) })).toBe('tropLong')
    expect(motifDeRefus({ ...valide, message: 'b'.repeat(PLAFONDS.message + 1) })).toBe('tropLong')
    expect(motifDeRefus({ ...valide, reponse: 'c'.repeat(PLAFONDS.reponse + 1) })).toBe('tropLong')
  })

  it('une enfilade de liens', () => {
    const message = 'https://un.exemple https://deux.exemple https://trois.exemple'
    expect(motifDeRefus({ ...valide, message })).toBe('tropDeLiens')
  })

  /*
   * Les liens comptent sur le sujet ET le message réunis : les répartir entre les deux
   * champs était le contournement évident.
   */
  it('des liens répartis entre le sujet et le message', () => {
    const corps = { ...valide, sujet: 'www.un.exemple www.deux.exemple', message: 'www.trois.exemple' }
    expect(motifDeRefus(corps)).toBe('tropDeLiens')
  })

  /* Le leurre passe AVANT tout le reste : un robot ne doit rien apprendre de ses erreurs. */
  it('le leurre avant les autres motifs', () => {
    expect(motifDeRefus({ site: 'x', sujet: '', message: '', duree: 0 })).toBe('leurre')
  })
})

describe('Le plafond de débit', () => {
  it('laisse passer le quota, puis refuse', () => {
    const debit = creerCompteurDeDebit(() => 1_000_000)
    for (let i = 0; i < PLAFONDS.envoisParHeure; i += 1) {
      expect(debit.tropSouvent('empreinte')).toBe(false)
    }
    expect(debit.tropSouvent('empreinte')).toBe(true)
  })

  it('compte chaque empreinte séparément', () => {
    const debit = creerCompteurDeDebit(() => 1_000_000)
    for (let i = 0; i < PLAFONDS.envoisParHeure; i += 1) debit.tropSouvent('une')
    expect(debit.tropSouvent('une')).toBe(true)
    expect(debit.tropSouvent('autre')).toBe(false)
  })

  it('rouvre après la fenêtre', () => {
    let instant = 1_000_000
    const debit = creerCompteurDeDebit(() => instant)
    for (let i = 0; i < PLAFONDS.envoisParHeure; i += 1) debit.tropSouvent('une')
    expect(debit.tropSouvent('une')).toBe(true)

    instant += PLAFONDS.fenetre + 1
    expect(debit.tropSouvent('une')).toBe(false)
  })

  /*
   * Sans ménage, la carte grandit tant que le conteneur vit. Ce n'est pas une fuite
   * théorique : une empreinte par visiteur, et le conteneur ne redémarre qu'au
   * déploiement suivant.
   */
  it('oublie les empreintes sorties de la fenêtre', () => {
    let instant = 1_000_000
    const debit = creerCompteurDeDebit(() => instant)
    debit.tropSouvent('une')
    debit.tropSouvent('autre')
    expect(debit.taille).toBe(2)

    instant += PLAFONDS.fenetre + 1
    debit.oublierLesVieux()
    expect(debit.taille).toBe(0)
  })
})

/*
 * L'image, et non les règles.
 *
 * Ce bloc existe parce qu'un déploiement a échoué sans que rien ne soit faux dans le code :
 * `index.mjs` importait `./validation.mjs`, et le `Dockerfile` ne copiait que `index.mjs`.
 * L'image se construit très bien — l'erreur n'apparaît qu'au DÉMARRAGE, en boucle de
 * redémarrage, et le formulaire aurait rendu 502 indéfiniment.
 *
 * `npm run verifier` ne construit pas d'image, donc rien n'aurait pu le voir. Ce test lit
 * les deux fichiers et compare : tout import relatif de `index.mjs` doit être copié.
 */
describe("L'image du relais", () => {
  /*
   * `import.meta.glob` et non `node:fs`, pour la raison écrite dans `rendu.test.ts` :
   * `tsconfig.app.json` ne déclare que `vite/client` et `vitest/globals`.
   */
  const FICHIERS = import.meta.glob(['../../serveur/index.mjs', '../../serveur/Dockerfile'], {
    query: '?raw',
    eager: true,
    import: 'default',
  }) as Record<string, string>

  it('copie tous les fichiers que le service importe', () => {
    const source = FICHIERS['../../serveur/index.mjs']
    const dockerfile = FICHIERS['../../serveur/Dockerfile']
    expect(source, 'index.mjs introuvable').toBeTypeOf('string')
    expect(dockerfile, 'Dockerfile introuvable').toBeTypeOf('string')

    const importes = [...source.matchAll(/from\s+'\.\/([^']+)'/g)].map((m) => m[1])
    expect(importes.length).toBeGreaterThan(0)

    const copies = dockerfile
      .split('\n')
      .filter((ligne: string) => ligne.startsWith('COPY'))
      .join(' ')

    for (const fichier of importes) {
      expect(copies, `${fichier} est importé mais jamais copié dans l'image`).toContain(fichier)
    }
  })
})

/*
 * Le défaut que ces tests empêchent de revenir a coûté un message réel : l'expéditeur était
 * `formulaire@bas.lu` pour un compte `admin@schoulbus.lu`, OVH a accepté puis rejeté en
 * 550 5.7.1, et le visiteur avait lu « message envoyé ». Ticket #41.
 */
describe("L'expéditeur et le compte qui s'authentifie", () => {
  it('passent quand ils partagent le domaine, sans être la même adresse', () => {
    expect(desalignementExpediteur('admin@schoulbus.lu', 'formulaire@schoulbus.lu')).toBeNull()
  })

  it('passent quand ils sont la même adresse', () => {
    expect(desalignementExpediteur('admin@schoulbus.lu', 'admin@schoulbus.lu')).toBeNull()
  })

  it('refusent un domaine différent, fût-il un alias autorisé', () => {
    expect(desalignementExpediteur('admin@schoulbus.lu', 'formulaire@bas.lu')).toBe(
      'domainesDifferents',
    )
  })

  it('refusent un sous-domaine, que l’alignement ne couvre pas davantage', () => {
    expect(desalignementExpediteur('admin@schoulbus.lu', 'formulaire@mail.schoulbus.lu')).toBe(
      'domainesDifferents',
    )
  })

  it('ignorent la casse et les espaces, qu’un copier-coller laisse traîner', () => {
    expect(desalignementExpediteur('  Admin@Schoulbus.LU ', 'formulaire@schoulbus.lu')).toBeNull()
  })

  it('refusent une adresse sans domaine, des deux côtés', () => {
    expect(desalignementExpediteur('admin', 'formulaire@schoulbus.lu')).toBe('compteSansDomaine')
    expect(desalignementExpediteur('admin@schoulbus.lu', 'formulaire')).toBe(
      'expediteurSansDomaine',
    )
  })

  it('refusent une valeur absente plutôt que de la tenir pour alignée', () => {
    expect(desalignementExpediteur(undefined, 'formulaire@schoulbus.lu')).toBe('compteSansDomaine')
    expect(desalignementExpediteur('admin@schoulbus.lu', undefined)).toBe('expediteurSansDomaine')
  })
})

describe('Le garde-fou du démarrage', () => {
  const SOURCE = import.meta.glob('../../serveur/index.mjs', {
    query: '?raw',
    eager: true,
    import: 'default',
  }) as Record<string, string>

  it("sort en erreur plutôt que de démarrer sur un expéditeur inexpédiable", () => {
    const source = SOURCE['../../serveur/index.mjs']
    expect(source).toContain('desalignementExpediteur(CONFIG.utilisateur, CONFIG.expediteur)')
    expect(source).toContain('process.exit(1)')
  })
})

/*
 * L'origine déclarée par le navigateur.
 *
 * Ce contrôle est une COUCHE, pas une porte : il ferme le formulaire recopié sur une autre
 * page, et rien d'autre. Les tests disent les deux moitiés — ce qu'il refuse, et ce qu'il
 * laisse passer volontairement — pour qu'un lecteur pressé ne le prenne pas pour une
 * protection contre un client en ligne de commande.
 */
describe("L'origine de la requête", () => {
  const SITE = 'https://www.schoulbus.lu'

  it('laisse passer la page elle-même', () => {
    expect(origineRefusee(SITE, SITE)).toBeNull()
  })

  it('refuse une autre origine, fût-elle un sous-domaine', () => {
    expect(origineRefusee('https://exemple.lu', SITE)).toBe('origine')
    expect(origineRefusee('https://app.schoulbus.lu', SITE)).toBe('origine')
  })

  it('refuse le même hôte en clair : une page en http n’est pas la page servie', () => {
    expect(origineRefusee('http://www.schoulbus.lu', SITE)).toBe('origine')
  })

  it('refuse l’apex, qui ne sert aucune page — il redirige', () => {
    expect(origineRefusee('https://schoulbus.lu', SITE)).toBe('origine')
  })

  /*
   * Une absence est ACCEPTÉE, et c'est délibéré. Un client qui n'est pas un navigateur
   * n'en pose pas ; le refuser casserait `curl` et les tests de fumée sans arrêter
   * personne, puisqu'il suffirait de ne rien envoyer. Le plafond de débit reste dessous.
   */
  it('accepte une origine absente ou vide, plutôt que de mentir sur ce qu’elle prouve', () => {
    expect(origineRefusee(undefined, SITE)).toBeNull()
    expect(origineRefusee('', SITE)).toBeNull()
    expect(origineRefusee('   ', SITE)).toBeNull()
  })

  it('refuse tout dès que l’attendue est absente, plutôt que de tout laisser passer', () => {
    expect(origineRefusee(SITE, undefined)).toBe('origine')
  })
})
