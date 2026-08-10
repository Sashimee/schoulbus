/*
 * Le bandeau de chiffres.
 *
 * Quatre nombres, tous comptés — trois viennent des données de l'application par
 * `build-chiffres.mjs`, le quatrième est zéro. Aucun n'est un ordre de grandeur ni une
 * formule ; c'est la moindre des choses sur la page d'un projet dont le deuxième
 * principe est de dire ce qu'il ne sait pas.
 *
 * Le décompte s'arrête à la première valeur atteinte et ne rejoue pas. Un compteur qui
 * repart à chaque passage devant lui transforme un fait en animation.
 */
import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CHIFFRES } from '../contenu/chiffres.ts'
import { useContenu } from '../i18n/contexte.ts'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'
import { Revele } from '../mouvement/Revele.tsx'

function Compteur({ valeur, actif }: { valeur: number; actif: boolean }) {
  const [affiche, setAffiche] = useState(actif ? 0 : valeur)

  useEffect(() => {
    if (!actif) {
      setAffiche(valeur)
      return
    }
    const controles = animate(0, valeur, {
      duration: 1.1,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setAffiche(Math.round(v)),
    })
    return () => controles.stop()
  }, [valeur, actif])

  return <>{affiche}</>
}

export function Chiffres() {
  const contenu = useContenu()
  const niveau = useNiveauMouvement()
  const ref = useRef<HTMLDivElement>(null)
  const vu = useInView(ref, { once: true, amount: 0.5 })
  const compte = niveau !== 'aucun' && vu

  const entrees = [
    { valeur: CHIFFRES.arrets, libelle: contenu.chiffres.arrets },
    { valeur: CHIFFRES.villages, libelle: contenu.chiffres.villages },
    { valeur: CHIFFRES.langues, libelle: contenu.chiffres.langues },
    { valeur: CHIFFRES.donneesEnvoyees, libelle: contenu.chiffres.envoi },
  ]

  return (
    <section className="section section--serree">
      <div className="bande">
        <div className="chiffres" ref={ref}>
          {entrees.map((e, i) => (
            <Revele key={e.libelle} rang={i}>
              <div className="chiffre__valeur">
                <Compteur valeur={e.valeur} actif={compte} />
              </div>
              <div className="chiffre__libelle">{e.libelle}</div>
            </Revele>
          ))}
        </div>
      </div>
    </section>
  )
}
