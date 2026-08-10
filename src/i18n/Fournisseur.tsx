import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Langue } from '../contenu/type.ts'
import { CONTENUS, ContexteI18n, cheminPage, type Page } from './contexte.ts'

/**
 * Porte la langue courante.
 *
 * Le changement de langue ne recharge pas la page : le contenu est déjà dans le paquet,
 * et un rechargement ferait repartir toutes les animations d'entrée depuis le début —
 * on aurait l'impression d'avoir perdu sa place pour avoir simplement changé de langue.
 * L'adresse, elle, est mise à jour (`pushState`) pour rester partageable, et l'attribut
 * `lang` du document suit — c'est lui que lit un lecteur d'écran pour choisir sa voix.
 *
 * `langueInitiale` vient du serveur au pré-rendu, et de l'adresse au démarrage côté
 * navigateur. Les deux doivent concorder, sinon React refuse l'hydratation.
 */
export function FournisseurI18n({
  langueInitiale,
  pageInitiale = 'accueil',
  children,
}: {
  langueInitiale: Langue
  /*
   * La page courante ne sert qu'à une chose : savoir vers quelle adresse pointer quand
   * on change de langue. Depuis les mentions légales allemandes, on doit arriver aux
   * mentions légales françaises — et non à l'accueil, qui renverrait la personne au
   * début d'un texte qu'elle était en train de vérifier.
   */
  pageInitiale?: Page
  // Facultatif dans le type, comme partout en React : c'est ce qui permet au pré-rendu
  // de passer l'arbre en troisième argument de `createElement` plutôt qu'en propriété.
  children?: ReactNode
}) {
  const [langue, setLangue] = useState<Langue>(langueInitiale)

  const changerLangue = useCallback(
    (suivante: Langue) => {
      setLangue(suivante)
      if (typeof document === 'undefined') return
      document.documentElement.lang = CONTENUS[suivante].codeLangue
      window.history.pushState({}, '', cheminPage(suivante, pageInitiale) + window.location.hash)
    },
    [pageInitiale],
  )

  const valeur = useMemo(
    () => ({ langue, contenu: CONTENUS[langue], changerLangue }),
    [langue, changerLangue],
  )

  return <ContexteI18n.Provider value={valeur}>{children}</ContexteI18n.Provider>
}
