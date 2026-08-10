/*
 * La grille des fonctions.
 *
 * Neuf tuiles de largeurs inégales sur six colonnes. L'inégalité n'est pas décorative :
 * elle hiérarchise. Les deux tuiles larges — la fiche de la semaine et la feuille à
 * imprimer — sont celles qu'un parent ouvre le plus souvent après l'écran du matin ;
 * les sept autres sont des réponses à des cas particuliers, et se lisent comme telles.
 *
 * Chaque tuile porte son projecteur. Neuf écouteurs de pointeur, un par carte, mais
 * chacun ne s'éveille que sous la main — voir `useProjecteur` pour pourquoi ce n'est pas
 * un écouteur global.
 */
import { Carte } from '../composants/Carte.tsx'
import { Icone, type NomIcone } from '../composants/Icones.tsx'
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Fonctions() {
  const contenu = useContenu()

  return (
    <section className="section" id="fonctions">
      <div className="bande">
        <Revele className="entete-section">
          <span className="etiquette">{contenu.fonctions.etiquette}</span>
          <h2>{contenu.fonctions.titre}</h2>
          <p className="chapeau">{contenu.fonctions.chapeau}</p>
        </Revele>

        <ul className="bento">
          {contenu.fonctions.tuiles.map((tuile, i) => (
            <Revele key={tuile.titre} as="li" rang={i} className="bento__tuile">
              <Carte projecteur>
                <span className="puce">
                  <Icone nom={tuile.icone as NomIcone} />
                </span>
                <h3>{tuile.titre}</h3>
                <p>{tuile.texte}</p>
              </Carte>
            </Revele>
          ))}
        </ul>
      </div>
    </section>
  )
}
