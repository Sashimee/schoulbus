/*
 * Le type `Contenu` garantit qu'aucune clé ne manque. Il ne garantit pas qu'une clé
 * contienne autre chose qu'une chaîne vide, ni que les trois langues aient le même
 * nombre de tuiles — deux erreurs qui passent la compilation et cassent la page.
 *
 * Il ne teste pas la QUALITÉ des traductions : aucun test ne le peut. La réserve sur la
 * relecture du luxembourgeois par une personne dont c'est la langue reste entière (voir
 * l'en-tête de `lb.ts`).
 */
import { describe, expect, it } from 'vitest'
import { CONTENUS, LANGUES, cheminLangue, langueDuChemin } from '../i18n/contexte.ts'
import { ECRANS } from '../contenu/ecrans.ts'
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

  it('les trois langues ont le même nombre de tuiles, de temps et de points', () => {
    const formes = LANGUES.map((l) => ({
      tuiles: CONTENUS[l].fonctions.tuiles.length,
      temps: CONTENUS[l].recit.temps.length,
      points: CONTENUS[l].confidentialite.points.length,
      limites: CONTENUS[l].limites.items.length,
      horsligne: CONTENUS[l].horsligne.points.length,
      mots: CONTENUS[l].langues.mots.length,
    }))
    // Une tuile oubliée dans une traduction produit une grille bancale, pas une erreur.
    expect(new Set(formes.map((f) => JSON.stringify(f))).size).toBe(1)
  })

  it('les icônes des tuiles sont les mêmes dans les trois langues', () => {
    // L'icône est une donnée de mise en page, pas une traduction : elle doit être
    // identique partout, sinon la même fonction change de dessin selon la langue.
    const suites = LANGUES.map((l) => CONTENUS[l].fonctions.tuiles.map((t) => t.icone).join(','))
    expect(new Set(suites).size).toBe(1)
  })

  it('chaque langue annonce son propre code', () => {
    for (const l of LANGUES) {
      expect(CONTENUS[l].langue).toBe(l)
      expect(CONTENUS[l].codeLangue).toBe(l)
    }
  })

  it('les écrans de la maquette existent dans les trois langues', () => {
    for (const l of LANGUES) {
      expect(ECRANS[l].jours).toHaveLength(5)
      expect(ECRANS[l].marque.length).toBeGreaterThan(0)
    }
  })
})

describe('adresses des langues', () => {
  it('le français est à la racine, les autres sous leur code', () => {
    expect(cheminLangue('fr')).toBe('/')
    expect(cheminLangue('de')).toBe('/de/')
    expect(cheminLangue('lb')).toBe('/lb/')
  })

  it('retrouve la langue depuis le chemin, et retombe sur le français', () => {
    expect(langueDuChemin('/')).toBe('fr')
    expect(langueDuChemin('/de/')).toBe('de')
    expect(langueDuChemin('/lb/')).toBe('lb')
    // Une adresse inconnue doit montrer la page, pas une erreur.
    expect(langueDuChemin('/pt/')).toBe('fr')
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
    expect(CHIFFRES.lignes).toBeGreaterThan(0)
    expect(CHIFFRES.langues).toBe(5)
    // Le seul zéro voulu de tout le projet.
    expect(CHIFFRES.donneesEnvoyees).toBe(0)
  })

  it('ne compte pas plus de villages que d’arrêts', () => {
    expect(CHIFFRES.villages).toBeLessThanOrEqual(CHIFFRES.arrets)
  })
})
