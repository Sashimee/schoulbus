/*
 * Les deux commandes de la page : la langue et le thème.
 *
 * LA LANGUE EST UNE LISTE DÉROULANTE, plus un rail de cinq segments. Le rail tenait
 * tant que la barre n'avait rien d'autre à porter ; le jour où l'application a été
 * publiée, le bouton « Ouvrir l'application » est revenu dans l'en-tête et les cinq
 * segments sont passés à la ligne — « FR DE LB PT » sur une rangée, « EN » toute seule
 * sur la suivante, le soleil et le croissant empilés à côté. Une liste occupe la largeur
 * d'UN choix au lieu de cinq, et c'est la seule des deux commandes qui pouvait maigrir :
 * le thème n'a que deux états, et les afficher côte à côte les rend comparables.
 *
 * C'est un `<select>` natif, et non un menu dessiné ici. Il s'ouvre au clavier, se
 * parcourt aux flèches, annonce l'option choisie, et sur téléphone il ouvre la roue du
 * système — celle que la personne a déjà manipulée ailleurs. Un menu maison demanderait
 * de réécrire tout cela, et c'est précisément là que se logent les défauts
 * d'accessibilité qu'aucun test de cette taille ne rattrape.
 *
 * Ce que le changement ne touche pas : la commande agit toujours DANS la page, sans la
 * quitter (voir `Fournisseur.tsx`), et le nom du groupe reste porté — sans lui, un
 * lecteur d'écran annonce « FR » sans dire de quoi il s'agit.
 *
 * Le thème, lui, reste deux segments à icônes : un soleil et un croissant se comprennent
 * sans être lus, ce qui vaut mieux qu'un mot à traduire cinq fois dans une barre où la
 * place manque. Le mot ne disparaît pas, il change de place — il devient le nom
 * accessible du bouton et son infobulle.
 */
import { Icone } from './Icones.tsx'
import { LANGUES, useLangue } from '../i18n/contexte.ts'
import type { Langue } from '../contenu/type.ts'
import { useTheme, type Theme } from '../theme.ts'
import { useContenu } from '../i18n/contexte.ts'

export function ChoixLangue() {
  const { langue, changerLangue } = useLangue()
  const contenu = useContenu()

  return (
    <div className="liste-langue">
      <select
        className="liste-langue__champ"
        aria-label={contenu.general.choixLangue}
        value={langue}
        onChange={(evenement) => void changerLangue(evenement.target.value as Langue)}
      >
        {LANGUES.map((l) => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>
      <Icone nom="chevron" className="liste-langue__chevron" />
    </div>
  )
}

export function ChoixTheme() {
  const [theme, changer] = useTheme()
  const contenu = useContenu()

  // « Auto » n'est pas offert comme troisième bouton : il est l'état de départ, et un
  // troisième segment pour « ne pas choisir » embrouille plus qu'il n'aide. Le choix
  // explicite l'emporte, et effacer le stockage y ramène.
  const choix: { valeur: Theme; texte: string; icone: 'soleil' | 'lune' }[] = [
    { valeur: 'clair', texte: contenu.general.themeClair, icone: 'soleil' },
    { valeur: 'sombre', texte: contenu.general.themeSombre, icone: 'lune' },
  ]

  return (
    <div className="segments segments--theme" role="group" aria-label={contenu.general.theme}>
      {choix.map((c) => (
        /*
         * `aria-label` ET `title` portent le même mot, et ce n'est pas une redondance :
         * le premier nomme le bouton pour qui l'écoute, le second l'explique à la souris
         * qui s'y arrête. Sans l'un des deux, la commande serait muette pour la moitié
         * de ses usagers. Le tracé, lui, est `aria-hidden` — il est déjà dit.
         */
        <button
          key={c.valeur}
          type="button"
          className="segments__choix segments__choix--icone"
          aria-label={c.texte}
          title={c.texte}
          aria-pressed={theme === c.valeur}
          onClick={() => changer(theme === c.valeur ? 'auto' : c.valeur)}
        >
          <Icone nom={c.icone} />
        </button>
      ))}
    </div>
  )
}
