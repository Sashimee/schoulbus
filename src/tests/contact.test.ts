/*
 * Le formulaire de contact, par ses deux modules purs.
 *
 * Ce qui se teste ici n'est pas l'apparence du formulaire mais les deux endroits où une
 * erreur ne se verrait pas : l'assemblage de l'adresse `mailto:`, dont le résultat n'est
 * jamais lu par un humain avant d'atteindre le logiciel de courrier, et la validation,
 * qui décide seule de ce qui part.
 *
 * Le cas le plus important est celui de la LONGUEUR. Au-delà d'environ deux mille
 * caractères, un `mailto:` est tronqué par le système, et il l'est en silence : le message
 * part, amputé de sa fin, et personne — ni l'expéditeur, ni le destinataire — ne voit qu'il
 * manque quelque chose.
 */
import { describe, expect, it } from 'vitest'
import { LONGUEUR_MAX_LIEN, lienCourriel, lienTropLong } from '../formulaire/courriel.ts'
import {
  MESSAGE_MAX,
  MESSAGE_MIN,
  NOM_MAX,
  premierFautif,
  valider,
  type Champs,
} from '../formulaire/validation.ts'
import { ADRESSE_CONTACT } from '../config.ts'
import { CONTENUS, LANGUES } from '../i18n/contexte.ts'

const ETIQUETTES = {
  prefixe: '[schoulbus.lu]',
  categorie: 'L’application m’intéresse',
  nom: 'Votre nom',
  courriel: 'Votre adresse électronique',
}

const COMPLET: Champs = {
  categorie: 'interet',
  nom: 'Camille Weber',
  courriel: 'camille@example.lu',
  message: 'J’habite Hovelange et j’ai deux enfants au fondamental. Où en est l’application ?',
}

describe('adresse de courriel', () => {
  it('assemble un mailto avec l’objet et le corps encodés', () => {
    const lien = lienCourriel(COMPLET, ETIQUETTES, ADRESSE_CONTACT)

    expect(lien.startsWith(`mailto:${ADRESSE_CONTACT}?`)).toBe(true)
    expect(lien).toContain(`subject=${encodeURIComponent('[schoulbus.lu] ' + ETIQUETTES.categorie)}`)
    expect(lien).toContain(encodeURIComponent('Camille Weber'))
    expect(lien).toContain(encodeURIComponent('camille@example.lu'))
  })

  it('encode les retours à la ligne en %0D%0A', () => {
    // `%0A` seul se recopie tel quel dans certains logiciels, et le message arrive collé.
    const lien = lienCourriel(COMPLET, ETIQUETTES, ADRESSE_CONTACT)
    expect(lien).toContain('%0D%0A')
    expect(lien).not.toMatch(/[\r\n]/)
  })

  it('échappe ce qui casserait la requête', () => {
    const lien = lienCourriel(
      { ...COMPLET, message: 'Un & un ? deux # trois + quatre = cinq' },
      ETIQUETTES,
      ADRESSE_CONTACT,
    )

    // Un seul `&` non échappé couperait le corps en deux paramètres, et la fin du
    // message disparaîtrait sans trace.
    const corps = lien.split('&body=')[1]
    expect(corps).toBeDefined()
    expect(corps).not.toContain('&')
    expect(decodeURIComponent(corps)).toContain('Un & un ? deux # trois + quatre = cinq')
  })

  it('laisse l’adresse lisible dans l’adresse assemblée', () => {
    // Pas de `%40` : c'est ce que le navigateur montre dans sa barre d'état, là où l'on
    // vérifie où l'on est emmené.
    expect(lienCourriel(COMPLET, ETIQUETTES, ADRESSE_CONTACT)).toContain(ADRESSE_CONTACT)
  })

  it('n’écrit pas de ligne pour un champ vide', () => {
    const lien = lienCourriel(
      { ...COMPLET, nom: '', courriel: '' },
      ETIQUETTES,
      ADRESSE_CONTACT,
    )
    const corps = decodeURIComponent(lien.split('&body=')[1])
    expect(corps).not.toContain(ETIQUETTES.nom)
    expect(corps.startsWith(COMPLET.message)).toBe(true)
  })

  /*
   * Les deux gardes de longueur, et pourquoi il en faut deux.
   *
   * Le pire cas se construit avec les intitulés les plus longs des quatre langues, un nom
   * au maximum et une adresse longue — c'est-à-dire tout ce qui s'ajoute au message sans
   * que la personne qui écrit y puisse quoi que ce soit.
   */
  const plusLongue = LANGUES.flatMap((l) => CONTENUS[l].contact.categories.map((c) => c.texte))
    .concat(LANGUES.map((l) => CONTENUS[l].contact.nomEtiquette))
    .concat(LANGUES.map((l) => CONTENUS[l].contact.courrielEtiquette))
    .reduce((a, b) => (b.length > a.length ? b : a))

  const pireCas = (message: string) =>
    lienCourriel(
      {
        categorie: 'autre',
        nom: 'Wolfgang-Emmanuel'.repeat(NOM_MAX / 17).slice(0, NOM_MAX),
        courriel: `${'a'.repeat(40)}@${'b'.repeat(40)}.lu`,
        message,
      },
      { prefixe: '[schoulbus.lu]', categorie: plusLongue, nom: plusLongue, courriel: plusLongue },
      ADRESSE_CONTACT,
    )

  it('un message ordinaire au plafond reste sous la limite pratique', () => {
    // Du texte comme on en écrit : quelques accents, pas mille. C'est le cas que le
    // plafond en caractères doit couvrir seul, sans l'aide de la seconde garde.
    const ordinaire = 'Le bus de 07:25 à Hovelange ne correspond pas au plan affiché. '
    const lien = pireCas(ordinaire.repeat(50).slice(0, MESSAGE_MAX))

    expect(lien.length).toBeLessThan(2000)
    expect(lienTropLong(lien)).toBe(false)
  })

  /*
   * Le cas que le plafond en caractères ne peut PAS attraper, et la raison d'être de
   * `lienTropLong` : un « é » vaut six caractères une fois encodé. Mille accents
   * respectent `MESSAGE_MAX` et dépassent quand même largement.
   *
   * Ce que ce test fixe, c'est qu'un tel message est REFUSÉ et non tronqué. Un message
   * amputé qui part quand même est le seul échec vraiment grave ici : ni l'expéditeur ni
   * le destinataire ne voient qu'il manque la fin.
   */
  it('un message tout en accents dépasse le plafond, et se fait attraper', () => {
    const lien = pireCas('é'.repeat(MESSAGE_MAX))

    expect(lien.length).toBeGreaterThan(2000)
    expect(lienTropLong(lien)).toBe(true)
  })

  it('la garde laisse passer ce qui tient, et arrête ce qui déborde', () => {
    expect(lienTropLong('mailto:x'.padEnd(LONGUEUR_MAX_LIEN, 'a'))).toBe(false)
    expect(lienTropLong('mailto:x'.padEnd(LONGUEUR_MAX_LIEN + 1, 'a'))).toBe(true)
  })
})

