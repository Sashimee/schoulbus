/*
 * Le registre des dictionnaires.
 *
 * Ce qu'il y a à tenir ici tient en deux choses, et elles sont toutes les deux muettes
 * quand elles cassent.
 *
 * D'abord le NOM DE L'EXPORT. `chargerContenu` lit `module[langue]` — `fr.ts` doit donc
 * exporter `fr`, et ainsi des quatre autres. Renommer un export en `contenu` ou en
 * `default` ne fait échouer ni le compilateur ni l'empaqueteur : le registre poserait
 * simplement `undefined`, et la page s'effondrerait à la première lecture.
 *
 * Ensuite L'ÉCHEC À VIDE. Lire un dictionnaire non chargé doit lever, et non rendre une
 * autre langue : une page à moitié traduite ne se voit pas d'ici, elle se voit chez un
 * lecteur. Le test passe par `resetModules` parce que `preparation.ts` remplit le registre
 * pour tout le monde — il lui faut donc une instance neuve, celle du navigateur au
 * démarrage.
 */
import { describe, expect, it, vi } from 'vitest'
import { LANGUES } from '../i18n/contexte.ts'
import { chargerContenu, contenuCharge, enregistrerContenu } from '../i18n/registre.ts'
import { CONTENUS } from '../contenu/tous.ts'

/** Une instance neuve du registre, vide comme au démarrage du navigateur. */
async function registreNeuf() {
  vi.resetModules()
  return await import('../i18n/registre.ts')
}

describe('Le registre des dictionnaires', () => {
  it('charge chaque langue sous le nom que son fichier exporte', async () => {
    for (const langue of LANGUES) {
      const contenu = await chargerContenu(langue)
      expect(contenu).toBeDefined()
      expect(contenu.langue).toBe(langue)
    }
  })

  it('rend exactement le dictionnaire du fichier, et non une copie approchante', async () => {
    for (const langue of LANGUES) {
      expect(await chargerContenu(langue)).toEqual(CONTENUS[langue])
    }
  })

  it('échoue fort quand la langue n’a pas été chargée', async () => {
    const { contenuCharge: lireNeuf } = await registreNeuf()
    expect(() => lireNeuf('lb')).toThrow(/n’est pas chargé|n'est pas chargé/)
  })

  it('rend la lecture synchrone possible une fois la langue chargée', async () => {
    const { chargerContenu: charger, contenuCharge: lire } = await registreNeuf()
    const contenu = await charger('pt')
    expect(lire('pt')).toBe(contenu)
    // Les autres restent absentes : on ne charge que celle de la page.
    expect(() => lire('en')).toThrow()
  })

  it('accepte un dictionnaire posé de l’extérieur, comme le fait le pré-rendu', async () => {
    const { enregistrerContenu: poser, contenuCharge: lire } = await registreNeuf()
    poser('de', CONTENUS.de)
    expect(lire('de')).toBe(CONTENUS.de)
  })
})

describe('La préparation des tests', () => {
  it('a posé les cinq langues, comme le pré-rendu', () => {
    for (const langue of LANGUES) expect(contenuCharge(langue)).toBe(CONTENUS[langue])
  })

  // `enregistrerContenu` est importé pour que ce fichier tienne la trilogie complète du
  // module ; sans cette ligne, la lecture croit qu'il n'en expose que deux tiers.
  it('expose de quoi poser un dictionnaire', () => {
    expect(typeof enregistrerContenu).toBe('function')
  })
})
