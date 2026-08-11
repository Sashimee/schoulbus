/*
 * Le héros.
 *
 * Trois choses s'y passent, dans cet ordre de priorité :
 *
 *  1. Une phrase dit ce que fait le site. Elle se révèle mot à mot, chaque mot sortant
 *     d'une fenêtre qui le rogne — le geste le plus ancien de la typographie animée, et
 *     le seul qui laisse une phrase lisible pendant qu'elle arrive.
 *  2. Une heure géante, en chasse fixe, avec le point qui bat de l'application. C'est le
 *     sujet du produit, montré plutôt qu'annoncé.
 *  3. Un téléphone où tourne l'écran du matin.
 *
 * TOUTE l'entrée de cette section est en CSS (voir `sections.css`), et c'est la seule de
 * la page dans ce cas. Ailleurs, une apparition ratée coûte une carte ; ici, elle
 * coûterait le titre de la page. Une animation confiée à JavaScript laisse son élément
 * dans l'état de départ tant que le script n'a pas tourné — invisible dans un onglet
 * d'arrière-plan, où les images d'animation sont suspendues, et invisible tout court
 * sans scripts. Le pré-rendu existe pour que la page se lise sans eux.
 *
 * Le titre reste un `<h1>` d'un seul tenant pour les technologies d'assistance : les
 * fenêtres et les décalages sont des `<span>` à l'intérieur, et le texte se lit d'une
 * traite.
 */
import { Fragment } from 'react'
import { Appareil } from '../composants/Appareil.tsx'
import { Bouton } from '../composants/Bouton.tsx'
import { Capture } from '../composants/Ecrans.tsx'
import { APP_PUBLIEE, URL_APP, URL_LIMITES } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'
import { useBrouillage } from '../mouvement/useBrouillage.ts'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'

/**
 * Une ligne de titre, découpée en mots masqués.
 *
 * L'espace est placé HORS de `.mot` : à l'intérieur, il tomberait sous l'`overflow:
 * hidden` du masque, et tous les mots de la ligne se toucheraient.
 */
function LigneTitre({ texte }: { texte: string }) {
  const mots = texte.split(' ')

  return (
    <span className="ligne-titre">
      {mots.map((mot, i) => (
        <Fragment key={`${mot}-${i}`}>
          <span className="mot">
            <span>{mot}</span>
          </span>
          {i < mots.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}

export function Hero() {
  const contenu = useContenu()
  const niveau = useNiveauMouvement()
  const heure = useBrouillage(contenu.heros.heure, niveau !== 'aucun')

  return (
    <section className="heros" id="haut">
      <div className="bande heros__grille">
        <div className="heros__texte">
          <span className="etiquette etiquette--accent">{contenu.heros.etiquette}</span>

          <h1 className="heros__titre">
            {contenu.heros.titre.map((ligne) => (
              <LigneTitre key={ligne} texte={ligne} />
            ))}
          </h1>

          <p className="chapeau">{contenu.heros.chapeau}</p>

          <div className="heros__horloge">
            {/*
             * L'heure est un exemple, pas la vôtre : `aria-hidden` sur le nombre, et la
             * légende dit à côté ce qu'il représente. Un lecteur d'écran qui annoncerait
             * « sept heures douze » ferait croire à un horaire réel.
             */}
            <span className="heros__heure" aria-hidden="true">
              {heure}
            </span>
            <span className="ecran__signal" aria-hidden="true" />
            <span className="heros__legende">
              <strong>{contenu.heros.legendeTitre}</strong>
              <span className="texte-doux">{contenu.heros.legendeDetail}</span>
            </span>
          </div>

          {/*
           * Tant que l'application n'est pas publique, une annonce prend la place des deux
           * boutons — et non un bouton grisé. Un bouton désactivé reste un bouton : il
           * appelle le geste, puis le refuse. Une étiquette ne le demande pas.
           */}
          {APP_PUBLIEE ? (
            <div className="heros__actions">
              <Bouton href={URL_APP} variante="primaire" grand aimante externe>
                {contenu.heros.actionPrincipale}
              </Bouton>
              <Bouton href={URL_LIMITES} variante="discret" grand externe>
                {contenu.heros.actionSecondaire}
              </Bouton>
            </div>
          ) : (
            <div className="heros__actions">
              <span className="etiquette etiquette--accent">{contenu.general.bientot}</span>
            </div>
          )}
        </div>

        <div className="heros__appareil">
          <Appareil incline capture>
            {/* Son avance vient des deux `<link rel="preload">` conditionnels posés par
                `entree-serveur.ts`, pas d'un attribut sur l'image — voir `Ecrans.tsx`. */}
            <Capture ecran="aujourdhui" />
          </Appareil>
        </div>
      </div>

      <div className="heros__invite" aria-hidden="true">
        <span>{contenu.heros.invite}</span>
        <span className="heros__invite-trait" />
      </div>
    </section>
  )
}
