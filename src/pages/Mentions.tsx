/*
 * Les mentions légales.
 *
 * Une page nue : pas de fond animé, pas de rideau, pas de curseur, pas de défilement
 * détourné. Rien de tout cela ne sert ici, et tout se charge d'autant plus vite qu'on n'y
 * vient que pour vérifier qui publie ce site.
 *
 * Elle garde en revanche le dégradé, la typographie et les commandes de langue : c'est la
 * même page, pas une annexe imprimée à la va-vite. Une mention légale visiblement bâclée
 * dit quelque chose du reste.
 */
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { useContenu, useLangue, cheminLangue } from '../i18n/contexte.ts'

/** Un paragraphe par ligne : les corps de texte portent des retours à la ligne signifiants. */
function Corps({ texte }: { texte: string }) {
  return (
    <>
      {texte.split('\n').map((ligne) => (
        <p key={ligne} className="texte-doux">
          {ligne}
        </p>
      ))}
    </>
  )
}

export function Mentions() {
  const contenu = useContenu()
  const { langue } = useLangue()
  const accueil = cheminLangue(langue)

  const blocs = [
    { titre: contenu.mentions.editeurTitre, corps: contenu.mentions.editeurCorps },
    { titre: contenu.mentions.hebergeurTitre, corps: contenu.mentions.hebergeurCorps },
    { titre: contenu.mentions.donneesTitre, corps: contenu.mentions.donneesCorps },
    { titre: contenu.mentions.responsabiliteTitre, corps: contenu.mentions.responsabiliteCorps },
  ]

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
            <h1>{contenu.mentions.titre}</h1>
            <p className="chapeau">{contenu.mentions.intro}</p>
          </div>

          {blocs.map((b) => (
            <section key={b.titre} className="pile pile--2">
              <h2>{b.titre}</h2>
              <Corps texte={b.corps} />
            </section>
          ))}

          <div className="rangee">
            <a className="bouton bouton--discret" href={accueil}>
              {contenu.mentions.retour}
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
