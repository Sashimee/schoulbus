/*
 * Le fond de la page.
 *
 * Toujours présent : le dégradé CSS de l'application, posé par `.fond`. C'est lui qu'on
 * voit sans JavaScript, sans WebGL, sur tactile, et quand les animations sont coupées.
 *
 * En plus, au niveau 'complet' seulement : un canevas qui rejoue le même dégradé en le
 * faisant lentement respirer. Il se fond PAR-DESSUS le CSS (`opacity` de 0 à 1) au lieu
 * de le remplacer — si la première image tarde, ou si le contexte est perdu en cours de
 * route, il reste le fond de l'application dessous, jamais du noir.
 */
import { useEffect, useRef, useState } from 'react'
import { FRAGMENT, SOMMET } from './fond.glsl.ts'
import { useNiveauMouvement } from './useNiveauMouvement.ts'

/*
 * Les palettes, en linéaire 0..1. Elles reprennent les arrêts de `--degrade` et la
 * teinte de `--halo` des jetons — c'est la seule duplication de valeurs de la vitrine,
 * et elle est inévitable : un shader ne sait pas lire une chaîne CSS `radial-gradient`.
 * Toute retouche de `jetons.css` doit passer ici aussi.
 */
const PALETTES = {
  sombre: {
    c0: [0x14 / 255, 0x2b / 255, 0x47 / 255],
    c1: [0x0e / 255, 0x1a / 255, 0x2e / 255],
    c2: [0x08 / 255, 0x0d / 255, 0x19 / 255],
    accent: [0x2f / 255, 0x7f / 255, 0xb8 / 255],
    /*
     * `--halo` vaut 0.1 en CSS, mais il y est FONDU par-dessus le dégradé, alors qu'ici
     * il s'y AJOUTE. À valeur égale, l'addition éclaircit près de deux fois plus. 0.1
     * additif rend à peu près le même halo que 0.1 fondu.
     */
    intensite: 0.1,
  },
  clair: {
    c0: [0xee / 255, 0xf2 / 255, 0xf7 / 255],
    c1: [0xe1 / 255, 0xe7 / 255, 0xee / 255],
    c2: [0xcf / 255, 0xd8 / 255, 0xe2 / 255],
    accent: [0x2f / 255, 0x7f / 255, 0xb8 / 255],
    // Sur fond clair, le même halo écraserait les encres : le lot 18 le pose déjà à
    // 0.05 en CSS contre 0.1 en sombre. Même rapport ici.
    intensite: 0.03,
  },
} as const

/** Le thème effectivement appliqué, attribut explicite ou préférence système. */
function themeEffectif(): keyof typeof PALETTES {
  const pose = document.documentElement.dataset.theme
  if (pose === 'clair') return 'clair'
  if (pose === 'sombre') return 'sombre'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'clair' : 'sombre'
}

function compiler(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const nuanceur = gl.createShader(type)
  if (!nuanceur) return null
  gl.shaderSource(nuanceur, source)
  gl.compileShader(nuanceur)
  if (!gl.getShaderParameter(nuanceur, gl.COMPILE_STATUS)) {
    // Une erreur de compilation ne doit pas faire disparaître le fond : on le signale et
    // on laisse le dégradé CSS en place.
    console.error('Nuanceur refusé :', gl.getShaderInfoLog(nuanceur))
    gl.deleteShader(nuanceur)
    return null
  }
  return nuanceur
}

