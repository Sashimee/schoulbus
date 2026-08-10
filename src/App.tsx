/*
 * L'assemblage de la page.
 *
 * L'ordre des sections est le propos du site, et il n'est pas celui d'une page de vente
 * ordinaire :
 *
 *   héros → chiffres → récit → fonctions → confidentialité → langues → hors ligne
 *   → LIMITES → INDÉPENDANCE → appel final
 *
 * Ce que le site ne sait pas faire, et le fait qu'il n'engage que son auteur, viennent
 * AVANT qu'on demande à quiconque de l'ouvrir. C'est l'ordre qu'a retenu l'application
 * elle-même, et l'inverser aurait fait de cette page une plaquette qui trahit le projet
 * qu'elle présente.
 *
 * `LazyMotion` + `domAnimation` : la fabrique complète de `motion` pèse près du double,
 * et rien ici n'a besoin de la physique de projection ni du glisser-déposer.
 */
import { LazyMotion, domAnimation } from 'motion/react'
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
import { Independance } from './sections/Independance.tsx'
import { AppelFinal } from './sections/AppelFinal.tsx'
import { PiedDePage } from './sections/PiedDePage.tsx'

export function App() {
  const contenu = useContenu()

  return (
    <LazyMotion features={domAnimation} strict>
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
        <Independance />
        <AppelFinal />
      </main>

      <PiedDePage />
    </LazyMotion>
  )
}
