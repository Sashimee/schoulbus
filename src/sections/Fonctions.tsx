/*
 * La grille des fonctions.
 *
 * Neuf tuiles, toutes de la même taille.
 *
 * ELLES ÉTAIENT DE LARGEURS INÉGALES, sur six colonnes, et les portées étaient posées
 * par position en CSS : `nth-child(1)` et `(6)` en `span 4`, `(8)` et `(9)` en `span 3`.
 * L'intention était de hiérarchiser. Le résultat était une composition qui se cassait en
 * silence dès qu'on ajoutait, retirait ou déplaçait une tuile — la règle vivait dans la
 * feuille de style, la liste dans cinq fichiers de contenu, et rien ne les reliait.
 *
 * La refonte les égalise et laisse `auto-fit` compter les colonnes. On y perd une
 * hiérarchie que personne n'avait demandée ; on y gagne une grille où la neuvième tuile
 * ne dépend plus de son rang pour être bien posée, et qui se replie de trois colonnes à
 * une sans qu'aucune règle ne la rattrape.
 *
 * La seule tuile qui se distingue encore est celle des perturbations, dont l'icône est
 * en corail. Cela vient de la DONNÉE (`ton: 'alerte'`), pas d'un rang : une tuile qu'on
 * déplace emporte sa couleur avec elle, et `contenu.test.ts` vérifie que c'est la même
 * dans les cinq langues.
 */
import { Icone, type NomIcone } from '../composants/Icones.tsx'
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Fonctions() {
  const contenu = useContenu()

  return (
    <section className="section" id="fonctions">
      <div className="bande fonctions">
        {/*
         * L'en-tête reste collé pendant que la grille défile à côté. C'est le seul
         * élément « collant » de la page hors de l'en-tête général : la grille compte
         * neuf tuiles, et sans lui on finit de la lire sans plus savoir de quoi elle est
         * la réponse.
         */}
        <Revele className="fonctions__entete">
          <span className="etiquette etiquette--mono">{contenu.fonctions.etiquette}</span>
          <h2>{contenu.fonctions.titre}</h2>
        </Revele>

        <ul className="tuiles">
          {contenu.fonctions.tuiles.map((tuile, i) => (
            <Revele key={tuile.titre} as="li" rang={i} className="tuile">
              <span className={`tuile__puce${tuile.ton === 'alerte' ? ' tuile__puce--alerte' : ''}`}>
                <Icone nom={tuile.icone as NomIcone} />
              </span>
              <h3 className="tuile__titre">{tuile.titre}</h3>
              <p className="tuile__texte">{tuile.texte}</p>
            </Revele>
          ))}
        </ul>
      </div>
    </section>
  )
}
