/*
 * L'assemblage de la page.
 *
 * L'ordre des sections est le propos du site, et il n'est pas celui d'une page de vente
 * ordinaire :
 *
 *   héros → chiffres → récit → fonctions → confidentialité → langues → hors ligne
 *   → LIMITES → appel final
 *
 * Ce que le site ne sait pas faire vient AVANT qu'on demande à quiconque de l'ouvrir.
 * C'est l'ordre qu'a retenu l'application elle-même, et l'inverser aurait fait de cette
 * page une plaquette qui trahit le projet qu'elle présente.
 *
 * La mention d'indépendance tenait naguère sa propre section, ici, entre les limites et
 * l'appel final. Elle a sa page désormais (`pages/Independance.tsx`), atteignable depuis
 * le pied de page. Ce qu'elle disait de l'accueil, l'accueil continue de le dire — dans
 * l'étiquette du héros, dans le pied de page et dans la vignette de partage.
 *
 * `LazyMotion` + `domAnimation` : la fabrique complète de `motion` pèse près du double,
 * et rien ici n'a besoin de la physique de projection ni du glisser-déposer.
 *
 * Les fonctionnalités sont en outre chargées APRÈS le premier rendu, et non avec lui.
 * Elles ne servent à personne tant que le niveau de mouvement vaut 'aucun' — ce qu'il
 * vaut toujours au premier rendu, des deux côtés de l'hydratation — et la page est
 * entièrement pré-rendue : rien n'attend une animation pour être lisible.
 */
import { LazyMotion } from 'motion/react'
import { useContenu } from './i18n/contexte.ts'
import { Fond } from './mouvement/Fond.tsx'
import { Curseur } from './mouvement/Curseur.tsx'
import { DefilementDoux } from './mouvement/DefilementDoux.tsx'
import { Rideau } from './sections/Rideau.tsx'
import { Entete } from './sections/Entete.tsx'
import { Hero } from './sections/Hero.tsx'
import { Chiffres } from './sections/Chiffres.tsx'
import { Recit } from './sections/Recit.tsx'
import { Fonctions } from './sections/Fonctions.tsx'
import { Confidentialite } from './sections/Confidentialite.tsx'
import { Langues } from './sections/Langues.tsx'
import { HorsLigne } from './sections/HorsLigne.tsx'
import { Limites } from './sections/Limites.tsx'
import { AppelFinal } from './sections/AppelFinal.tsx'
import { PiedDePage } from './sections/PiedDePage.tsx'

const chargerFonctions = () => import('./mouvement/fonctions-motion.ts').then((m) => m.default)

export function App() {
  const contenu = useContenu()

  return (
    <LazyMotion features={chargerFonctions} strict>
      <a className="saut-contenu" href="#contenu">
        {contenu.general.sautContenu}
      </a>

      <Fond />
      <Rideau />
      <Curseur />
      <DefilementDoux />
      <Entete />

      <main id="contenu">
        <Hero />
        <Chiffres />
        <Recit />
        <Fonctions />
        <Confidentialite />
        <Langues />
        <HorsLigne />
        <Limites />
        <AppelFinal />
      </main>

      <PiedDePage />
    </LazyMotion>
  )
}
