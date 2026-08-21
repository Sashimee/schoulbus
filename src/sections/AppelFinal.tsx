/*
 * L'appel final.
 *
 * Il rejoue le héros à l'envers : là-haut, l'heure ouvrait la démonstration ; ici, elle
 * la conclut. Même chasse fixe, mêmes nombres, et la page se referme sur l'image par
 * laquelle elle s'est ouverte — 07:25 à l'écran, départ à 07:45, quatre minutes de
 * marche, donc seize minutes avant de sortir.
 *
 * LE TITRE EST COUPÉ EN TROIS parce que son milieu est en corail. C'est le seul mot
 * coloré de toute la page, et il désigne le temps qui reste : la sémantique de la charte
 * en un seul endroit visible. Le découpage vit dans le contenu (`titreAvant`,
 * `titreAccent`, `titreApres`) plutôt que dans une balise glissée au milieu d'une chaîne,
 * pour deux raisons — pas de HTML dans un fichier de texte, et chaque langue place son
 * accent où sa grammaire le met. L'allemand ne met pas « sechzehn Minuten » à la place
 * où le français met « seize minutes ».
 *
 * Le QR n'apparaît pas sur téléphone : scanner un code affiché sur l'appareil qui doit
 * l'ouvrir n'a aucun sens, et le lien juste au-dessus fait déjà le travail.
 */
import { Bouton } from '../composants/Bouton.tsx'
import { APP_PUBLIEE, URL_APP, URL_SOURCE_OFFICIELLE } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function AppelFinal() {
  const contenu = useContenu()

  return (
    <section className="section" id="ouvrir">
      <div className="bande">
        <Revele className="final">
          <div className="final__texte">
            <span className="final__surtitre tabulaire">{contenu.final.surtitre}</span>

            <h2 className="final__titre">
              {contenu.final.titreAvant}
              <span className="final__accent">{contenu.final.titreAccent}</span>
              {contenu.final.titreApres}
            </h2>

            {APP_PUBLIEE ? (
              <>
                <p className="final__chapeau">{contenu.final.chapeau}</p>
                <div className="final__actions">
                  <Bouton href={URL_APP} variante="primaire" grand aimante externe>
                    {contenu.final.action}
                  </Bouton>
                </div>
                <div className="final__qr">
                  {/*
                   * Le QR est engendré à la construction (`scripts/build-qr.mjs`) plutôt
                   * que dans le navigateur : c'est une image fixe qui ne dépend que de
                   * `URL_APP`, et l'engendrer à l'ouverture coûterait une bibliothèque
                   * entière pour un dessin qui ne change jamais.
                   *
                   * L'adresse part de `BASE_URL` et non d'un chemin relatif : c'est la
                   * seule image que Vite n'écrit pas lui-même, et `./` la faisait chercher
                   * dans le dossier de la langue courante — donc absente partout sauf sur
                   * la page française, c'est-à-dire partout sauf là où on la relisait.
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
              </>
            ) : (
              /*
               * Sans appel à l'action, la page ne peut pas s'arrêter sur un blanc : après
               * six sections de démonstration, un silence se lit comme une panne.
               * L'annonce dit pourquoi il n'y a rien à ouvrir, et renvoie à la seule
               * source qui existe aujourd'hui — la même que celle citée par la page
               * « Indépendance », dont ce bouton emprunte le libellé (`independance.lien`).
               */
              <>
                <p className="final__chapeau">{contenu.final.bientot}</p>
                <div className="final__actions">
                  <Bouton
                    href={URL_SOURCE_OFFICIELLE}
                    variante="primaire"
                    grand
                    aimante
                    externe
                  >
                    {contenu.independance.lien}
                  </Bouton>
                  <span className="etiquette etiquette--bientot">{contenu.general.bientot}</span>
                </div>
              </>
            )}
          </div>

          {/*
           * La tuile de droite : l'heure du départ, telle qu'elle est dans la capture du
           * héros. Décorative — le titre à sa gauche vient de dire en toutes lettres
           * combien de temps il reste, et un lecteur d'écran qui annoncerait « 07:45 »
           * hors contexte ferait croire à un horaire réel, valable maintenant.
           */}
          <div className="final__tuile" aria-hidden="true">
            <span className="final__heure">{contenu.final.heure}</span>
            <span className="final__legende">{contenu.final.legendeHeure}</span>
          </div>
        </Revele>
      </div>
    </section>
  )
}
