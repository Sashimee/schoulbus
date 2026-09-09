/*
 * L'étagement du mouvement est la pièce la plus risquée de la vitrine : c'est lui qui
 * décide si quelqu'un ayant demandé « réduire les animations » reçoit une page immobile,
 * ou un nuage WebGL et un curseur qui traîne. Une régression y est invisible à la
 * relecture et grave à l'usage — d'où ces tests.
 */
import { render, renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * LE CROCHET EST IMPORTÉ DANS CHAQUE TEST, jamais en tête de fichier : la mesure vit
 * désormais dans un magasin de module — une toile WebGL et trois `matchMedia` pour la page
 * entière — et un magasin, par construction, garde sa réponse. Repartir d'un module neuf
 * est ce qui permet de poser une machine différente d'un test à l'autre ; l'importer une
 * fois pour toutes ferait mesurer le premier test pour tous les autres.
 */
async function crochet() {
  return (await import('../mouvement/useNiveauMouvement.ts')).useNiveauMouvement
}

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

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useNiveauMouvement', () => {
  it('rend « aucun » quand la réduction des animations est demandée, même sur une machine capable', async () => {
    poserMedia(['prefers-reduced-motion: reduce', 'pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(16)

    const useNiveauMouvement = await crochet()
    const { result } = renderHook(() => useNiveauMouvement())
    // La préférence prime sur tout le reste : c'est un besoin, pas un réglage de confort.
    await waitFor(() => expect(result.current).toBe('aucun'))
  })

  it('rend « complet » sur un poste à souris, large, avec WebGL2 et assez de cœurs', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    const useNiveauMouvement = await crochet()
    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('complet'))
  })

  it('retombe à « reduit » sur tactile, même avec WebGL2', async () => {
    poserMedia(['min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    const useNiveauMouvement = await crochet()
    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('reduit'))
  })

  it('retombe à « reduit » sans WebGL2, même sur un poste à souris', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(false)
    poserCoeurs(8)

    const useNiveauMouvement = await crochet()
    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('reduit'))
  })

  it('retombe à « reduit » sur une machine à deux cœurs', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(2)

    const useNiveauMouvement = await crochet()
    const { result } = renderHook(() => useNiveauMouvement())
    await waitFor(() => expect(result.current).toBe('reduit'))
  })

  it('rend « aucun » à qui rend la page côté serveur, quelle que soit la machine', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    /*
     * L'arbre servi doit être exactement celui que le navigateur rendra en reprenant la
     * main, sinon React refuse l'hydratation et refait toute la page. C'est le rendu
     * serveur qui décide de cet arbre, et il vaut `aucun` même sur la machine la plus
     * capable — l'ancienne version de ce test regardait le rendu client, qui a déjà
     * mesuré, et acceptait donc les deux réponses.
     */
    const useNiveauMouvement = await crochet()
    const { renderToStaticMarkup } = await import('react-dom/server')
    const { createElement } = await import('react')

    function Sonde() {
      return createElement('span', null, useNiveauMouvement())
    }

    expect(renderToStaticMarkup(createElement(Sonde))).toBe('<span>aucun</span>')
  })

  it('ne mesure qu’une fois pour toute la page', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    /*
     * Trente-neuf appels du crochet demandaient trente-neuf contextes WebGL2, qu'aucun ne
     * relâchait : Chromium en plafonne seize, perdait les plus anciens, et s'en plaignait
     * vingt-trois fois à l'ouverture de la page. Une décision valable pour la page entière
     * ne se prend qu'une fois.
     */
    const useNiveauMouvement = await crochet()
    renderHook(() => [useNiveauMouvement(), useNiveauMouvement(), useNiveauMouvement()])
    await waitFor(() => expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled())

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledTimes(1)
    // Trois requêtes de média pour la page, pas trois par appel.
    expect(window.matchMedia).toHaveBeenCalledTimes(3)
  })
})

/*
 * Le rideau d'ouverture, qui est la seule décoration capable de CACHER la page.
 *
 * Il s'abstenait au seul niveau `aucun`, donc il se montrait sur tout téléphone : relevé
 * sur la page construite, à 393 px et pointeur grossier, il couvrait du contenu déjà
 * peint de 95 à 1 576 ms. Le pré-rendu servait une page lisible et le navigateur la
 * cachait aussitôt derrière un logo, précisément là où l'appareil est le plus lent.
 */
describe('Le rideau', () => {
  async function monter() {
    // Le rideau ne se montre qu'une fois par session : sans ce nettoyage, le premier test
    // qui en monte un rendrait muets tous les suivants.
    sessionStorage.clear()
    const { Rideau } = await import('../sections/Rideau.tsx')
    const { FournisseurI18n } = await import('../i18n/Fournisseur.tsx')
    return render(
      createElement(FournisseurI18n, { langueInitiale: 'fr' }, createElement(Rideau)),
    )
  }

  it('ne couvre pas un appareil tactile', async () => {
    poserMedia(['min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    const { container } = await monter()
    await waitFor(() => expect(window.matchMedia).toHaveBeenCalled())
    expect(container.querySelector('.rideau')).toBeNull()
  })

  it('ne couvre pas non plus qui demande de réduire les animations', async () => {
    poserMedia(['prefers-reduced-motion: reduce', 'pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(16)

    const { container } = await monter()
    await waitFor(() => expect(window.matchMedia).toHaveBeenCalled())
    expect(container.querySelector('.rideau')).toBeNull()
  })

  it('se montre sur un poste capable', async () => {
    poserMedia(['pointer: fine', 'min-width'])
    poserWebgl(true)
    poserCoeurs(8)

    const { container } = await monter()
    await waitFor(() => expect(container.querySelector('.rideau')).not.toBeNull())
  })
})
