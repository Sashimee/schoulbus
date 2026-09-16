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
 *
 * IL NE SE MONTRE QU'AU NIVEAU `complet`, et non « partout sauf quand on demande de
 * réduire ». Il couvrait auparavant 1,48 s de contenu déjà peint sur TOUT téléphone,
 * puisqu'un appareil tactile vaut `reduit` : le pré-rendu servait une page lisible, et le
 * navigateur la cachait aussitôt derrière un logo. C'est la même règle que le défilement
 * doux et le curseur, qui s'abstiennent déjà à ce niveau-là — une décoration d'ouverture
 * appartient à la machine qui peut se l'offrir.
 */
import { useEffect, useState } from 'react'
import { LogoBus } from '../composants/LogoBus.tsx'
import { useContenu } from '../i18n/contexte.ts'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'

const CLE_SESSION = 'vitrine-schoulbus.rideau-vu'

/*
 * 1,1 s de rideau, puis 380 ms pour s'effacer. Les deux durées étaient écrites dans les
 * accessoires de `motion` ; elles sont maintenant ici et dans `sections.css`, et elles
 * doivent rester d'accord — `rideau-sortie` dure ce que dit `SORTIE`.
 */
const AFFICHAGE = 1100
const SORTIE = 380

export function Rideau() {
  const contenu = useContenu()
  const niveau = useNiveauMouvement()
  const [ouvert, setOuvert] = useState(false)
  const [sort, setSort] = useState(false)

  useEffect(() => {
    if (niveau !== 'complet') return
    try {
      if (sessionStorage.getItem(CLE_SESSION)) return
      sessionStorage.setItem(CLE_SESSION, '1')
    } catch {
      // Stockage refusé : le rideau se montrera à chaque visite. Ennuyeux, pas cassé.
    }
    setOuvert(true)
    const depart = setTimeout(() => setSort(true), AFFICHAGE)
    const fin = setTimeout(() => setOuvert(false), AFFICHAGE + SORTIE)
    return () => {
      clearTimeout(depart)
      clearTimeout(fin)
    }
  }, [niveau])

  if (!ouvert) return null

  return (
    <div className={`rideau${sort ? ' rideau--sort' : ''}`}>
      <LogoBus className="rideau__logo" variante="trace" />
      <span className="marque rideau__marque">{contenu.general.marque}</span>
    </div>
  )
}
