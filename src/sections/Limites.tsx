/*
 * Les limites.
 *
 * C'est le contre-temps de la page, et il est délibéré : aucune carte, aucune ombre,
 * aucun décalage — un filet corail en haut de chaque colonne, du texte, et rien d'autre.
 * Après cinq sections de démonstration, l'immobilité se remarque plus que le mouvement,
 * et c'est précisément l'effet recherché sur le seul passage où le site énumère ce qu'il
 * ne sait pas faire.
 *
 * Sa place dans la page l'est tout autant. Elle vient AVANT l'appel final, comme dans
 * l'application, où la page « Limites » est présentée avant toute promesse. La refonte a
 * retiré quatre sections de l'accueil ; celle-ci n'a pas bougé d'un cran, et la note en
 * chasse fixe à côté du titre dit maintenant pourquoi elle est là — « six limites, avant
 * qu'on vous demande de l'ouvrir ».
 *
 * SIX ITEMS, jamais quatre ni cinq : la grille en pose trois par rangée. Trois ou six
 * remplissent leurs rangées ; quatre ou cinq laissent un trou qui se lit comme un oubli.
 */
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'
import { APP_PUBLIEE, URL_LIMITES } from '../config.ts'

export function Limites() {
  const contenu = useContenu()

  return (
    <section className="section bande-teintee" id="limites">
      <div className="bande">
        <Revele className="limites__entete">
          <h2>{contenu.limites.titre}</h2>
          <span className="limites__note tabulaire">{contenu.limites.note}</span>
        </Revele>

        <ul className="limites__liste">
          {contenu.limites.items.map((item, i) => (
            <Revele key={item.titre} as="li" rang={i} className="limites__item">
              <h3>{item.titre}</h3>
              <p className="limites__texte">{item.texte}</p>
            </Revele>
          ))}
        </ul>

        {/*
         * Le renvoi vers le détail, et non l'aveu lui-même : les six items ci-dessus
         * disent l'essentiel et restent affichés dans les deux états. C'est le lien qui
         * disparaît quand l'application n'est pas joignable, puisqu'il y mène.
         *
         * Un lien dans le texte, pas un bouton : il termine une section de lecture, il
         * n'appelle pas un geste. La flèche est posée en CSS — elle est décorative, et un
         * lecteur d'écran n'a pas à entendre « flèche vers la droite » à la fin du libellé.
         */}
        {APP_PUBLIEE && (
          <Revele as="p" className="limites__lien">
            <a href={URL_LIMITES} target="_blank" rel="noopener noreferrer">
              {contenu.limites.lien}
            </a>
          </Revele>
        )}
      </div>
    </section>
  )
}
