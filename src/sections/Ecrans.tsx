/*
 * La bande des quatre écrans.
 *
 * C'est la section que la refonte a ajoutée, et elle remplace à elle seule le récit en
 * quatre « temps » qui occupait le milieu de la page. Le récit expliquait le produit ;
 * celle-ci le montre. Quatre captures, quatre titres, quatre lignes — et le lecteur a vu
 * l'application entière avant d'avoir lu cent mots.
 *
 * L'APPARIEMENT EST POSITIONNEL, et c'est la seule chose fragile ici : `ECRANS` donne
 * l'ordre des images, `contenu.ecrans.cartes` celui des légendes, et la n-ième légende
 * décrit la n-ième image. Deux listes, un seul ordre. `contenu.test.ts` vérifie qu'elles
 * ont la même longueur dans les cinq langues, et le type fige cette longueur à quatre —
 * mais rien ne peut vérifier qu'une légende décrit bien SON écran. Réordonner l'une sans
 * l'autre est la façon la plus discrète de casser cette section.
 *
 * Les cadres sont `aria-hidden` : le titre et la ligne qui les suivent disent déjà ce
 * qu'on y voit, et une capture pleine de texte incident annoncée juste avant sa propre
 * légende ferait entendre deux fois la même chose, dont une fois sans contexte.
 */
import { Cadre } from '../composants/Cadre.tsx'
import { Capture } from '../composants/Ecrans.tsx'
import { ECRANS } from '../contenu/captures.ts'
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Ecrans() {
  const contenu = useContenu()

  return (
    <section className="section bande-teintee" id="ecrans">
      <div className="bande">
        <Revele className="entete-bande">
          <h2>{contenu.ecrans.titre}</h2>
          <p className="entete-bande__note">{contenu.ecrans.note}</p>
        </Revele>

        <ul className="ecrans">
          {ECRANS.map((ecran, i) => {
            const carte = contenu.ecrans.cartes[i]
            return (
              <Revele key={ecran.nom} as="li" rang={i} className="ecrans__carte">
                <Cadre>
                  <Capture ecran={ecran.nom} />
                </Cadre>
                <h3 className="ecrans__titre">{carte.titre}</h3>
                <p className="ecrans__texte">{carte.texte}</p>
              </Revele>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
