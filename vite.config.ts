// `vitest/config` plutôt que `vite` : c'est lui qui connaît la clé `test` ci-dessous.
import { createHash } from 'node:crypto'
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
function politiqueSecurite(empreintes: string[] = []): string {
  return [
    "default-src 'self'",
    /*
     * Les empreintes autorisent NOMMÉMENT les scripts en ligne du gabarit, sans ouvrir
     * `'unsafe-inline'` — qui, lui, autoriserait aussi celui qu'une injection écrirait.
     *
     * Sans elles, `script-src 'self'` bloquait le petit script anti-scintillement de
     * `index.html`, et le blocage ne se voyait pas : la page s'affichait parfaitement,
     * simplement en thème sombre pendant une image chez qui avait choisi le clair. Le
     * script existe pour éviter exactement ce scintillement ; la politique l'empêchait
     * de faire son travail.
     */
    ["script-src 'self'", ...empreintes.map((e) => `'${e}'`)].join(' '),
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
    /*
     * `order: 'post'` : les empreintes doivent être calculées sur le HTML FINAL. Un autre
     * greffon qui toucherait à un script en ligne après nous invaliderait une empreinte
     * calculée trop tôt, et le script se retrouverait bloqué — silencieusement, comme il
     * l'était.
     */
    transformIndexHtml: {
      order: 'post' as const,
      handler(html: string, ctx: { bundle?: Record<string, unknown> }) {
        /*
         * Précharge la seule police qui dessine le titre.
         *
         * Elle est déclarée dans la feuille de style, que le navigateur ne lit qu'après
         * l'avoir téléchargée : la police n'est donc découverte qu'au deuxième aller-retour,
         * et `font-display: swap` fait paraître le titre en police de repli avant de le
         * redessiner. Le titre est l'élément le plus grand de l'écran — c'est lui que
         * mesure le LCP.
         *
         * UNE seule, et pas les quatre : l'extension latine et les deux graisses du
         * chiffrier ne servent pas au premier écran, et les précharger toutes ferait
         * concurrence au paquet JavaScript au lieu d'aider.
         *
         * Le nom porte une empreinte, il est donc lu dans le lot plutôt qu'écrit à la
         * main — un préchargement qui désigne un fichier absent coûte un aller-retour
         * pour rien, et le navigateur le signale sans que la page en souffre : invisible.
         */
        const police = Object.keys(ctx.bundle ?? {}).find((f) =>
          /ibm-plex-sans-latin-wght-normal-[^/]*\.woff2$/.test(f),
        )
        if (police) {
          html = html.replace(
            '</head>',
            `  <link rel="preload" href="${base}${police}" as="font" type="font/woff2" crossorigin />\n  </head>`,
          )
        }

        const empreintes = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)]
          .map((m) => m[1])
          .filter((code) => code.trim() !== '')
          .map((code) => `sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}`)

        return html.replace(
          '<head>',
          `<head>\n    <meta http-equiv="Content-Security-Policy" content="${politiqueSecurite(empreintes)}" />`,
        )
      },
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
