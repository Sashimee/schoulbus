// `vitest/config` plutôt que `vite` : c'est lui qui connaît la clé `test` ci-dessous.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// La vitrine est destinée à la racine d'un domaine propre (schoulbus.lu). Le préfixe
// reste néanmoins une variable : tant que le domaine n'est pas posé, la page peut être
// servie sous un sous-chemin, comme l'application l'est aujourd'hui.
const base = process.env.BASE_PATH ?? '/'

// Origine publique. Elle n'entre que dans les métadonnées de partage, qui exigent des
// URL absolues — un crawler ne résout pas un chemin relatif.
const origine = (process.env.URL_PUBLIQUE ?? 'https://schoulbus.lu').replace(/\/$/, '')

/**
 * Politique de sécurité du contenu, posée en balise `<meta>`.
 *
 * La vitrine est un site statique : elle ne parle à personne. Aucune police distante,
 * aucune analytique, aucun appel réseau après le chargement — la politique la plus
 * stricte qui laisse encore fonctionner la page est donc la bonne, et non un compromis.
 *
 * Deux écarts assumés :
 * - `style-src` autorise `'unsafe-inline'` : le pré-rendu pose des styles critiques en
 *   ligne pour éviter le flash de page non stylée, et `motion` écrit dans `style` au fil
 *   des animations.
 * - `frame-ancestors` est absente : la spécification l'ignore en balise `<meta>`, et
 *   l'écrire donnerait une fausse impression de protection.
 */
function politiqueSecurite(): string {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    // Rien à joindre : les seuls liens sortants sont des navigations, pas des requêtes.
    "connect-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ')
}

/**
 * Insère la politique dans `index.html`.
 *
 * **Construction uniquement**, pour la même raison que dans l'application : en
 * développement, `@vitejs/plugin-react` injecte un préambule en ligne que
 * `script-src 'self'` bloque, et la page ne démarre plus.
 */
function pluginCsp() {
  return {
    name: 'vitrine-csp',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${politiqueSecurite()}" />`,
      )
    },
  }
}

export default defineConfig({
  base,
  define: {
    __ORIGINE__: JSON.stringify(origine),
  },
  plugins: [react(), pluginCsp()],
  build: {
    // La vitrine n'a qu'une page : un seul fichier JS se télécharge plus vite que trois.
    // Seul le shader est séparé, parce qu'il n'est chargé que sur les appareils qui le
    // font tourner (voir `mouvement/Fond.tsx`).
    target: 'es2022',
    cssTarget: 'safari16',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/preparation.ts'],
  },
})
