/*
 * Le bandeau de chiffres.
 *
 * Quatre nombres, tous comptés — trois viennent des données de l'application par
 * `build-chiffres.mjs`, le quatrième est zéro. Aucun n'est un ordre de grandeur ni une
 * formule ; c'est la moindre des choses sur la page d'un projet dont le deuxième
 * principe est de dire ce qu'il ne sait pas.
 *
 * Le zéro porte une note, et elle n'est pas décorative. Il vaut pour les données de la
 * famille — adresse, prénoms, cycles — et pour elles seules. Deux choses sortent malgré
 * tout de l'appareil ; la note les nomme, sous la bande, sans attendre que le lecteur
 * aille les chercher dans les limites. Un chiffre juste qu'on laisse se relire de travers
 * est un chiffre faux.
 *
 * LA MAQUETTE DE LA REFONTE AVAIT PERDU CETTE NOTE. Elle est rétablie : la même page
 * énumère six limites dont la dernière dit exactement ce qui sort de l'appareil, et un
 * « 0 » en 32 px sans nuance à trois écrans de là aurait été la seule affirmation de la
 * vitrine que l'application ne tienne pas.
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
    { valeur: CHIFFRES.arrets, libelle: contenu.chiffres.arrets, zero: false },
    { valeur: CHIFFRES.villages, libelle: contenu.chiffres.villages, zero: false },
    { valeur: CHIFFRES.langues, libelle: contenu.chiffres.langues, zero: false },
    { valeur: CHIFFRES.donneesFamilleEnvoyees, libelle: contenu.chiffres.envoi, zero: true },
  ]

  return (
    <section className="section section--serree">
      <div className="bande">
        {/*
         * La grille en « filets » : l'écart d'un pixel entre les cellules laisse voir le
         * fond du conteneur, qui EST la ligne de séparation. Une bordure par cellule
         * doublerait chaque trait intérieur ; ici il n'y en a jamais qu'un, et il survit
         * au repli en deux puis une colonne sans qu'aucune règle ne le rattrape.
         */}
        <div className="chiffres" ref={ref}>
          {entrees.map((e, i) => (
            <Revele
              key={e.libelle}
              rang={i}
              className={`chiffre${e.zero ? ' chiffre--zero' : ''}`}
            >
              <div className="chiffre__valeur">
                <Compteur valeur={e.valeur} actif={compte} />
              </div>
              <div className="chiffre__libelle">{e.libelle}</div>
            </Revele>
          ))}
        </div>
        <Revele as="p" className="chiffres__note">
          {contenu.chiffres.envoiNote}
        </Revele>
      </div>
    </section>
  )
}
