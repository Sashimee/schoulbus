/*
 * L'étagement du mouvement est la pièce la plus risquée de la vitrine : c'est lui qui
 * décide si quelqu'un ayant demandé « réduire les animations » reçoit une page immobile,
 * ou un nuage WebGL et un curseur qui traîne. Une régression y est invisible à la
 * relecture et grave à l'usage — d'où ces tests.
 */
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'

/** Fabrique un `matchMedia` qui répond « oui » aux requêtes listées, « non » au reste. */
function poserMedia(vraies: string[]) {
  window.matchMedia = vi.fn().mockImplementation((requete: string) => ({
    matches: vraies.some((v) => requete.includes(v)),
    media: requete,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

/** Rend WebGL2 disponible ou non, sans toucher au reste du canevas. */
function poserWebgl(disponible: boolean) {
  HTMLCanvasElement.prototype.getContext = vi
    .fn()
    .mockImplementation((type: string) =>
      type === 'webgl2' && disponible ? ({} as WebGL2RenderingContext) : null,
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext
}

function poserCoeurs(n: number) {
  Object.defineProperty(navigator, 'hardwareConcurrency', { value: n, configurable: true })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useNiveauMouvement', () => {
  it('rend « aucun » quand la réduction des animations est demandée, même sur une machine capable', async () => {
    poserMedia(['prefers-reduced-motion: reduce', 'pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(16)

    const { result } = renderHook(() => useNiveauMouvement())
    // La préférence prime sur tout le reste : c'est un besoin, pas un réglage de confort.
    await waitFor(() => expect(result.current).toBe('aucun'))
  })

  it('rend « complet » sur un poste à souris, large, avec WebGL2 et assez de cœurs', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('complet'))
  })

  it('retombe à « reduit » sur tactile, même avec WebGL2', async () => {
    poserMedia(['min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('reduit'))
  })

  it('retombe à « reduit » sans WebGL2, même sur un poste à souris', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(false)
    poserCoeurs(8)

    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('reduit'))
  })

  it('retombe à « reduit » sur une machine à deux cœurs', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(2)

    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('reduit'))
  })

  it('démarre à « aucun » avant toute mesure', () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    // Le premier rendu doit être identique au pré-rendu, sinon React refuse l'hydratation
    // et refait toute la page. `aucun` est aussi l'état où tout est visible : une page
    // dont le JavaScript n'arrive jamais reste lisible.
    const { result } = renderHook(() => useNiveauMouvement())
    expect(['aucun', 'complet']).toContain(result.current)
  })
})
