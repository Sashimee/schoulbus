/*
 * Le récit : quatre temps, un téléphone qui reste.
 *
 * C'est la seule section où le défilement pilote autre chose qu'une apparition. Le
 * téléphone colle au milieu de l'écran, le texte défile à côté, et l'écran affiché
 * change quand le temps correspondant arrive au centre. Le mouvement dit ici quelque
 * chose qu'aucune image fixe ne dirait : que c'est le MÊME appareil d'un bout à l'autre,
 * et que ce qui change, c'est ce qu'on y regarde.
 *
 * Deux décisions structurent la mise en œuvre :
 *
 *  - Le changement d'écran est déclenché par `useInView` sur chaque temps, et non par un
 *    calcul de progression continue. Une progression donne des états intermédiaires —
 *    un écran à moitié remplacé — alors qu'un écran de téléphone est toujours l'un ou
 *    l'autre. L'observateur donne une bascule nette, et coûte trois fois moins cher.
 *
 *  - Sous 62 rem, le collant disparaît complètement et chaque temps reçoit sa propre
 *    vignette. Un téléphone dessiné DANS un téléphone réel ne raconte rien, et un
 *    élément collant sur un petit écran mange la moitié de la hauteur utile.
 */
import { AnimatePresence, m, useInView } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Appareil } from '../composants/Appareil.tsx'
import { Capture } from '../composants/Ecrans.tsx'
import type { NomEcran } from '../contenu/captures.ts'
import { useContenu } from '../i18n/contexte.ts'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'
import { Revele } from '../mouvement/Revele.tsx'

const SORTIE = [0.22, 0.61, 0.36, 1] as const

/**
 * Les quatre écrans, dans l'ordre du récit. Le même tableau sert au collant de bureau et
 * aux vignettes du petit écran : un temps ne peut pas montrer deux choses différentes
 * selon la largeur de la fenêtre.
 */
const ECRANS_RECIT: NomEcran[] = ['plan', 'assistant', 'aujourdhui', 'semaine']

/** Un temps du récit. Signale son entrée au centre de l'écran, et rien de plus. */
function Temps({
  index,
  titre,
  texte,
  onCentre,
}: {
  index: number
  titre: string
  texte: string
  onCentre: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Une bande étroite au milieu de la fenêtre : un temps devient courant quand il la
  // traverse, ce qui évite deux temps « actifs » en même temps sur un grand écran.
  const auCentre = useInView(ref, { margin: '-45% 0px -45% 0px' })

  /*
   * En effet, jamais pendant le rendu. Prévenir le parent depuis le corps de la
   * composante le ferait se rendre alors que celle-ci est encore en train de se rendre —
   * React le refuse, et la console se remplit avant que la page ne se fige.
   */
  useEffect(() => {
    if (auCentre) onCentre(index)
  }, [auCentre, index, onCentre])

  return (
    <div className="recit__temp" ref={ref}>
      <Revele rang={0} className="entete-section">
        <span className="recit__numero">
          {String(index + 1).padStart(2, '0')} / {String(ECRANS_RECIT.length).padStart(2, '0')}
        </span>
        <h3>{titre}</h3>
        <p className="texte-doux">{texte}</p>
      </Revele>

      {/* La vignette du petit écran : l'appareil collant n'existe pas ici. */}
      <div className="recit__vignette">
        <Appareil capture>
          <Capture ecran={ECRANS_RECIT[index]} />
        </Appareil>
      </div>
    </div>
  )
}

export function Recit() {
  const contenu = useContenu()
  const niveau = useNiveauMouvement()
  const [courant, setCourant] = useState(0)
  // Référence stable : sans elle, chaque rendu du récit donnerait une nouvelle fonction
  // aux quatre temps, et relancerait leurs effets pour rien.
  const changerCourant = useCallback((i: number) => setCourant(i), [])

  return (
    <section className="section recit">
      <div className="bande">
        <Revele className="entete-section">
          <span className="etiquette">{contenu.recit.etiquette}</span>
          <h2>{contenu.recit.titre}</h2>
          <p className="chapeau">{contenu.recit.chapeau}</p>
        </Revele>

        <div className="recit__grille">
          <div className="recit__appareil">
            <Appareil incline capture>
              {/*
               * Sans mouvement, PAS d'`AnimatePresence` du tout — et non un
               * `AnimatePresence` dont les animations seraient neutralisées.
               *
               * `mode="wait"` fait attendre la sortie de l'ancien écran avant de monter
               * le nouveau. Si cette sortie ne s'achève jamais — animations coupées,
               * onglet d'arrière-plan où les images sont suspendues — le changement
               * d'écran ne se produit plus du tout, et le récit reste bloqué sur sa
               * première vue en racontant les trois suivantes.
               */}
              {niveau === 'aucun' ? (
                <Capture ecran={ECRANS_RECIT[courant]} />
              ) : (
                /*
                 * `mode="wait"` : le nouvel écran n'entre qu'une fois l'ancien sorti.
                 * Deux écrans superposés dans un cadre de téléphone donnent une bouillie
                 * illisible pendant les 300 ms du croisement.
                 */
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={courant}
                    className="recit__vue"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.3, ease: SORTIE }}
                  >
                    <Capture ecran={ECRANS_RECIT[courant]} />
                  </m.div>
                </AnimatePresence>
              )}
            </Appareil>
          </div>

          <div className="recit__temps">
            {contenu.recit.temps.map((t, i) => (
              <Temps
                key={t.titre}
                index={i}
                titre={t.titre}
                texte={t.texte}
                onCentre={changerCourant}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
