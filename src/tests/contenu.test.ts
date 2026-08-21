/*
 * Le type `Contenu` garantit qu'aucune clé ne manque. Il ne garantit pas qu'une clé
 * contienne autre chose qu'une chaîne vide, ni que les cinq langues aient le même
 * nombre de tuiles — deux erreurs qui passent la compilation et cassent la page.
 *
 * Il ne teste pas la QUALITÉ des traductions : aucun test ne le peut. Les réserves sur la
 * relecture du luxembourgeois et du portugais par une personne dont c'est la langue
 * restent entières (voir l'en-tête de `lb.ts` et de `pt.ts`).
 */
import { describe, expect, it } from 'vitest'
import { CONTENUS, LANGUES, cheminLangue, langueDuChemin } from '../i18n/contexte.ts'
import { ECRANS } from '../contenu/captures.ts'
import { CHIFFRES } from '../contenu/chiffres.ts'

/** Parcourt récursivement un objet et rend les chaînes qu'il contient, avec leur chemin. */
function chaines(valeur: unknown, chemin = ''): [string, string][] {
  if (typeof valeur === 'string') return [[chemin, valeur]]
  if (Array.isArray(valeur)) return valeur.flatMap((v, i) => chaines(v, `${chemin}[${i}]`))
  if (valeur && typeof valeur === 'object') {
    return Object.entries(valeur).flatMap(([c, v]) => chaines(v, chemin ? `${chemin}.${c}` : c))
  }
  return []
}

describe('contenu', () => {
  it.each(LANGUES)('%s : aucune chaîne vide', (langue) => {
    const vides = chaines(CONTENUS[langue])
      .filter(([, v]) => v.trim() === '')
      .map(([c]) => c)
    expect(vides).toEqual([])
  })

  it('les cinq langues ont le même nombre de tuiles, d’écrans, de points et de limites', () => {
    const formes = LANGUES.map((l) => ({
      tuiles: CONTENUS[l].fonctions.tuiles.length,
      ecrans: CONTENUS[l].ecrans.cartes.length,
      lignesHeros: CONTENUS[l].heros.lignes.length,
      limites: CONTENUS[l].limites.items.length,
      horsLigne: CONTENUS[l].principes.horsLigne.points.length,
      titre: CONTENUS[l].heros.titre.length,
    }))
    // Une tuile oubliée dans une traduction produit une grille bancale, pas une erreur.
    expect(new Set(formes.map((f) => JSON.stringify(f))).size).toBe(1)
  })

  it('les icônes des tuiles sont les mêmes dans les cinq langues', () => {
    // L'icône est une donnée de mise en page, pas une traduction : elle doit être
    // identique partout, sinon la même fonction change de dessin selon la langue.
    const suites = LANGUES.map((l) => CONTENUS[l].fonctions.tuiles.map((t) => t.icone).join(','))
    expect(new Set(suites).size).toBe(1)
  })

  it('la tuile en corail est la même dans les cinq langues', () => {
    /*
     * `ton: 'alerte'` colore l'icône des perturbations. La couleur vit dans la donnée et
     * non dans un `nth-child`, précisément pour qu'elle suive la tuile quand on la
     * déplace — ce test vérifie que le déplacement a bien été fait dans les cinq
     * fichiers, et pas dans un seul.
     */
    const suites = LANGUES.map((l) =>
      CONTENUS[l].fonctions.tuiles.map((t) => t.ton ?? '-').join(','),
    )
    expect(new Set(suites).size).toBe(1)
    // Et il n'y en a qu'une : le corail cesse de signaler s'il signale partout.
    for (const l of LANGUES) {
      expect(CONTENUS[l].fonctions.tuiles.filter((t) => t.ton === 'alerte')).toHaveLength(1)
    }
  })

  it('une seule ligne du héros porte le décompte', () => {
    // Même raison que pour la tuile en corail : c'est le seul élément coloré du héros,
    // et il désigne le temps qui presse.
    for (const l of LANGUES) {
      expect(CONTENUS[l].heros.lignes.filter((ligne) => ligne.compte)).toHaveLength(1)
    }
  })

  it('une seule puce de nuance dans la carte « à l’arrêt »', () => {
    /*
     * La puce ambre porte la restriction — la carte du trajet à pied a encore besoin du
     * réseau. Si une traduction la perd, la carte promet un « tout hors ligne » que la
     * fiche de la semaine dément dès qu'on l'ouvre sans réseau.
     */
    for (const l of LANGUES) {
      expect(
        CONTENUS[l].principes.horsLigne.points.filter((p) => p.ton === 'nuance'),
      ).toHaveLength(1)
    }
  })

  it('il y a autant de légendes d’écran que d’écrans photographiés', () => {
    /*
     * `Ecrans.tsx` apparie `ECRANS` à `contenu.ecrans.cartes` PAR POSITION. Rien ne peut
     * vérifier qu'une légende décrit bien son écran, mais une longueur qui diverge
     * produirait une carte sans légende — et, en TypeScript, un accès `undefined` au
     * rendu.
     */
    for (const l of LANGUES) {
      expect(CONTENUS[l].ecrans.cartes).toHaveLength(ECRANS.length)
    }
  })

  it('les limites sont trois ou six, jamais quatre ni cinq', () => {
    /*
     * `.limites__liste` pose trois colonnes. Trois ou six items remplissent leurs
     * rangées ; quatre ou cinq laissent un trou qui se lit comme un oubli — et cet
     * oubli-là, sur cette section-là, se lit comme une limite qu'on aurait retirée.
     */
    for (const l of LANGUES) {
      expect([3, 6]).toContain(CONTENUS[l].limites.items.length)
    }
  })

  it('le titre du héros tient dans la vignette de partage', () => {
    /*
     * `heros.titre` est dessiné à 76 px sur 1200 px de large par
     * `scripts/build-partage.mjs`. Au-delà de 24 signes, la ligne déborde de la vignette
     * — et la vignette est ce qu'un groupe de parents voit AVANT d'ouvrir le lien.
     *
     * Le test ne peut pas vérifier que `npm run assets:partage` a été relancé ; il
     * vérifie seulement que le texte reste dessinable.
     */
    for (const l of LANGUES) {
      for (const ligne of CONTENUS[l].heros.titre) {
        expect(ligne.length).toBeLessThanOrEqual(24)
      }
    }
  })

  it('chaque langue annonce son propre code', () => {
    for (const l of LANGUES) {
      expect(CONTENUS[l].langue).toBe(l)
      expect(CONTENUS[l].codeLangue).toBe(l)
    }
  })
})

