/*
 * Ce qui doit suivre la langue quand on en change sans recharger.
 *
 * Le changement de langue est la seule navigation de la vitrine qui ne recharge pas la
 * page. Tout ce que le pré-rendu avait écrit dans l'en-tête restait donc figé : `<title>`,
 * description, canonique et `og:url` gardaient la langue d'arrivée. Rien ne se voyait à
 * l'écran — c'est l'onglet, le favori, l'historique et le partage qui mentaient — et c'est
 * exactement le genre de défaut qu'un test attrape et qu'une relecture manque.
 *
 * Le bouton Précédent tombait dans le même trou : `pushState` sans `popstate` en face
 * change l'adresse sans changer la page.
 */
import { act, render, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { FournisseurI18n } from '../i18n/Fournisseur.tsx'
import { useLangue } from '../i18n/contexte.ts'
import { CONTENUS } from '../contenu/tous.ts'
import { textesDePage, urlDePage } from '../i18n/metadonnees.ts'
import type { Langue } from '../contenu/type.ts'

/** L'en-tête que le pré-rendu écrit, réduit aux balises que la langue doit suivre. */
function poserEntete() {
  document.head.innerHTML = [
    '<title>rien</title>',
    '<meta name="description" content="rien" />',
    '<link rel="canonical" href="https://exemple.invalid/" />',
    '<meta property="og:url" content="https://exemple.invalid/" />',
    '<meta property="og:title" content="rien" />',
    '<meta property="og:locale" content="rien" />',
  ].join('')
}

let changer: (langue: Langue) => void

function Sonde() {
  const { langue, changerLangue } = useLangue()
  changer = changerLangue
  return createElement('span', { 'data-langue': langue }, langue)
}

function monter() {
  return render(
    createElement(FournisseurI18n, { langueInitiale: 'fr' }, createElement(Sonde)),
  )
}

function attribut(selecteur: string, attribut: string) {
  return document.querySelector(selecteur)?.getAttribute(attribut)
}

beforeEach(() => {
  poserEntete()
  window.history.replaceState({}, '', '/')
})

describe('Le changement de langue', () => {
  it('emmène tout l’en-tête avec lui', async () => {
    monter()
    await act(async () => changer('de'))

    const attendus = textesDePage('de', 'accueil')
    expect(document.title).toBe(attendus.titre)
    expect(attribut('meta[name="description"]', 'content')).toBe(attendus.description)
    expect(attribut('link[rel="canonical"]', 'href')).toBe(urlDePage('de', 'accueil'))
    expect(attribut('meta[property="og:url"]', 'content')).toBe(urlDePage('de', 'accueil'))
    expect(attribut('meta[property="og:title"]', 'content')).toBe(attendus.titre)
    expect(attribut('meta[property="og:locale"]', 'content')).toBe('de_LU')
    // C'est lui que lit un lecteur d'écran pour choisir sa voix.
    expect(document.documentElement.lang).toBe(CONTENUS.de.codeLangue)
  })

  it('pose l’en-tête du pré-rendu dès le premier passage, sans changer de langue', async () => {
    monter()
    await waitFor(() => expect(document.title).toBe(textesDePage('fr', 'accueil').titre))
    expect(attribut('link[rel="canonical"]', 'href')).toBe(urlDePage('fr', 'accueil'))
  })

  it('change l’adresse', async () => {
    monter()
    await act(async () => changer('lb'))
    expect(window.location.pathname).toBe('/lb/')
  })

  it('revient avec le bouton Précédent', async () => {
    const { container } = monter()
    await act(async () => changer('de'))
    expect(container.querySelector('span')?.dataset.langue).toBe('de')

    /*
     * Le bouton Précédent : l'adresse a déjà changé quand `popstate` est distribué. C'est
     * ce que faisait le navigateur, et la page ne le suivait pas.
     */
    await act(async () => {
      window.history.replaceState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(container.querySelector('span')?.dataset.langue).toBe('fr')
    await waitFor(() => expect(document.title).toBe(textesDePage('fr', 'accueil').titre))
  })
})
