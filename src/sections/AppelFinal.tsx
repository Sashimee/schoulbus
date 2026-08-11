/*
 * L'appel final.
 *
 * Il rejoue le héros à l'envers : là-haut, l'heure était une promesse ; ici, elle est une
 * conclusion. Même composition, même chasse fixe, même point qui bat — la page se referme
 * sur l'image par laquelle elle s'est ouverte.
 *
 * Le QR n'apparaît pas sur téléphone : scanner un code affiché sur l'appareil qui doit
 * l'ouvrir n'a aucun sens, et le lien juste au-dessus fait déjà le travail.
 */
import { m } from 'motion/react'
import { Bouton } from '../composants/Bouton.tsx'
import { APP_PUBLIEE, URL_APP, URL_SOURCE_OFFICIELLE } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function AppelFinal() {
  const contenu = useContenu()
  const niveau = useNiveauMouvement()

  return (
    <section className="section" id="ouvrir">
      <div className="bande bande--moyen final">
        <Revele>
          <span className="etiquette">{contenu.final.surtitre}</span>
        </Revele>

        <m.span
          className="final__heure"
          aria-hidden="true"
          initial={niveau === 'aucun' ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          // La courbe à ressort, celle que la bibliothèque de mouvement réserve aux
          // confirmations. C'en est une : la page a fini de démontrer.
          transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {contenu.final.heure}
        </m.span>

        <Revele rang={1}>
          <h2>{contenu.final.titre}</h2>
          <p className="chapeau final__chapeau">{contenu.final.chapeau}</p>
        </Revele>

        {APP_PUBLIEE ? (
          <>
            <Revele rang={2}>
              <Bouton href={URL_APP} variante="primaire" grand aimante externe>
                {contenu.final.action}
              </Bouton>
            </Revele>

            <Revele rang={3}>
              <div className="final__qr">
                {/*
                 * Le QR est engendré à la construction (`scripts/build-qr.mjs`) plutôt que
                 * dans le navigateur : c'est une image fixe qui ne dépend que de `URL_APP`,
                 * et l'engendrer à l'ouverture coûterait une bibliothèque entière pour un
                 * dessin qui ne change jamais.
                 *
                 * L'adresse part de `BASE_URL` et non d'un chemin relatif : c'est la seule
                 * image que Vite n'écrit pas lui-même, et `./` la faisait chercher dans le
                 * dossier de la langue courante — donc absente sur `/de/` et sur `/lb/`,
                 * c'est-à-dire partout sauf là où on la relisait.
                 */}
                <img
                  className="qr"
                  src={`${import.meta.env.BASE_URL}qr-application.svg`}
                  alt=""
                  width="148"
                  height="148"
                />
                <span className="texte-doux">{contenu.final.qr}</span>
              </div>
            </Revele>
          </>
        ) : (
          /*
           * Sans appel à l'action, la page ne peut pas s'arrêter sur un blanc : après dix
           * écrans de démonstration, un silence se lit comme une panne. L'annonce dit
           * pourquoi il n'y a rien à ouvrir, et renvoie à la seule source qui existe
           * aujourd'hui — la même que celle citée par la page « Indépendance », dont ce
           * bouton emprunte d'ailleurs le libellé (`independance.lien`).
           */
          <Revele rang={2}>
            <div className="final__bientot">
              <span className="etiquette etiquette--accent">{contenu.general.bientot}</span>
              <p className="texte-doux">{contenu.final.bientot}</p>
              {/*
               * Un `Bouton` et non un lien dans le texte : c'est désormais la seule chose
               * qu'on puisse faire au bas de cette page, et un lien de 25 px de haut est
               * sous la cible de 44 px que le projet s'impose. La variante « fantôme » lui
               * garde l'allure d'un lien.
               */}
              <Bouton href={URL_SOURCE_OFFICIELLE} variante="fantome" externe>
                {contenu.independance.lien}
              </Bouton>
            </div>
          </Revele>
        )}
      </div>
    </section>
  )
}
