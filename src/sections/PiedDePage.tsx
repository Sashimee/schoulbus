/*
 * Le pied de page.
 *
 * Il reprend les commandes de langue et de thème à taille pleine : celles de l'en-tête
 * mesurent 34 px de haut au pointeur fin, ce qui est sous la cible tactile de 44 px que
 * le projet s'impose.
 *
 * CE N'EST PLUS LE SEUL ENDROIT OÙ UNE PERSONNE SUR TÉLÉPHONE PEUT CHANGER DE LANGUE.
 * Ça l'était, et c'était une page entière à faire défiler pour une commande dont on a
 * besoin à la première ligne : au pointeur grossier, les segments de l'en-tête passent
 * désormais à 44 px au lieu de disparaître (voir `composants.css`). Ceux d'ici ne sont
 * donc plus un recours mais une reprise — on arrive en bas de page avec la question
 * « et en portugais ? » encore en tête, et il n'y a plus à remonter pour y répondre.
 *
 * ELLES COMPTENT CINQ SEGMENTS DEPUIS LA REFONTE, et non plus trois. Sur un téléphone
 * étroit, cinq pastilles de 44 px ne tiennent pas sur une ligne : la commande passe à la
 * ligne au lieu de comprimer ses cibles. Une cible tactile qu'on rétrécit pour tenir dans
 * la largeur est une cible qu'on rate, et c'est la langue qu'on rate — donc la première
 * chose dont une famille lusophone a besoin sur cette page.
 */
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { APP_PUBLIEE, URL_APP } from '../config.ts'
import { PAGES, cheminPage, useContenu, useLangue } from '../i18n/contexte.ts'

/*
 * Les liens qui entrent dans l'application sont retirés tant qu'elle n'est pas publique.
 *
 * Le tri se fait sur l'adresse plutôt que sur une liste tenue à la main : c'est la seule
 * façon qu'un lien ajouté demain dans `contenu/*.ts` soit filtré lui aussi, sans que
 * personne n'ait à se souvenir de cette règle.
 */
function sansApplication(liens: { texte: string; url: string }[]) {
  return APP_PUBLIEE ? liens : liens.filter((l) => !l.url.startsWith(URL_APP))
}

export function PiedDePage() {
  const contenu = useContenu()
  const { langue } = useLangue()
  const siteVisibles = sansApplication(contenu.pied.liens.site)
  const projetVisibles = sansApplication(contenu.pied.liens.projet)

  /*
   * Les pages du site lui-même. Chacune n'entre dans la liste que si `PAGES` la contient,
   * de sorte qu'un lien ne peut pas mener à une adresse que le pré-rendu n'écrit pas.
   */
  const pagesInternes = [
    { page: 'independance' as const, texte: contenu.independance.titre },
    { page: 'mentions' as const, texte: contenu.pied.lienMentions },
  ].filter((p) => PAGES.includes(p.page))

  return (
    <footer className="pied">
      <div className="bande">
        <div className="pied__grille">
          <div className="pile pile--4">
            <span className="marque">
              <LogoBus className="marque__logo" />
              <span>{contenu.general.marque}</span>
            </span>
            <p className="texte-doux">{contenu.pied.description}</p>
          </div>

          {/*
           * « Le site » : ses propres pages, et celles de l'application qui le prolongent.
           *
           * Les pages internes (indépendance, mentions) sont ICI et non sous « Le projet »,
           * parce que c'est ce que les deux titres disent. Elles ne s'ouvrent pas dans un
           * onglet, contrairement aux liens vers l'application.
           *
           * L'indépendance n'a plus que ce lien pour la désigner : elle tenait une section
           * entière de l'accueil, elle est désormais trouvable par qui la cherche, sans
           * occuper le propos. Ce que l'accueil continue de dire de lui-même se lit dans
           * `pied.description`, deux colonnes plus à gauche.
           *
           * Chaque entrée n'apparaît que si sa page existe : les mentions ne sont pas
           * engendrées tant que l'adresse de l'éditeur n'est pas renseignée, et le lien
           * mènerait à une 404.
           */}
          {(siteVisibles.length > 0 || pagesInternes.length > 0) && (
            <nav aria-label={contenu.pied.titreSite}>
              <h2 className="pied__titre">{contenu.pied.titreSite}</h2>
              <div className="pied__liens">
                {siteVisibles.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.texte}
                  </a>
                ))}
                {pagesInternes.map((p) => (
                  <a key={p.page} href={cheminPage(langue, p.page)}>
                    {p.texte}
                  </a>
                ))}
              </div>
            </nav>
          )}

          {/*
           * « Le projet » ne porte plus que les crédits, eux-mêmes filtrés tant que
           * l'application n'est pas publique — la colonne disparaît donc entièrement, et
           * revient d'elle-même le jour de la bascule. Elle a la même garde que « Le site »,
           * et pour la même raison : un titre au-dessus d'une liste vide annonce quelque
           * chose qui n'arrive pas.
           */}
          {projetVisibles.length > 0 && (
            <nav aria-label={contenu.pied.titreProjet}>
              <h2 className="pied__titre">{contenu.pied.titreProjet}</h2>
              <div className="pied__liens">
                {projetVisibles.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.texte}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </div>

        <div className="pied__bas">
          <div className="pile pile--1">
            <span>{contenu.pied.mention}</span>
            <span>{contenu.pied.source}</span>
            {/*
             * La promesse de la PAGE, distincte de celle de l'application dont parle la
             * carte sombre de `Principes`. Elle est vérifiable depuis la barre d'outils
             * du navigateur, et c'est bien pour cela qu'elle est écrite : une page qui
             * l'affirme sans la tenir se fait prendre en dix secondes.
             */}
            <span>{contenu.pied.viePrivee}</span>
          </div>
          <div className="rangee">
            <ChoixLangue />
            <ChoixTheme />
          </div>
        </div>
      </div>
    </footer>
  )
}
