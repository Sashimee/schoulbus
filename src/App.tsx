/*
 * L'assemblage de la page.
 *
 * L'ordre des sections est le propos du site, et il n'est pas celui d'une page de vente
 * ordinaire :
 *
 *   héros → chiffres → écrans → fonctions → principes → LIMITES → appel final
 *
 * Ce que le site ne sait pas faire vient AVANT qu'on demande à quiconque de l'ouvrir.
 * C'est l'ordre qu'a retenu l'application elle-même, et l'inverser aurait fait de cette
 * page une plaquette qui trahit le projet qu'elle présente. La refonte a retiré quatre
 * sections de cette liste ; celle des limites est restée exactement où elle était.
 *
 * CE QUI EN EST SORTI, et où c'est parti :
 *
 *   `Recit`           les quatre « temps » du matin → le héros les fait en une capture
 *                     et quatre annotations, et `Ecrans` montre le reste.
 *   `Confidentialite` → la carte sombre de `Principes`. Le schéma dessiné qui
 *                     l'accompagnait (`SchemaConfidentialite`) a été supprimé : une
 *                     illustration qui redit sa légende n'ajoute rien à qui lit, et
 *                     n'est rien du tout pour qui ne voit pas.
 *   `Langues`         le ruban des cinq langues → le sélecteur de l'en-tête en propose
 *                     désormais cinq. Une section qui démontrait ce que la commande d'à
 *                     côté faisait déjà.
 *   `HorsLigne`       → la carte claire de `Principes`.
 *
 * La mention d'indépendance a sa page (`pages/Independance.tsx`), atteignable depuis le
 * pied de page. Ce qu'elle disait de l'accueil, l'accueil continue de le dire — dans
 * l'étiquette du héros, dans le pied de page et dans la vignette de partage.
 *
 * `Fond` ET `Curseur` ONT DISPARU EUX AUSSI. Le premier peignait un dégradé, deux halos
 * et un nuage animé en WebGL ; la charte de la refonte pose une surface unie, et un
 * shader qui peint du crème uni est un shader qu'on maintient pour rien. Le second était
 * un curseur personnalisé, qui ne s'adressait qu'à la souris sur une page dont la moitié
 * des lecteurs sont sur un téléphone.
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
import { DefilementDoux } from './mouvement/DefilementDoux.tsx'
import { Rideau } from './sections/Rideau.tsx'
import { Entete } from './sections/Entete.tsx'
import { Hero } from './sections/Hero.tsx'
import { Chiffres } from './sections/Chiffres.tsx'
import { Ecrans } from './sections/Ecrans.tsx'
import { Fonctions } from './sections/Fonctions.tsx'
import { Principes } from './sections/Principes.tsx'
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

      <Rideau />
      <DefilementDoux />
      <Entete />

      <main id="contenu">
        <Hero />
        <Chiffres />
        <Ecrans />
        <Fonctions />
        <Principes />
        <Limites />
        <AppelFinal />
      </main>

      <PiedDePage />
    </LazyMotion>
  )
}
