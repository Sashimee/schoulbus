/*
 * Le thème, comme dans l'application : `auto` suit le système, les deux autres forcent.
 *
 * La clé de stockage est propre à la vitrine. Partager celle de l'application aurait été
 * séduisant — un parent qui passe de l'une à l'autre garderait son choix — mais les deux
 * sites sont sur des origines différentes : le stockage local n'est pas partagé, et
 * prétendre le contraire aurait produit un bogue impossible à reproduire côté commune.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export type Theme = 'auto' | 'clair' | 'sombre'

const CLE = 'vitrine-schoulbus.theme'

/** Ce qui est déjà posé sur `<html>` par le script en ligne d'`index.html`. */
function themeInitial(): Theme {
  if (typeof document === 'undefined') return 'auto'
  const pose = document.documentElement.dataset.theme
  return pose === 'clair' || pose === 'sombre' ? pose : 'auto'
}

export function useTheme(): [Theme, (t: Theme) => void] {
  /*
   * `auto` DES DEUX CÔTÉS au premier rendu, et la lecture de l'attribut renvoyée à un
   * effet. Lire `themeInitial()` pendant le rendu donnait `auto` au pré-rendu, où aucun
   * attribut n'existe, et `clair` dans le navigateur, où le script en ligne d'`index.html`
   * l'a déjà posé : les deux arbres divergeaient sur `aria-pressed`, et React ne rattrape
   * pas un attribut — « this won't be patched up », un avertissement retiré du paquet de
   * production. Le résultat tenait debout et était faux : la page s'affichait dans le bon
   * thème, mais aucun des deux segments ne se disait choisi, ni à l'œil ni à la voix.
   * Le défaut ne frappait donc QUE les visiteurs qui avaient choisi.
   */
  const [theme, setTheme] = useState<Theme>('auto')
  const suit = useRef(false)

  useEffect(() => {
    setTheme(themeInitial())
  }, [])

  const changer = useCallback((suivant: Theme) => {
    setTheme(suivant)
    try {
      if (suivant === 'auto') localStorage.removeItem(CLE)
      else localStorage.setItem(CLE, suivant)
    } catch {
      // Stockage refusé (navigation privée stricte) : le choix vaut pour la visite.
    }
  }, [])

  useEffect(() => {
    // Le premier passage SUIT le script en ligne au lieu de l'écraser : l'état vaut encore
    // `auto` à ce moment-là, et retirer l'attribut qu'il vient de poser ramènerait
    // exactement le clignotement pour lequel il existe.
    if (!suit.current) {
      suit.current = true
      return
    }
    // `auto` retire l'attribut plutôt que d'écrire « auto » : c'est son absence qui
    // laisse la media query `prefers-color-scheme` reprendre la main dans `jetons.css`.
    if (theme === 'auto') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])

  return [theme, changer]
}
