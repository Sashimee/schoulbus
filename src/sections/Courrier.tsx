/*
 * Le renvoi au contact, tout en bas de l'accueil.
 *
 * `Courrier` et non `Contact` : la PAGE s'appelle déjà `pages/Contact.tsx`, et deux
 * composantes du même nom obligeraient à renommer l'une des deux à l'import — dans
 * `App.tsx` et dans `entree.tsx`, c'est-à-dire précisément les deux fichiers qu'on lit
 * côte à côte pour comprendre où mène quoi.
 *
 * UNE CODA, PAS UN SECOND APPEL À L'ACTION. L'appel final referme la page sur l'heure par
 * laquelle elle s'est ouverte ; une deuxième demande juste après lui prendrait ce qu'il a.
 * D'où la variante fantôme, l'absence de surface accentuée et la phrase unique. Si ce bloc
 * devait un jour se mettre à peser autant que celui du dessus, c'est qu'il aurait changé
 * de nature — et il faudrait le déplacer, pas le grossir.
 *
 * L'ordre des sections n'est pas touché par ailleurs : « Limites » reste avant l'appel
 * final, ce qui est le deuxième principe du projet.
 */
import { Bouton } from '../composants/Bouton.tsx'
import { cheminPage, useContenu, useLangue } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Courrier() {
  const contenu = useContenu()
  const { langue } = useLangue()

  return (
    <section className="section courrier" id="ecrire">
      <div className="bande bande--texte">
        <Revele>
          <div className="pile pile--3">
            <h2>{contenu.contact.brefTitre}</h2>
            <p className="texte-doux">{contenu.contact.brefTexte}</p>
            <div className="rangee">
              {/*
               * Un lien vers la page, jamais un `mailto:` : l'adresse ne doit paraître
               * que sur les trois pages de contact, et non dans l'accueil des trois
               * langues (voir le pied de page, qui suit la même règle).
               */}
              <Bouton href={cheminPage(langue, 'contact')} variante="fantome">
                {contenu.contact.brefAction}
              </Bouton>
            </div>
          </div>
        </Revele>
      </div>
    </section>
  )
}
