/*
 * Les limites.
 *
 * C'est le contre-temps de la page, et il est délibéré : aucune carte de verre, aucun
 * projecteur, aucun décalage — un filet en haut de chaque colonne, du texte, et rien
 * d'autre. Après six sections où tout bouge, l'immobilité se remarque plus que le
 * mouvement, et c'est précisément l'effet recherché sur le seul passage où le site
 * énumère ce qu'il ne sait pas faire.
 *
 * Sa place dans la page l'est tout autant. Elle vient AVANT l'appel final, comme dans
 * l'application, où la page « Limites » est présentée avant toute promesse.
 */
import { Bouton } from '../composants/Bouton.tsx'
import { APP_PUBLIEE, URL_LIMITES } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Limites() {
  const contenu = useContenu()

  return (
    <section className="section" id="limites">
      <div className="bande">
        <Revele className="entete-section">
          <span className="etiquette">{contenu.limites.etiquette}</span>
          <h2>{contenu.limites.titre}</h2>
          <p className="chapeau">{contenu.limites.chapeau}</p>
        </Revele>

        <ul className="limites__liste">
          {contenu.limites.items.map((item, i) => (
            <Revele key={item.titre} as="li" rang={i} className="limites__item">
              <h3>{item.titre}</h3>
              <p>{item.texte}</p>
            </Revele>
          ))}
        </ul>

        {/* Le lien menait à la page « Limites » de l'application. Les trois items
            ci-dessus disent déjà l'essentiel ; c'est le renvoi vers le détail qui manque,
            pas l'aveu lui-même. */}
        {APP_PUBLIEE && (
          <div className="horsligne__action">
            <Bouton href={URL_LIMITES} variante="fantome" externe>
              {contenu.limites.lien}
            </Bouton>
          </div>
        )}
      </div>
    </section>
  )
}
