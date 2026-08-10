/*
 * Le rideau d'ouverture.
 *
 * Il ne dure que 1,1 s, et il ne se montre qu'une fois par session. Un rideau qui rejoue
 * à chaque retour sur la page devient un péage : la deuxième fois, on ne le regarde
 * plus, on l'attend.
 *
 * Il ne retarde rien non plus. Le contenu est déjà rendu dessous — pré-rendu, même : le
 * rideau se lève sur une page complète. S'il échouait à se lever (JavaScript coupé en
 * plein vol), il ne serait jamais monté, puisqu'il n'existe que côté navigateur.
 */
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { LogoBus } from '../composants/LogoBus.tsx'
import { useContenu } from '../i18n/contexte.ts'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'

const CLE_SESSION = 'vitrine-schoulbus.rideau-vu'

export function Rideau() {
  const contenu = useContenu()
  const niveau = useNiveauMouvement()
  const [ouvert, setOuvert] = useState(false)

  useEffect(() => {
    if (niveau === 'aucun') return
    try {
      if (sessionStorage.getItem(CLE_SESSION)) return
      sessionStorage.setItem(CLE_SESSION, '1')
    } catch {
      // Stockage refusé : le rideau se montrera à chaque visite. Ennuyeux, pas cassé.
    }
    setOuvert(true)
    const minuterie = setTimeout(() => setOuvert(false), 1100)
    return () => clearTimeout(minuterie)
  }, [niveau])

  return (
    <AnimatePresence>
      {ouvert && (
        <m.div
          className="rideau"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.38, ease: [0.22, 0.61, 0.36, 1] } }}
        >
          <LogoBus className="rideau__logo" variante="trace" />
          <m.span
            className="marque"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {contenu.general.marque}
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  )
}