describe('adresses des langues', () => {
  it('le français est à la racine, les autres sous leur code', () => {
    expect(cheminLangue('fr')).toBe('/')
    expect(cheminLangue('de')).toBe('/de/')
    expect(cheminLangue('lb')).toBe('/lb/')
    expect(cheminLangue('pt')).toBe('/pt/')
    expect(cheminLangue('en')).toBe('/en/')
  })

  it('retrouve la langue depuis le chemin, et retombe sur le français', () => {
    expect(langueDuChemin('/')).toBe('fr')
    expect(langueDuChemin('/de/')).toBe('de')
    expect(langueDuChemin('/lb/')).toBe('lb')
    expect(langueDuChemin('/pt/')).toBe('pt')
    expect(langueDuChemin('/en/')).toBe('en')
    // Une adresse inconnue doit montrer la page, pas une erreur.
    expect(langueDuChemin('/es/')).toBe('fr')
    expect(langueDuChemin('/nimporte/quoi')).toBe('fr')
  })
})

describe('chiffres', () => {
  it('sont comptés, pas inventés', () => {
    // Les valeurs viennent des données de l'application ; ce test vérifie seulement
    // qu'aucune n'est retombée à zéro par un script cassé — sauf celle qui doit l'être.
    expect(CHIFFRES.arrets).toBeGreaterThan(0)
    expect(CHIFFRES.villages).toBeGreaterThan(0)
    expect(CHIFFRES.rues).toBeGreaterThan(0)
    expect(CHIFFRES.adresses).toBeGreaterThan(0)
    expect(CHIFFRES.lignes).toBeGreaterThan(0)
    expect(CHIFFRES.langues).toBe(5)
  })

  it('la vitrine parle autant de langues qu’elle en annonce', () => {
    /*
     * La bande de chiffres affiche « 5 langues, dont le luxembourgeois ». Tant que la
     * vitrine n'en parlait que trois, elle se contredisait à voix haute — et devant les
     * deux familles qui avaient le plus besoin d'être lues. Ce test lie les deux : ajouter
     * une langue à l'application sans l'ajouter ici échoue, et réciproquement.
     */
    expect(LANGUES).toHaveLength(CHIFFRES.langues)
  })

  it('rien de la famille ne part vers un serveur — et deux choses en partent quand même', () => {
    expect(CHIFFRES.donneesFamilleEnvoyees).toBe(0)

    // Ce zéro est CADRÉ, et le cadre est la partie qui compte. Il porte sur ce que la
    // famille saisit : adresse, prénoms, cycles, jours dérogatoires. Rien de cela ne
    // quitte l'appareil, et le code n'a nulle part où l'envoyer.
    //
    // Deux choses sortent malgré tout, et la page les nomme :
    //   1. l'application compte ses pages vues (GoatCounter) ;
    //   2. activer les notifications enregistre un identifiant d'appareil anonyme sur un
    //      serveur, le temps de l'abonnement, et il est supprimé au désabonnement.
    //
    // D'où ce test : il exige que les deux exceptions soient déclarées, dans les cinq
    // langues, plutôt que de laisser le zéro se relire un jour comme « rien ne sort ».
    //
    // LA MAQUETTE DE LA REFONTE AVAIT PERDU CETTE NOTE, et ce test l'aurait rattrapée.
    for (const l of LANGUES) {
      expect(CONTENUS[l].chiffres.envoiNote.trim().length).toBeGreaterThan(0)
    }
  })

  it('annonce les années que le plan couvre, au pluriel s’il le faut', () => {
    // Le plan 2025/2026 vaut aussi pour 2026/2027. Afficher une seule année annoncerait
    // périmé un plan qui ne l'est pas.
    expect(CHIFFRES.anneesCouvertes.length).toBeGreaterThan(0)
    for (const annee of CHIFFRES.anneesCouvertes) {
      expect(annee).toMatch(/^\d{4}\/\d{4}$/)
    }
  })

  it('ne compte pas plus de villages que d’arrêts', () => {
    expect(CHIFFRES.villages).toBeLessThanOrEqual(CHIFFRES.arrets)
  })
})