export function Fond() {
  const niveau = useNiveauMouvement()
  const toile = useRef<HTMLCanvasElement>(null)
  const [prete, setPrete] = useState(false)

  useEffect(() => {
    if (niveau !== 'complet') return
    const noeud = toile.current
    if (!noeud) return

    const gl = noeud.getContext('webgl2', {
      alpha: false,
      antialias: false,
      // Le nuage est un décor : sur une machine à deux cartes, il n'a rien à faire sur
      // la puissante, qui coûte de la batterie.
      powerPreference: 'low-power',
      depth: false,
      stencil: false,
    })
    if (!gl) return

    const vs = compiler(gl, gl.VERTEX_SHADER, SOMMET)
    const fs = compiler(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vs || !fs) return

    const programme = gl.createProgram()
    gl.attachShader(programme, vs)
    gl.attachShader(programme, fs)
    gl.linkProgram(programme)
    if (!gl.getProgramParameter(programme, gl.LINK_STATUS)) {
      console.error('Programme refusé :', gl.getProgramInfoLog(programme))
      return
    }
    gl.useProgram(programme)

    const u = {
      resolution: gl.getUniformLocation(programme, 'u_resolution'),
      temps: gl.getUniformLocation(programme, 'u_temps'),
      pointeur: gl.getUniformLocation(programme, 'u_pointeur'),
      c0: gl.getUniformLocation(programme, 'u_c0'),
      c1: gl.getUniformLocation(programme, 'u_c1'),
      c2: gl.getUniformLocation(programme, 'u_c2'),
      accent: gl.getUniformLocation(programme, 'u_accent'),
      intensiteAccent: gl.getUniformLocation(programme, 'u_intensiteAccent'),
    }

    const poserPalette = () => {
      const p = PALETTES[themeEffectif()]
      gl.uniform3fv(u.c0, p.c0 as unknown as number[])
      gl.uniform3fv(u.c1, p.c1 as unknown as number[])
      gl.uniform3fv(u.c2, p.c2 as unknown as number[])
      gl.uniform3fv(u.accent, p.accent as unknown as number[])
      gl.uniform1f(u.intensiteAccent, p.intensite)
    }
    poserPalette()

    /*
     * Résolution. Le nuage est flou par nature : le rendre à la densité réelle d'un
     * écran Retina quadruple le nombre de pixels pour un résultat que personne ne
     * distingue. Plafonné à 1,5.
     */
    const dimensionner = () => {
      const densite = Math.min(window.devicePixelRatio || 1, 1.5)
      const l = Math.floor(window.innerWidth * densite)
      const h = Math.floor(window.innerHeight * densite)
      if (noeud.width === l && noeud.height === h) return
      noeud.width = l
      noeud.height = h
      gl.viewport(0, 0, l, h)
      gl.uniform2f(u.resolution, l, h)
    }
    dimensionner()

    let px = 0
    let py = 0
    let cx = 0
    let cy = 0
    const surDeplacement = (e: PointerEvent) => {
      cx = (e.clientX / window.innerWidth) * 2 - 1
      cy = (e.clientY / window.innerHeight) * 2 - 1
    }

    let image = 0
    let visible = true
    let premiere = true
    const depart = performance.now()

    const dessiner = (maintenant: number) => {
      image = requestAnimationFrame(dessiner)
      if (!visible) return

      // Le pointeur est lissé ici et non dans le shader : une valeur brute ferait sauter
      // l'ancrage du dégradé à chaque déplacement rapide de la souris.
      px += (cx - px) * 0.04
      py += (cy - py) * 0.04

      dimensionner()
      gl.uniform1f(u.temps, (maintenant - depart) / 1000)
      gl.uniform2f(u.pointeur, px, py)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (premiere) {
        premiere = false
        setPrete(true)
      }
    }
    image = requestAnimationFrame(dessiner)

    // Onglet caché : rien à dessiner. Un fond animé dans un onglet d'arrière-plan est
    // du chauffage.
    const surVisibilite = () => {
      visible = document.visibilityState === 'visible'
    }

    // Le thème peut changer sous nos pieds : bouton de la page, ou réglage du système.
    const observateur = new MutationObserver(poserPalette)
    observateur.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    const requeteSysteme = window.matchMedia('(prefers-color-scheme: light)')
    requeteSysteme.addEventListener('change', poserPalette)

    window.addEventListener('pointermove', surDeplacement, { passive: true })
    document.addEventListener('visibilitychange', surVisibilite)

    /*
     * Contexte perdu — mise en veille, changement de carte graphique, onglet trop
     * gourmand. Sans ce garde-fou, le canevas resterait figé sur sa dernière image, à
     * `opacity: 1`, par-dessus le dégradé CSS. On le repasse en transparent : le repli
     * redevient visible, et personne ne voit rien de cassé.
     */
    const surPerte = (e: Event) => {
      e.preventDefault()
      setPrete(false)
    }
    noeud.addEventListener('webglcontextlost', surPerte)

    return () => {
      cancelAnimationFrame(image)
      observateur.disconnect()
      requeteSysteme.removeEventListener('change', poserPalette)
      window.removeEventListener('pointermove', surDeplacement)
      document.removeEventListener('visibilitychange', surVisibilite)
      noeud.removeEventListener('webglcontextlost', surPerte)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [niveau])

  return (
    <div className="fond" aria-hidden="true">
      {niveau === 'complet' && (
        <canvas ref={toile} className="fond__toile" data-prete={prete ? 'oui' : 'non'} />
      )}
    </div>
  )
}
