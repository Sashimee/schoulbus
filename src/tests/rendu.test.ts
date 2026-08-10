/*
 * Ce que le pré-rendu écrit dans l'en-tête.
 *
 * Ces tests existent parce que deux fautes ont survécu à toutes les relectures, et pour
 * la même raison : elles ne se voyaient pas là où on regardait.
 *
 * - `og:image` désignait `partage.png`, un fichier que rien n'engendrait. La page
 *   s'ouvrait parfaitement ; seule la vignette d'un lien partagé était vide — c'est-à-dire
 *   la seule chose que voit un groupe de parents avant de décider d'ouvrir le lien.
 * - Le QR partait d'un chemin relatif. Il s'affichait à la racine, donc en français, donc
 *   dans la langue où on relisait la page ; il manquait sur `/de/` et sur `/lb/`.
 *
 * D'où la règle des deux : on vérifie que la balise pointe un fichier QUI EXISTE, et
 * qu'aucune adresse ne dépend du dossier depuis lequel la page est servie.
 */
import { describe, expect, it } from 'vitest'
import { rendre } from '../entree-serveur.ts'
import { LANGUES, PAGES, cheminPage } from '../i18n/contexte.ts'
import { imagePartage, mentionsPretes } from '../config.ts'

/*
 * Le contenu de `public/`, relevé par Vite à la transformation.
 *
 * `import.meta.glob` plutôt que `node:fs` : `tsconfig.app.json` ne déclare que les types
 * du navigateur, et c'est délibéré — y ajouter ceux de Node ouvrirait `fs` à toute
 * composante. Le verre est ici à moitié plein : ce qui n'a pas de fichier n'a pas de clé.
 */
const FICHIERS = new Set(
  Object.keys(import.meta.glob('../../public/*', { eager: false })).map((c) => c.split('/').pop()),
)

describe('pré-rendu', () => {
  it.each(LANGUES)('%s : aucune adresse relative au dossier courant', (langue) => {
    const { html } = rendre(langue)
    // `./quelque-chose` se résout dans `/de/` ou `/lb/`, où rien n'est déposé.
    const relatives = [...html.matchAll(/(?:src|href)="(\.\/[^"]*)"/g)].map((m) => m[1])
    expect(relatives).toEqual([])
  })

  it.each(LANGUES)('%s : la vignette annoncée existe sur le disque', (langue) => {
    const { tete } = rendre(langue)
    const nom = imagePartage(langue)

    expect(tete).toContain(`/${nom}"`)
    expect(FICHIERS).toContain(nom)
  })

  it('les icônes matricielles existent', () => {
    // Annoncées par `index.html`, qui n'est pas typé et ne casse donc rien s'il ment.
    expect(FICHIERS).toContain('apple-touch-icon.png')
    expect(FICHIERS).toContain('favicon-32.png')
    expect(FICHIERS).toContain('qr-application.svg')
  })

  it.each(LANGUES)('%s : le balisage structuré est du JSON valide', (langue) => {
    const { tete } = rendre(langue)
    const trouve = tete.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(trouve).not.toBeNull()

    // `<` est échappé à l'écriture : on le rétablit avant d'analyser.
    const graphe = JSON.parse(trouve![1].replace(/\\u003c/g, '<'))
    expect(graphe['@graph']).toHaveLength(2)

    /*
     * Ce qui ne doit PAS y figurer. Un `aggregateRating` inventé déclencherait
     * l'affichage enrichi de Google, et une `Organization` ferait lire le site comme
     * un émetteur institutionnel — les deux contrediraient la page qu'ils décrivent.
     */
    const texte = JSON.stringify(graphe)
    expect(texte).not.toContain('aggregateRating')
    expect(texte).not.toContain('Organization')
    expect(texte).not.toContain('author')
  })

  /*
   * L'invariant des mentions légales : soit la page est complète et publiée, soit elle
   * n'existe pas du tout. L'état intermédiaire — publiée en annonçant « adresse à
   * compléter » — est le seul qui serait pire que l'absence de page, puisqu'il prouverait
   * qu'on ne l'a pas relue. C'est ce test qui interdit cet état, dans les deux sens.
   */
  it('les mentions légales sont complètes, ou absentes', () => {
    if (!mentionsPretes()) {
      expect(PAGES).not.toContain('mentions')
      return
    }

    expect(PAGES).toContain('mentions')
    for (const langue of LANGUES) {
      const { html, tete } = rendre(langue, 'mentions')
      expect(html).not.toContain('À-COMPLÉTER')
      // Sans canonique propre, les deux pages se disputeraient le même résultat.
      expect(tete).toContain(`${cheminPage(langue, 'mentions')}" />`)
      // Le balisage structuré décrit le site, pas une page administrative.
      expect(tete).not.toContain('application/ld+json')
    }
  })

  it('le pied de page ne propose les mentions que si elles existent', () => {
    const { html } = rendre('fr')
    expect(html.includes('/mentions/')).toBe(PAGES.includes('mentions'))
  })

  it.each(LANGUES)('%s : annonce les deux autres langues au partage', (langue) => {
    const { tete } = rendre(langue)
    const autres = LANGUES.filter((l) => l !== langue)
    for (const l of autres) {
      expect(tete).toContain(`og:locale:alternate" content="${l}_LU"`)
    }
    expect(tete).toContain(`og:locale" content="${langue}_LU"`)
  })
})
