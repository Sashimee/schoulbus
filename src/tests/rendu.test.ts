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
import { CONTENUS, LANGUES, PAGES, cheminPage } from '../i18n/contexte.ts'
import {
  ADRESSE_CONTACT,
  APP_PUBLIEE,
  URL_APP,
  URL_SOURCE_OFFICIELLE,
  imagePartage,
  mentionsPretes,
} from '../config.ts'
import { ECRANS, THEMES, fichierCapture } from '../contenu/captures.ts'

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

/*
 * Les captures, à part : `import.meta.glob('../../public/*')` ne descend pas dans les
 * sous-dossiers, et un motif récursif ramasserait aussi bien les fichiers de travail.
 */
const CAPTURES = new Set(
  Object.keys(import.meta.glob('../../public/captures/*', { eager: false })).map(
    (c) => c.split('/').pop() as string,
  ),
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

  /*
   * Les captures : annoncées et présentes, ni plus ni moins.
   *
   * C'est le même raisonnement que pour `og:image` ci-dessus, et il vaut d'autant plus
   * ici : une capture manquante ne casse pas la page, elle laisse un cadre de téléphone
   * vide au milieu du récit — et ce cadre a l'air d'un choix de mise en page.
   */
  it('chaque capture annoncée par le manifeste existe sur le disque', () => {
    const manquantes = []
    for (const langue of LANGUES) {
      for (const theme of THEMES) {
        for (const ecran of ECRANS) {
          const nom = fichierCapture(ecran.nom, langue, theme).replace('captures/', '')
          if (!CAPTURES.has(nom)) manquantes.push(nom)
        }
      }
    }
    expect(manquantes).toEqual([])
  })

  it('aucune capture ne traîne hors du manifeste', () => {
    // Un fichier resté d'un écran supprimé serait servi sans jamais être affiché, et
    // pèserait sur le dépôt jusqu'à ce que quelqu'un se demande à quoi il sert.
    const attendues = new Set(
      LANGUES.flatMap((langue) =>
        THEMES.flatMap((theme) =>
          ECRANS.map((e) => fichierCapture(e.nom, langue, theme).replace('captures/', '')),
        ),
      ),
    )
    expect([...CAPTURES].filter((f) => !attendues.has(f))).toEqual([])
  })

  it.each(LANGUES)('%s : la page ne montre que les captures de sa langue', (langue) => {
    const { html } = rendre(langue)
    const citees = [...html.matchAll(/captures\/[a-z]+-([a-z]{2})-[a-z]+\.webp/g)].map((m) => m[1])
    expect(citees.length).toBeGreaterThan(0)
    // Une capture allemande servie sous `/lb/` est la version moderne du QR en chemin
    // relatif : invisible à la relecture, puisqu'on relit dans sa propre langue.
    expect([...new Set(citees)]).toEqual([langue])
  })

  it.each(LANGUES)('%s : la capture du héros est préchargée dans les deux thèmes', (langue) => {
    const { tete } = rendre(langue)
    for (const theme of THEMES) {
      expect(tete).toContain(`href="/${fichierCapture('aujourdhui', langue, theme)}"`)
    }
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
    /*
     * Le site est toujours décrit ; l'application ne l'est que si elle est publique. Un
     * `SoftwareApplication` porte une `url`, et le décrire donnerait aux moteurs l'adresse
     * exacte vers laquelle la page refuse de conduire.
     */
    expect(graphe['@graph']).toHaveLength(APP_PUBLIEE ? 2 : 1)
    expect(graphe['@graph'][0]['@type']).toBe('WebSite')

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

  /*
   * La page « Indépendance ».
   *
   * Elle n'est conditionnée par rien — contrairement aux mentions, qui attendent l'adresse
   * de l'éditeur — donc elle doit exister dans les quatre langues, toujours.
   */
  it.each(LANGUES)('%s : la page indépendance est engendrée et se désigne elle-même', (langue) => {
    expect(PAGES).toContain('independance')
    const { html, tete } = rendre(langue, 'independance')

    expect(html).toContain(CONTENUS[langue].independance.titre)
    // Sans canonique propre, elle se disputerait le résultat de recherche de l'accueil.
    expect(tete).toContain(`${cheminPage(langue, 'independance')}" />`)
    // Le balisage structuré décrit le site, pas une page annexe.
    expect(tete).not.toContain('application/ld+json')
  })

  /*
   * Le lien vers le plan officiel de la commune ne doit jamais disparaître du site.
   *
   * Ce test protège contre une panne qui n'existe pas encore. `URL_SOURCE_OFFICIELLE`
   * n'a que deux consommateurs : la page ci-dessus, et le bouton fantôme du bloc
   * « bientôt » de l'appel final. Or ce bouton n'apparaît QUE tant que `APP_PUBLIEE` vaut
   * `false` : le jour où l'application sera publiée, il s'en va.
   *
   * Avant, la section « Indépendance » de l'accueil portait ce lien en permanence. Elle
   * n'existe plus. Sans ce test, la bascule de l'interrupteur retirerait donc du site
   * entier le renvoi vers la source officielle — silencieusement, et alors même que
   * `config.ts` exige que « le lien doit rester visible partout où l'on parle d'horaires ».
   */
  /*
   * La page de contact. Comme l'indépendance, elle n'est conditionnée par rien : elle
   * existe dans les quatre langues, toujours.
   */
  it.each(LANGUES)('%s : la page contact est engendrée et se désigne elle-même', (langue) => {
    expect(PAGES).toContain('contact')
    const { html, tete } = rendre(langue, 'contact')

    expect(html).toContain(CONTENUS[langue].contact.titre)
    expect(tete).toContain(`${cheminPage(langue, 'contact')}" />`)
    expect(tete).not.toContain('application/ld+json')
  })

  /*
   * L'adresse doit être lisible SANS JavaScript.
   *
   * Le formulaire, lui, en a besoin : il assemble son `mailto:` dans le navigateur. Si le
   * pré-rendu ne portait pas l'adresse en clair, la page serait un cul-de-sac pour qui
   * n'exécute pas de script — sur un site dont c'est justement l'engagement de pré-rendre
   * tout son HTML.
   */
  it.each(LANGUES)('%s : l’adresse de contact se lit sans JavaScript', (langue) => {
    const { html } = rendre(langue, 'contact')
    expect(html).toContain(ADRESSE_CONTACT)
    expect(html).toContain(`mailto:${ADRESSE_CONTACT}`)
  })

  /*
   * Et elle ne se lit QUE là.
   *
   * Le pied de page paraît sur l'accueil des quatre langues : y écrire l'adresse la ferait
   * entrer dans tous les fichiers pré-rendus au lieu des trois pages de contact. C'est la
   * seule mesure du projet qui réduise réellement ce qu'un aspirateur d'adresses ramasse,
   * et elle ne tient qu'à une convention — d'où ce test, qui la rappellera à qui voudra un
   * jour mettre l'adresse dans le pied de page « pour rendre service ».
   */
  it('l’adresse de contact ne figure que sur la page de contact', () => {
    for (const langue of LANGUES) {
      for (const page of PAGES) {
        if (page === 'contact') continue
        const { html, tete } = rendre(langue, page)
        expect(`${html}${tete}`, `${langue}/${page}`).not.toContain(ADRESSE_CONTACT)
      }
    }
  })

  it('l’accueil mène au contact par ses trois entrées, et par elles seules', () => {
    const { html } = rendre('fr')
    const chemin = cheminPage('fr', 'contact')

    /*
     * Trois, et le compte est exact plutôt que minimal : l'en-tête flottant qui
     * accompagne la lecture, la coda après l'appel final, et le pied de page. Un
     * quatrième lien serait une décision — la page en a déjà autant qu'elle en supporte
     * sans se mettre à réclamer.
     */
    expect(html.split(`href="${chemin}"`).length - 1).toBe(3)
  })

  it.each(LANGUES)('%s : le renvoi vers le plan officiel survit à l’interrupteur', (langue) => {
    const { html } = rendre(langue, 'independance')
    expect(html).toContain(URL_SOURCE_OFFICIELLE)
  })

  /*
   * Rien, nulle part, ne renvoie à un dépôt de code.
   *
   * Le pied de page portait un lien « Code source » vers le dépôt de l'application. Il a
   * été retiré : ce que voit un visiteur n'a pas à mener au code, et le développeur qui le
   * cherche le trouve dans le README.
   *
   * Le motif est volontairement LARGE — `github.com`, et non l'adresse exacte qui vient
   * d'être supprimée. Le jour où quelqu'un voudra lier un dépôt, quel qu'il soit, ce test
   * le lui rappellera : ce sera une décision, et non un glissement au fil d'un pied de page
   * qu'on complète.
   */
  it.each(LANGUES)('%s : aucune page ne renvoie à un dépôt de code', (langue) => {
    for (const page of PAGES) {
      const { html, tete } = rendre(langue, page)
      expect(`${html}${tete}`, `${langue}/${page}`).not.toContain('github.com')
    }
  })

  it('le pied de page ne propose les mentions que si elles existent', () => {
    const { html } = rendre('fr')
    expect(html.includes('/mentions/')).toBe(PAGES.includes('mentions'))
  })

  it('le pied de page mène à l’indépendance, discrètement', () => {
    // Le seul chemin vers elle depuis l'accueil : c'est tout l'objet du déplacement.
    const { html } = rendre('fr')
    expect(html).toContain(cheminPage('fr', 'independance'))
  })

  /*
   * L'invariant de l'application : tant qu'elle n'est pas publique, RIEN dans les pages
   * rendues ne mène à elle. Ni bouton, ni QR, ni entrée de pied de page, ni balisage
   * structuré.
   *
   * Ce test ne protège pas contre l'erreur d'aujourd'hui — le tri vient d'être fait, et se
   * relit. Il protège contre celle de dans trois mois : une section ajoutée, un lien repris
   * d'un ancien exemple, et l'adresse repart en ligne sans que personne ne s'en aperçoive,
   * puisque la page continuerait de s'afficher parfaitement.
   */
  it('aucune page ne mène à l’application tant qu’elle n’est pas publique', () => {
    for (const langue of LANGUES) {
      for (const page of PAGES) {
        const { html, tete } = rendre(langue, page)
        const trouve = `${html}${tete}`.includes(URL_APP)

        /*
         * L'invariant n'est pas le même dans les deux sens, et la nuance compte.
         *
         * Tant que l'application n'est pas publique, AUCUNE page ne doit la nommer : c'est
         * l'interrupteur, et il est absolu. Une fois publiée, en revanche, seule la page
         * d'accueil est tenue d'y mener — les mentions légales n'ont ni pied de page ni
         * appel à l'action, et exiger d'elles un lien ferait échouer la construction le
         * jour où l'adresse de l'éditeur sera renseignée et où la page apparaîtra.
         *
         * Écrit maintenant, tant que c'est bon marché : la bascule vers `true` arme ce
         * piège sans le déclencher, donc personne ne le verrait venir.
         */
        if (!APP_PUBLIEE) {
          expect(trouve, `${langue}/${page} ne doit pas nommer l’application`).toBe(false)
        } else if (page === 'accueil') {
          expect(trouve, `${langue}/${page} doit mener à l’application`).toBe(true)
        }
      }
    }
  })

  /*
   * Le `<noscript>` d'`index.html`.
   *
   * Le README le désigne comme la seule chose que l'interrupteur ne couvre pas : c'est du
   * HTML statique, hors de portée d'une constante TypeScript, et il fallait donc penser à
   * le corriger à la main le jour de la publication. « Penser à » n'est pas une garantie ;
   * un test en est une.
   */
  it('le noscript nomme l’application si et seulement si elle est publique', () => {
    const gabarits = import.meta.glob('../../index.html', { query: '?raw', eager: true })
    const source = Object.values(gabarits)[0] as unknown as { default: string }
    const noscript = source.default.match(/<noscript>([\s\S]*?)<\/noscript>/)
    expect(noscript).not.toBeNull()
    expect(noscript?.[1].includes(URL_APP)).toBe(APP_PUBLIEE)
  })

  it('les appels à l’action reviennent avec l’application', () => {
    const { html } = rendre('fr')
    // Le héros porte soit ses deux boutons, soit l'annonce — jamais ni l'un ni l'autre.
    expect(html).toContain(APP_PUBLIEE ? CONTENUS.fr.heros.actionPrincipale : CONTENUS.fr.general.bientot)
    // Le QR ne s'affiche qu'avec ce vers quoi il pointe.
    expect(html.includes('qr-application.svg')).toBe(APP_PUBLIEE)
  })

  /*
   * La locale est LUE dans le contenu, et non reconstruite ici.
   *
   * Ce test la fabriquait naguère en collant `_LU` au code de la langue — c'est-à-dire
   * qu'il refaisait le calcul du code au lieu de le vérifier, et qu'il aurait donc validé
   * `en_LU` avec le même entrain. Ce que le code compose, un test ne doit pas le composer
   * une seconde fois : il ne prouve alors que sa propre existence.
   */
  it.each(LANGUES)('%s : annonce les autres langues au partage', (langue) => {
    const { tete } = rendre(langue)
    for (const l of LANGUES.filter((l) => l !== langue)) {
      expect(tete).toContain(`og:locale:alternate" content="${CONTENUS[l].localePartage}"`)
    }
    expect(tete).toContain(`og:locale" content="${CONTENUS[langue].localePartage}"`)
  })
})
