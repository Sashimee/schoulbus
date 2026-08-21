/*
 * Le cadre d'une capture.
 *
 * Ce qu'il a remplacé : `Appareil`, un téléphone dessiné — encoche, bords, deux lueurs
 * peintes sous l'écran, et un basculement de 5° qui suivait le pointeur.
 *
 * Il est parti pour une raison qui se voit une fois qu'on l'a vue : la capture MONTRE
 * déjà un téléphone. Elle est prise à 370 × 824, avec la barre de navigation de
 * l'application en bas et son en-tête en haut ; l'entourer d'un second téléphone dessiné
 * revenait à photographier un téléphone et à coller la photo dans un autre téléphone. Le
 * basculement, lui, coûtait un `pointermove` global et une image par seconde de rendu
 * pour incliner une image de 4 % — sur une page dont le propos est qu'il n'y a rien à
 * chercher, c'était la seule chose qui bougeait sans rien dire.
 *
 * Ce qui reste est ce que la maquette demande : une surface claire, un filet, dix pixels
 * de marge, et une ombre très basse. Une carte posée sur du papier.
 *
 * `aria-hidden` est conservé, et l'argument n'a pas bougé : tout ce que la capture montre
 * est écrit en toutes lettres à côté d'elle. Un lecteur d'écran qui la traverserait
 * entendrait « 07:45, dans 16 min, Hovelange · Kneppchen » hors contexte, juste avant de
 * lire les mêmes valeurs annotées une par une. LA SEULE EXCEPTION est la capture du
 * héros, qui n'a pas de texte équivalent au-dessus d'elle et porte donc une vraie
 * description — d'où `alt`.
 */
import type { ReactNode } from 'react'

export function Cadre({
  children,
  /**
   * La description de l'image, quand il y en a une à donner.
   *
   * Fournie : le cadre est un `<figure>` annoncé, et c'est `Capture` qui porte le texte.
   * Absente : le cadre entier est décoratif, parce que son voisinage le dit déjà.
   */
  decrit = false,
  /** Le halo du héros, qui décolle la capture du fond. Nulle part ailleurs. */
  halo = false,
}: {
  children: ReactNode
  decrit?: boolean
  halo?: boolean
}) {
  return (
    <figure className={`cadre${halo ? ' cadre--halo' : ''}`} {...(decrit ? {} : { 'aria-hidden': true })}>
      {halo && <span className="cadre__halo" aria-hidden="true" />}
      <span className="cadre__vitre">{children}</span>
    </figure>
  )
}
