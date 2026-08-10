/*
 * Le thème, comme dans l'application : `auto` suit le système, les deux autres forcent.
 *
 * La clé de stockage est propre à la vitrine. Partager celle de l'application aurait été
 * séduisant — un parent qui passe de l'une à l'autre garderait son choix — mais les deux
 * sites sont sur des origines différentes : le stockage local n'est pas partagé, et
 * prétendre le contraire aurait produit un bogue impossible à reproduire côté commune.
 */
import { useCallback, useEffect, useState } from 'react'

export type Theme = 'auto' | 'clair' | 'sombre'

const CLE = 'vitrine-schoulbus.theme'

/** Ce qui est déjà posé sur `<html>` par le script en ligne d'`index.html`. */
function themeInitial(): Theme {
  if (typeof document === 'undefined') return 'auto'
  const pose = document.documentElement.dataset.theme
  return pose === 'clair' || pose === 'sombre' ? pose : 'auto'
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(themeInitial)

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
    // `auto` retire l'attribut plutôt que d'écrire « auto » : c'est son absence qui
    // laisse la media query `prefers-color-scheme` reprendre la main dans `jetons.css`.
    if (theme === 'auto') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])

  return [theme, changer]
}
