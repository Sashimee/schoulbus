/*
 * Le titre, la description et les adresses d'une page, dans une langue.
 *
 * Ce module existe parce que les mêmes valeurs sont écrites DEUX FOIS : une fois par le
 * pré-rendu, dans l'en-tête HTML servi, et une fois par le navigateur, quand on change de
 * langue sans recharger. Tant que les deux calculs vivaient chacun de leur côté, le second
 * n'existait pas du tout : passer au luxembourgeois changeait la page et l'adresse, et
 * laissait le `<title>`, la description, la canonique et `og:url` en français. L'onglet, le
 * favori et l'historique gardaient le titre de la langue qu'on venait de quitter.
 *
 * Les textes sont rendus BRUTS. C'est le pré-rendu qui les échappe pour un attribut HTML ;
 * le navigateur, lui, les pose par `textContent` et `setAttribute`, qui échappent
 * d'eux-mêmes.
 */
import { CONTENUS, cheminPage, type Page } from './contexte.ts'
import { ORIGINE, imagePartage } from '../config.ts'
import type { Langue } from '../contenu/type.ts'

/*
 * La locale Open Graph, qui n'est PAS le code de langue suivi du pays.
 *
 * `fr_LU`, `de_LU` et `lb_LU` existent : ce sont les trois langues officielles du
 * Luxembourg, et un lecteur de ces pages-là est très probablement au Luxembourg. Le
 * portugais et l'anglais n'ont pas cette propriété — `pt_LU` et `en_LU` ne sont pas des
 * locales déclarées, et Facebook comme LinkedIn les ignorent en silence, ce qui fait
 * retomber le partage sur la langue par défaut. On donne donc à ces deux-là leur locale
 * standard, quitte à ce qu'elle nomme un autre pays que celui du lecteur : mieux vaut
 * une locale reconnue qu'une locale exacte que personne ne lit.
 */
export const LOCALES_OG: Record<Langue, string> = {
  fr: 'fr_LU',
  de: 'de_LU',
  lb: 'lb_LU',
  pt: 'pt_PT',
  en: 'en_GB',
}

/**
 * Le titre et la description propres à une page.
 *
 * Chaque sous-page a les siens : servie avec le titre de l'accueil, elle se disputerait le
 * même résultat de recherche, et un moteur déclasserait l'une des deux comme copie.
 */
export function textesDePage(langue: Langue, page: Page): { titre: string; description: string } {
  const c = CONTENUS[langue]
  if (page === 'mentions') {
    return { titre: `${c.mentions.titre} — ${c.general.marque}`, description: c.mentions.intro }
  }
  if (page === 'contact') {
    return { titre: `${c.contact.titre} — ${c.general.marque}`, description: c.contact.intro }
  }
  if (page === 'independance') {
    return {
      titre: `${c.independance.titre} — ${c.general.marque}`,
      description: c.independance.texte,
    }
  }
  return { titre: c.meta.titre, description: c.meta.description }
}

/** L'adresse absolue d'une page, celle que portent la canonique et `og:url`. */
export function urlDePage(langue: Langue, page: Page): string {
  return `${ORIGINE}${cheminPage(langue, page)}`
}

function poser(selecteur: string, attribut: string, valeur: string): void {
  document.querySelector(selecteur)?.setAttribute(attribut, valeur)
}

/**
 * Réécrit l'en-tête du document pour la langue courante.
 *
 * Appelé au changement de langue, qui ne recharge pas la page. Au premier appel — celui de
 * l'hydratation — il repose exactement ce que le pré-rendu avait écrit : c'est voulu, cela
 * garantit que les deux calculs concordent, et le jour où ils divergeraient, c'est ici
 * qu'on le verrait plutôt que dans un résultat de recherche.
 */
export function appliquerMetadonnees(langue: Langue, page: Page): void {
  const contenu = CONTENUS[langue]
  const { titre, description } = textesDePage(langue, page)
  const url = urlDePage(langue, page)

  document.documentElement.lang = contenu.codeLangue
  document.title = titre
  poser('meta[name="description"]', 'content', description)
  poser('link[rel="canonical"]', 'href', url)
  poser('meta[property="og:url"]', 'content', url)
  poser('meta[property="og:title"]', 'content', titre)
  poser('meta[property="og:description"]', 'content', description)
  poser('meta[property="og:locale"]', 'content', LOCALES_OG[langue])
  poser('meta[property="og:image"]', 'content', `${ORIGINE}/${imagePartage(langue)}`)
  poser('meta[name="twitter:title"]', 'content', titre)
  poser('meta[name="twitter:description"]', 'content', description)
  poser('meta[name="twitter:image"]', 'content', `${ORIGINE}/${imagePartage(langue)}`)
}
