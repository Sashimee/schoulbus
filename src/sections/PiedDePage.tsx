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
import { useContenu } from '../i18n/contexte.ts'

export function PiedDePage() {
  const contenu = useContenu()

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
            </div>
          </nav>
        </div>

        <div className="pied__bas">
          <div className="pile pile--1">
            <span>{contenu.pied.mention}</span>
            <span>{contenu.pied.source}</span>
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
