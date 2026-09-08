/*
 * Le thème est la seule chose que la page décide AVANT React : un script en ligne d'une
 * ligne pose `data-theme` sur `<html>` pour qu'une page pré-rendue ne clignote pas en
 * sombre chez qui a choisi le clair. Deux pièges se referment autour de lui, et ces tests
 * sont là pour les tenir ouverts.
 *
 *   1. Lire cet attribut PENDANT le rendu fait diverger le premier rendu du navigateur de
 *      celui du pré-rendu, qui n'a pas d'attribut à lire. React ne rattrape pas un
 *      attribut divergent, et son avertissement n'existe pas en production : le segment
 *      choisi restait muet, sans que rien ne le signale.
 *   2. Corriger le premier piège en démarrant à `auto` ouvre le second — l'effet qui
 *      applique le thème efface alors l'attribut que le script vient de poser, et ramène
 *      le clignotement qu'il évitait.
 */
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useTheme, type Theme } from '../theme.ts'

afterEach(() => {
  delete document.documentElement.dataset.theme
  localStorage.clear()
})

describe('useTheme', () => {
  it('rend « auto » au premier passage, comme le pré-rendu, même si le thème est déjà posé', async () => {
    document.documentElement.dataset.theme = 'clair'

    const rendus: Theme[] = []
    renderHook(() => {
      const [theme] = useTheme()
      rendus.push(theme)
      return theme
    })

    expect(rendus[0]).toBe('auto')
    await waitFor(() => expect(rendus.at(-1)).toBe('clair'))
  })

  it('ne retire jamais l’attribut posé par le script en ligne', async () => {
    document.documentElement.dataset.theme = 'sombre'

    const passages: (string | undefined)[] = []
    const observateur = new MutationObserver(() => {
      passages.push(document.documentElement.dataset.theme)
    })
    observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const { result } = renderHook(() => useTheme())
    await waitFor(() => expect(result.current[0]).toBe('sombre'))
    observateur.disconnect()

    // Zéro passage est le bon compte : l'attribut est déjà celui qu'il faut, et un
    // `sombre → absent → sombre` serait un clignotement d'une image.
    expect(passages).not.toContain(undefined)
  })

  it('applique le choix suivant, et « auto » rend la main au système', async () => {
    const { result } = renderHook(() => useTheme())

    result.current[1]('sombre')
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('sombre'))
    expect(localStorage.getItem('vitrine-schoulbus.theme')).toBe('sombre')

    result.current[1]('auto')
    await waitFor(() => expect(document.documentElement.dataset.theme).toBeUndefined())
    expect(localStorage.getItem('vitrine-schoulbus.theme')).toBeNull()
  })
})
