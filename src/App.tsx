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
 * `motion` A DISPARU LUI AUSSI, le 16 septembre 2026. Il ne lui restait que trois
 * emplois — la révélation au défilement, le décompte de la bande de chiffres et le
 * rideau — et tous trois tiennent en CSS, avec un `IntersectionObserver` pour savoir
 * quand partir. `LazyMotion` chargeait ses fonctionnalités après le premier rendu, mais
 * son noyau, lui, partait avec la page : vingt-cinq kilo-octets comprimés du premier
 * écran, pour une page qu'on lit une fois.
 */
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

export function App() {
  const contenu = useContenu()

  return (
    <>
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
    </>
  )
}
