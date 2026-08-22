/*
 * Les deux commandes de la page : la langue et le thème.
 *
 * Elles sont faites de vrais `<button>` avec `aria-pressed`, et non d'un `<select>` ni
 * de liens. Trois raisons : l'état choisi doit être annoncé, la commande agit dans la
 * page sans la quitter, et un groupe de trois boutons visibles évite l'ouverture d'un
 * menu système qui, sur téléphone, recouvre la moitié de l'écran.
 *
 * Le groupe entier porte un `aria-label` : sans lui, un lecteur d'écran annonce cinq
 * boutons « FR », « DE », « LB »… sans dire de quoi il s'agit.
 *
 * LES DEUX COMMANDES NE SE RESSEMBLENT PLUS. La langue reste écrite — un code de deux
 * lettres est déjà un dessin, et aucune icône ne dit « portugais ». Le thème, lui, est
 * passé aux icônes : un soleil et un croissant se comprennent sans être lus, ce qui vaut
 * mieux qu'un mot à traduire cinq fois dans une barre où la place manque. Le mot ne
 * disparaît pas, il change de place — il devient le nom accessible du bouton et son
 * infobulle.
 */
import { Icone } from './Icones.tsx'
import { LANGUES, useLangue } from '../i18n/contexte.ts'
import { useTheme, type Theme } from '../theme.ts'
import { useContenu } from '../i18n/contexte.ts'

export function ChoixLangue() {
  const { langue, changerLangue } = useLangue()
  const contenu = useContenu()

  return (
    <div className="segments segments--langue" role="group" aria-label={contenu.general.choixLangue}>
      {LANGUES.map((l) => (
        <button
          key={l}
          type="button"
          className="segments__choix"
          aria-pressed={l === langue}
          onClick={() => changerLangue(l)}
        >
          {l}
        </button>
      ))}
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
