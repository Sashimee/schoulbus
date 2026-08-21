/*
 * L'en-tête.
 *
 * IL EST LÀ DÈS LE PREMIER PIXEL, désormais. Il ne se montrait qu'une fois le héros
 * dépassé, au motif qu'en haut de page il ne dirait rien que le héros ne dise déjà. Le
 * héros de la refonte commence par une capture, pas par une marque : sans en-tête, la
 * page s'ouvrait sur une photo d'écran sans que rien ne nomme le site auquel elle
 * appartient. Il est collant, translucide et flouté, et il porte la seule chose qu'on
 * puisse vouloir à tout moment — la langue.
 *
 * LA BARRE DE PROGRESSION A DISPARU. Elle était cousue au bord bas et mise à jour par
 * `motion` hors du cycle de React, et c'était le SEUL `style={{ … }}` en ligne de toute
 * la vitrine — une exception documentée, qui n'a plus lieu d'être. La page a perdu quatre
 * sections : elle fait aujourd'hui la moitié de sa longueur, et une jauge d'avancement
 * sur une page qui tient en six écrans mesure quelque chose que personne ne se demandait.
 *
 * L'étiquette « bientôt disponible » est un ÉTAT, pas un bouton : ni survol, ni cible
 * cliquable. Elle remplace le bouton d'ouverture tant que `APP_PUBLIEE` vaut `false`, et
 * c'est la seule chose de l'en-tête qui change avec l'interrupteur.
 */
import { Bouton } from '../composants/Bouton.tsx'
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { APP_PUBLIEE, URL_APP } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'

export function Entete() {
  const contenu = useContenu()

  return (
    <header className="entete">
      <a className="marque" href="#haut">
        <LogoBus className="marque__logo" />
        <span className="marque__nom">{contenu.general.marque}</span>
      </a>

      <div className="entete__actions">
        <ChoixLangue />
        <ChoixTheme />
        {APP_PUBLIEE ? (
          <Bouton href={URL_APP} variante="primaire" externe>
            {contenu.general.ouvrirApp}
          </Bouton>
        ) : (
          <span className="etiquette etiquette--bientot etiquette--entete">
            {contenu.general.bientot}
          </span>
        )}
      </div>
    </header>
  )
}
