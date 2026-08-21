/*
 * Les deux principes, en deux cartes.
 *
 * Elles remplacent deux sections entières : « Confidentialité », qui portait un schéma
 * dessiné (`SchemaConfidentialite`) et trois points détaillés, et « Hors ligne », qui en
 * portait cinq. Sept cent mots pour deux idées.
 *
 * Ce qui a disparu et ce qui n'a pas disparu, parce que la différence compte :
 *
 *   — le schéma, oui. Il dessinait un navigateur, un serveur, et une flèche barrée entre
 *     les deux. Une illustration qui redit sa légende n'ajoute rien à qui lit, et n'est
 *     rien du tout pour qui ne voit pas ;
 *   — le partage après le dièse, oui, mais il reste vrai et reste écrit : c'est la page
 *     « Limites » de l'application qui le porte, vers laquelle la section suivante renvoie ;
 *   — la nuance sur la carte du trajet à pied, NON. Elle est le troisième point de la
 *     carte claire, en ambre. La taire pour tenir en trois puces aurait fait promettre un
 *     « tout hors ligne » que la fiche de la semaine dément dès qu'on l'ouvre sans réseau.
 *     C'est exactement le genre de raccourci que la section des limites existe pour ne pas
 *     avoir à rattraper.
 *
 * La carte sombre porte le premier principe, et elle est sombre dans les deux thèmes :
 * c'est le seul panneau de la page qui inverse son encre, et cette inversion est ce qui
 * le fait lire en premier.
 */
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Principes() {
  const contenu = useContenu()

  return (
    <section className="section section--serree" id="principes">
      <div className="bande principes">
        <Revele className="principe principe--panneau">
          <span className="etiquette etiquette--mono etiquette--sur-panneau">
            {contenu.principes.donnees.etiquette}
          </span>
          <h2 className="principe__titre">{contenu.principes.donnees.titre}</h2>
          <p className="principe__texte">{contenu.principes.donnees.texte}</p>
        </Revele>

        <Revele rang={1} className="principe principe--clair">
          <span className="etiquette etiquette--mono">
            {contenu.principes.horsLigne.etiquette}
          </span>
          <h2 className="principe__titre">{contenu.principes.horsLigne.titre}</h2>
          <ul className="principe__points">
            {contenu.principes.horsLigne.points.map((point) => (
              <li
                key={point.texte}
                className={`principe__point${point.ton === 'nuance' ? ' principe__point--nuance' : ''}`}
              >
                {/*
                 * La puce est décorative : sa couleur distingue la nuance des deux
                 * affirmations, mais elle ne porte aucune information qu'un lecteur
                 * d'écran doive entendre — le texte de la puce ambre dit « seule … a
                 * encore besoin du réseau », ce qui est déjà la restriction en toutes
                 * lettres.
                 */}
                <span className="principe__puce" aria-hidden="true" />
                {point.texte}
              </li>
            ))}
          </ul>
        </Revele>
      </div>
    </section>
  )
}
