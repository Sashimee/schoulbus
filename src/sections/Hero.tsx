/*
 * Le héros.
 *
 * CE QU'IL FAIT, ET CE QU'IL A CESSÉ DE FAIRE
 * -------------------------------------------
 * Il portait une phrase, une heure géante en chasse fixe, et un téléphone incliné. Trois
 * choses qui disaient la même : « le site montre une heure ». La refonte n'en garde
 * qu'une seule — la capture — et lui adjoint quatre annotations qui NOMMENT ce qu'on y
 * voit. L'heure géante répétait en 6 rem un nombre déjà lisible à deux centimètres de
 * là, dans la vraie interface ; c'est la répétition qui est partie, pas l'heure.
 *
 * La conséquence est une règle : CHAQUE VALEUR DE GAUCHE EST LISIBLE DANS LA CAPTURE.
 * `07:45`, `16 min`, `Kneppchen`, `Léa · Noah` s'y trouvent tous les quatre. Le lecteur
 * a l'écran sous les yeux pendant qu'il lit la ligne — une valeur inventée ici ne serait
 * pas une approximation, ce serait une contradiction visible.
 *
 * L'ENTRÉE RESTE EN CSS PURE, et c'est toujours la seule section dans ce cas. Ailleurs,
 * une apparition ratée coûte une carte ; ici, elle coûterait le titre de la page. Une
 * animation confiée à JavaScript laisse son élément dans l'état de départ tant que le
 * script n'a pas tourné — invisible dans un onglet d'arrière-plan, où les images
 * d'animation sont suspendues, et invisible tout court sans scripts.
 *
 * Le titre reste un `<h1>` d'un seul tenant pour les technologies d'assistance : les
 * fenêtres et les décalages sont des `<span>` à l'intérieur, et le texte se lit d'une
 * traite.
 */
import { Fragment } from 'react'
import { Bouton } from '../composants/Bouton.tsx'
import { Cadre } from '../composants/Cadre.tsx'
import { Capture } from '../composants/Ecrans.tsx'
import { APP_PUBLIEE, URL_APP, URL_LIMITES, URL_SOURCE_OFFICIELLE } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'

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

  return (
    <section className="heros" id="haut">
      <div className="bande heros__grille">
        <div className="heros__appareil">
          <Cadre decrit halo>
            {/* Son avance vient des deux `<link rel="preload">` conditionnels posés par
                `entree-serveur.ts`, pas d'un attribut sur l'image — voir `Ecrans.tsx`. */}
            <Capture ecran="aujourdhui" alt={contenu.heros.altCapture} />
          </Cadre>
        </div>

        <div className="heros__texte">
          <span className="etiquette etiquette--calme">{contenu.heros.etiquette}</span>

          <h1 className="heros__titre">
            {contenu.heros.titre.map((ligne) => (
              <LigneTitre key={ligne} texte={ligne} />
            ))}
          </h1>

          {/*
           * Une liste de définitions serait le balisage le plus juste sur le papier —
           * `07:45` définit « l'heure de son bus ». Mais `<dl>` en grille impose
           * `display: contents` sur chaque couple pour que les colonnes s'alignent, et
           * Safari retire encore la sémantique des éléments ainsi déclarés. Une liste de
           * couples explicites, où la valeur et sa glose sont deux `<span>` frères, se
           * lit correctement partout — et l'ordre de lecture y est celui de l'écran.
           */}
          <ul className="heros__lignes">
            {contenu.heros.lignes.map((ligne) => (
              <li key={ligne.valeur} className="heros__ligne">
                <span
                  className={`heros__valeur${ligne.compte ? ' heros__valeur--compte' : ''}`}
                >
                  {/*
                   * Le point ne bat que sous les huit minutes, et la maquette de
                   * démonstration en affiche seize : il est donc ici à l'arrêt, comme il
                   * l'est dans la capture d'à côté. C'est le même signal que dans
                   * l'application, et il doit dire la même chose au même moment.
                   */}
                  {ligne.compte && <span className="heros__point" aria-hidden="true" />}
                  {ligne.valeur}
                </span>
                <span className="heros__glose">{ligne.texte}</span>
              </li>
            ))}
          </ul>

          {/*
           * Tant que l'application n'est pas publique, une annonce accompagne le lien vers
           * le plan officiel — et non un bouton grisé. Un bouton désactivé reste un bouton :
           * il appelle le geste, puis le refuse. Une étiquette ne le demande pas.
           */}
          <div className="heros__actions">
            {APP_PUBLIEE ? (
              <>
                <Bouton href={URL_APP} variante="primaire" grand aimante externe>
                  {contenu.heros.actionPrincipale}
                </Bouton>
                <Bouton href={URL_LIMITES} variante="discret" grand externe>
                  {contenu.heros.actionSecondaire}
                </Bouton>
              </>
            ) : (
              <>
                {/*
                 * Le seul chemin que la page propose quand l'application n'est pas
                 * joignable : le document officiel de la commune. C'est ce que le
                 * paragraphe de l'appel final annonce, et c'est le même libellé —
                 * `independance.lien` est partagé entre les deux, exprès.
                 */}
                <Bouton href={URL_SOURCE_OFFICIELLE} variante="primaire" grand aimante externe>
                  {contenu.independance.lien}
                </Bouton>
                <span className="etiquette etiquette--bientot">{contenu.general.bientot}</span>
              </>
            )}
          </div>

          <p className="heros__legende tabulaire">{contenu.heros.legende}</p>
        </div>
      </div>
    </section>
  )
}
