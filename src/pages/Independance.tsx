/*
 * L'indépendance, sur sa propre page.
 *
 * Elle occupait naguère une section entière de l'accueil, juste avant l'appel final. Elle
 * en est sortie parce qu'elle y était trop au premier plan pour ce qu'elle est — une
 * précision, pas un argument. Elle n'a pas pour autant été supprimée, et la nuance est
 * toute la raison d'être de ce fichier.
 *
 * Ce que l'accueil continue de dire sans elle : « Site indépendant » dans l'étiquette du
 * héros, « sans lien avec la commune ni avec l'école » dans le pied de page et dans la
 * description lue par les moteurs, et la même mention sur la vignette de partage — celle
 * qu'un groupe de parents voit avant même d'ouvrir le lien.
 *
 * Ce que cette page est seule à porter : « en cas de doute ou de divergence, c'est le
 * document officiel de la commune qui fait foi ». Aucune autre chaîne du site ne dit lequel
 * des deux documents l'emporte. C'est pour cette phrase qu'une page valait mieux qu'une
 * suppression.
 *
 * Nue, comme les mentions légales : ni fond animé, ni rideau, ni défilement détourné. On
 * n'y vient que pour vérifier une chose, et elle doit s'afficher tout de suite.
 */
import { Icone } from '../composants/Icones.tsx'
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { URL_SOURCE_OFFICIELLE } from '../config.ts'
import { useContenu, useLangue, cheminLangue } from '../i18n/contexte.ts'

export function Independance() {
  const contenu = useContenu()
  const { langue } = useLangue()
  const accueil = cheminLangue(langue)

  return (
    <>
      <a className="saut-contenu" href="#contenu">
        {contenu.general.sautContenu}
      </a>


      <main id="contenu" className="section">
        <div className="bande bande--texte pile pile--6">
          {/* Le retour se fait par la marque, comme partout ailleurs sur le site. */}
          <a className="marque" href={accueil}>
            <LogoBus className="marque__logo" />
            <span>{contenu.general.marque}</span>
          </a>

          <div className="pile pile--3">
            <h1>{contenu.independance.titre}</h1>
            <p className="chapeau">{contenu.independance.texte}</p>
          </div>

          <p>
            <a href={URL_SOURCE_OFFICIELLE} target="_blank" rel="noopener noreferrer">
              {contenu.independance.lien}
              <Icone nom="externe" className="lien__icone" />
            </a>
          </p>

          <div className="rangee">
            <a className="bouton bouton--discret" href={accueil}>
              {contenu.independance.retour}
            </a>
          </div>

          <div className="rangee">
            <ChoixLangue />
            <ChoixTheme />
          </div>
        </div>
      </main>
    </>
  )
}
