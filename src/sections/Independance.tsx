/*
 * L'indépendance.
 *
 * Cette section n'est pas négociable et ne s'anime pas. L'application répète la même
 * mention dans son pied de page, dans son image de partage, dans un bandeau au premier
 * lancement et sur une page entière : une vitrine qui l'omettrait, ou qui la reléguerait
 * en petits caractères, contredirait le projet avant même qu'on l'ouvre.
 *
 * Elle porte les couleurs `--attention` plutôt que celles du danger : ce n'est pas une
 * alerte, c'est une précision qui doit être lue.
 */
import { Icone } from '../composants/Icones.tsx'
import { URL_SOURCE_OFFICIELLE } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Independance() {
  const contenu = useContenu()

  return (
    <section className="section section--serree" id="independance">
      <div className="bande bande--moyen">
        <Revele>
          <div className="independance">
            <h2>{contenu.independance.titre}</h2>
            <p>{contenu.independance.texte}</p>
            <p>
              <a href={URL_SOURCE_OFFICIELLE} target="_blank" rel="noopener noreferrer">
                {contenu.independance.lien}
                <Icone nom="externe" className="lien__icone" />
              </a>
            </p>
          </div>
        </Revele>
      </div>
    </section>
  )
}
