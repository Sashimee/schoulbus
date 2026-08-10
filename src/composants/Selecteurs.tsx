/*
 * Les deux commandes de la page : la langue et le thème.
 *
 * Elles sont faites de vrais `<button>` avec `aria-pressed`, et non d'un `<select>` ni
 * de liens. Trois raisons : l'état choisi doit être annoncé, la commande agit dans la
 * page sans la quitter, et un groupe de trois boutons visibles évite l'ouverture d'un
 * menu système qui, sur téléphone, recouvre la moitié de l'écran.
 *
 * Le groupe entier porte un `aria-label` : sans lui, un lecteur d'écran annonce trois
 * boutons « FR », « DE », « LB » sans dire de quoi il s'agit.
 */
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
  const choix: { valeur: Theme; texte: string }[] = [
    { valeur: 'clair', texte: contenu.general.themeClair },
    { valeur: 'sombre', texte: contenu.general.themeSombre },
  ]

  return (
    <div className="segments segments--theme" role="group" aria-label={contenu.general.theme}>
      {choix.map((c) => (
        <button
          key={c.valeur}
          type="button"
          className="segments__choix"
          aria-pressed={theme === c.valeur}
          onClick={() => changer(theme === c.valeur ? 'auto' : c.valeur)}
        >
          {c.texte}
        </button>
      ))}
    </div>
  )
}
