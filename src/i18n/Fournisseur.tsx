import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Langue } from '../contenu/type.ts'
import { CONTENUS, ContexteI18n, cheminPage, langueDuChemin, type Page } from './contexte.ts'
import { appliquerMetadonnees } from './metadonnees.ts'

/**
 * Porte la langue courante.
 *
 * Le changement de langue ne recharge pas la page : le contenu est déjà dans le paquet,
 * et un rechargement ferait repartir toutes les animations d'entrée depuis le début —
 * on aurait l'impression d'avoir perdu sa place pour avoir simplement changé de langue.
 * L'adresse, elle, est mise à jour (`pushState`) pour rester partageable.
 *
 * CE QUI VA AVEC LA LANGUE VA JUSQU'AU BOUT. Seul l'attribut `lang` suivait ; le
 * `<title>`, la description, la canonique et `og:url` restaient dans la langue d'arrivée
 * — l'onglet, le favori et l'historique gardaient donc le titre de la langue qu'on venait
 * de quitter. Tout l'en-tête est réécrit par `appliquerMetadonnees`, qui fait le même
 * calcul que le pré-rendu parce que c'est littéralement le même code.
 *
 * ET LE BOUTON PRÉCÉDENT REVIENT VRAIMENT. `pushState` sans `popstate` en face changeait
 * l'adresse sans changer la page : on repassait de `/de/` à `/`, l'adresse le disait,
 * la page restait en allemand.
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
      window.history.pushState({}, '', cheminPage(suivante, pageInitiale) + window.location.hash)
    },
    [pageInitiale],
  )

  /*
   * L'en-tête suit la langue, y compris au premier passage : celui-ci repose exactement ce
   * que le pré-rendu avait écrit, ce qui est la façon la moins chère de garantir que les
   * deux calculs ne divergent pas.
   */
  useEffect(() => {
    appliquerMetadonnees(langue, pageInitiale)
  }, [langue, pageInitiale])

  /*
   * L'historique. Seules les langues se déplacent sans recharger — les autres pages sont
   * de vrais documents —, donc il n'y a que la langue à relire dans l'adresse.
   */
  useEffect(() => {
    const revenir = () => setLangue(langueDuChemin(window.location.pathname))
    window.addEventListener('popstate', revenir)
    return () => window.removeEventListener('popstate', revenir)
  }, [])

  const valeur = useMemo(
    () => ({ langue, contenu: CONTENUS[langue], changerLangue }),
    [langue, changerLangue],
  )

  return <ContexteI18n.Provider value={valeur}>{children}</ContexteI18n.Provider>
}
