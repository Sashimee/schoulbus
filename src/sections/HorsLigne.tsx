/*
 * Hors ligne.
 *
 * L'illustration est une barre de signal dont les traits tombent l'un après l'autre,
 * pendant que l'heure, elle, ne bouge pas. C'est exactement l'argument de la section, et
 * il tient en deux secondes de mouvement : le réseau part, l'information reste.
 *
 * Les barres sont animées en `scaleY` depuis leur base — jamais en `height`, qui ferait
 * remettre en page la section entière soixante fois par seconde.
 */
import { m } from 'motion/react'
import { Bouton } from '../composants/Bouton.tsx'
import { Icone } from '../composants/Icones.tsx'
import { URL_INSTALLER } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'
import { Revele } from '../mouvement/Revele.tsx'

/* Quatre traits. Leurs hauteurs sont dans `sections.css` ; ici, seul leur rang compte. */
const BARRES = [0, 1, 2, 3]

export function HorsLigne() {
  const contenu = useContenu()
  const niveau = useNiveauMouvement()
  const bouge = niveau !== 'aucun'

  return (
    <section className="section" id="hors-ligne">
      <div className="bande horsligne__grille">
        <div>
          <Revele className="entete-section">
            <span className="etiquette">{contenu.horsligne.etiquette}</span>
            <h2>{contenu.horsligne.titre}</h2>
            <p className="chapeau">{contenu.horsligne.chapeau}</p>
          </Revele>

          <ul className="pile pile--3 horsligne__points">
            {contenu.horsligne.points.map((p, i) => (
              <Revele key={p} as="li" rang={i} className="rangee">
                <span className="puce">
                  <Icone nom={i === 0 ? 'telecharger' : 'appareil'} />
                </span>
                <span>{p}</span>
              </Revele>
            ))}
          </ul>

          <div className="horsligne__action">
            <Bouton href={URL_INSTALLER} variante="discret" externe>
              {contenu.horsligne.action}
            </Bouton>
          </div>
        </div>

        <Revele geste="glisse">
          <div className="carte pile pile--4">
            <div className="rangee">
              <div className="signal" aria-hidden="true">
                {BARRES.map((rang) => (
                  <m.span
                    key={rang}
                    className="signal__barre"
                    initial={bouge ? { scaleY: 1, opacity: 1 } : false}
                    whileInView={{ scaleY: 0.14, opacity: 0.3 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{
                      // Les barres tombent de la plus haute à la plus basse : c'est
                      // l'ordre dans lequel un réseau disparaît réellement.
                      delay: 0.3 + (BARRES.length - 1 - rang) * 0.16,
                      duration: 0.34,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  />
                ))}
              </div>
              <span className="etiquette etiquette--attention">
                {contenu.horsligne.legendeSignal}
              </span>
            </div>

            {/* L'heure ne bouge pas. C'est tout le propos. */}
            <div className="ecran__prochain">
              <span className="ecran__heure" aria-hidden="true">
                07:12
              </span>
              <span className="ecran__signal" aria-hidden="true" />
            </div>
          </div>
        </Revele>
      </div>
    </section>
  )
}
