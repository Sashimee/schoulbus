/*
 * Le pied de page.
 *
 * Il reprend les commandes de langue et de thème à taille pleine : celles de l'en-tête
 * mesurent 34 px de haut et sont masquées au pointeur grossier, faute de quoi elles
 * seraient sous la cible tactile de 44 px imposée par le projet. Ici, elles sont à
 * bonne taille, et c'est le seul endroit où une personne sur téléphone peut changer de
 * langue.
 */
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { PAGES, cheminPage, useContenu, useLangue } from '../i18n/contexte.ts'

export function PiedDePage() {
  const contenu = useContenu()
  const { langue } = useLangue()

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

          <nav aria-label={contenu.pied.titreSite}>
            <h2 className="pied__titre">{contenu.pied.titreSite}</h2>
            <div className="pied__liens">
              {contenu.pied.liens.site.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.texte}
                </a>
              ))}
            </div>
          </nav>

          <nav aria-label={contenu.pied.titreProjet}>
            <h2 className="pied__titre">{contenu.pied.titreProjet}</h2>
            <div className="pied__liens">
              {contenu.pied.liens.projet.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.texte}
                </a>
              ))}
              {/*
               * Les mentions légales sont la seule autre page du site : elles ne s'ouvrent
               * donc pas dans un onglet, contrairement à tous les liens ci-dessus, qui
               * mènent à l'application. Le lien n'apparaît que si la page existe — tant que
               * l'adresse de l'éditeur n'est pas renseignée, elle n'est pas engendrée, et
               * un lien mènerait à une 404.
               */}
              {PAGES.includes('mentions') && (
                <a href={cheminPage(langue, 'mentions')}>{contenu.pied.lienMentions}</a>
              )}
            </div>
          </nav>
        </div>

        <div className="pied__bas">
          <div className="pile pile--1">
            <span>{contenu.pied.mention}</span>
            <span>{contenu.pied.source}</span>
            {/*
             * La promesse de la PAGE, distincte de celle de l'application dont parle la
             * section « Confidentialité ». Elle est vérifiable depuis la barre d'outils
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