describe('validation du formulaire', () => {
  it('un formulaire complet ne produit aucune erreur', () => {
    expect(valider(COMPLET)).toEqual({})
  })

  it('un nom vide est refusé, et l’espace ne compte pas pour un nom', () => {
    expect(valider({ ...COMPLET, nom: '' }).nom).toBe('requis')
    expect(valider({ ...COMPLET, nom: '   ' }).nom).toBe('requis')
  })

  it('une adresse sans arobase est refusée', () => {
    expect(valider({ ...COMPLET, courriel: 'camille.example.lu' }).courriel).toBe(
      'courrielInvalide',
    )
    expect(valider({ ...COMPLET, courriel: 'camille@example' }).courriel).toBe('courrielInvalide')
  })

  /*
   * Le motif est permissif EXPRÈS. Refuser une adresse valide est le pire résultat
   * possible : la personne n'a aucun moyen de prouver qu'elle a raison, et elle s'en va.
   */
  it('une adresse à sous-domaine, à tiret ou à signe plus est acceptée', () => {
    for (const adresse of [
      'camille+bus@example.lu',
      'camille@mail.example.lu',
      'c-w@ex-ample.lu',
      'camille@example.travel',
    ]) {
      expect(valider({ ...COMPLET, courriel: adresse }).courriel, adresse).toBeUndefined()
    }
  })

  it('un message vide, trop court ou trop long est refusé', () => {
    expect(valider({ ...COMPLET, message: '' }).message).toBe('requis')
    expect(valider({ ...COMPLET, message: 'a'.repeat(MESSAGE_MIN - 1) }).message).toBe('tropCourt')
    expect(valider({ ...COMPLET, message: 'a'.repeat(MESSAGE_MAX + 1) }).message).toBe('tropLong')
  })

  it('le premier champ fautif suit l’ordre de l’écran, pas celui de l’objet', () => {
    // C'est lui qui décide où va le curseur : le désigner dans le désordre porterait la
    // personne au clavier plus bas que le premier champ à reprendre.
    expect(premierFautif(valider({ ...COMPLET, nom: '', message: '' }))).toBe('nom')
    expect(premierFautif(valider({ ...COMPLET, courriel: 'x', message: '' }))).toBe('courriel')
    expect(premierFautif({})).toBeUndefined()
  })

  /*
   * Chaque code rendu par `valider` doit avoir un texte dans les quatre langues. Sans ce
   * test, un code ajouté sans traduction s'afficherait comme `undefined` sous le champ —
   * et seulement pour qui commet précisément cette faute-là.
   */
  it('chaque code d’erreur a un texte dans les quatre langues', () => {
    const codes = [
      valider({ ...COMPLET, nom: '' }).nom,
      valider({ ...COMPLET, courriel: 'x' }).courriel,
      valider({ ...COMPLET, message: 'a' }).message,
      valider({ ...COMPLET, message: 'a'.repeat(MESSAGE_MAX + 1) }).message,
    ]

    for (const langue of LANGUES) {
      for (const code of codes) {
        expect(code).toBeDefined()
        expect(CONTENUS[langue].contact.erreurs[code!].trim(), `${langue}/${code}`).not.toBe('')
      }
    }
  })
})
