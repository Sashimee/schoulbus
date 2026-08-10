/*
 * L'en-tête flottant.
 *
 * Il n'apparaît qu'une fois le héros dépassé. Tant qu'on est en haut de page, il ne
 * dirait rien que le héros ne dise déjà, et il mangerait la première chose qu'on
 * voulait montrer.
 *
 * La ligne de progression est cousue à son bord bas. Elle est mise à jour par `motion`
 * sans passer par l'état de React : `useScroll` renvoie une valeur de mouvement, que
 * `scaleX` consomme directement — un rendu par pixel défilé serait le travail le plus
 * cher de la page.
 */
import { m, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useState } from 'react'
import { Bouton } from '../composants/Bouton.tsx'
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { APP_PUBLIEE, URL_APP } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'

export function Entete() {
  const contenu = useContenu()
  const { scrollY, scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(false)

  // Un ressort plutôt que la valeur brute : au défilement doux, la barre suit sans
  // saccader, et à la molette brutale elle rattrape au lieu de sauter.
  const avancee = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useMotionValueEvent(scrollY, 'change', (y) => {
    // 60 % de la hauteur de fenêtre : assez bas pour que le héros ait été lu, assez haut
    // pour que l'en-tête soit là quand on en a besoin.
    const seuil = window.innerHeight * 0.6
    setVisible(y > seuil)
  })

  return (
    <header className="entete" data-visible={visible ? 'oui' : 'non'}>
      <a className="marque" href="#haut">
        <LogoBus className="marque__logo" />
        <span>{contenu.general.marque}</span>
      </a>

      <div className="entete__actions">
        <ChoixLangue />
        <ChoixTheme />
        {/*
         * Rien ne remplace le bouton ici. L'en-tête accompagne la lecture ; y afficher
         * « bientôt disponible » sur toute la hauteur de la page répéterait dix fois une
         * information que le héros et la section finale donnent déjà, chacune à leur place.
         */}
        {APP_PUBLIEE && (
          <Bouton href={URL_APP} variante="primaire" externe>
            {contenu.general.ouvrirApp}
          </Bouton>
        )}
      </div>

      {/*
       * Le seul `style` en ligne de la vitrine, et il n'en est pas vraiment un : ce
       * n'est pas une valeur de charte mais une valeur de mouvement, que `motion` écrit
       * lui-même hors du cycle de rendu. La passer par une classe supposerait un rendu
       * de React à chaque pixel défilé.
       */}
      <m.div className="progression" style={{ scaleX: avancee }} aria-hidden="true" />
    </header>
  )
}
