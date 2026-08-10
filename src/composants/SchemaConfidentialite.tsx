/*
 * Le schéma de confidentialité.
 *
 * Un contour d'appareil, des points dedans, et de temps à autre un point qui part vers
 * le bord — et s'éteint en l'atteignant. C'est un dessin, pas une métaphore savante :
 * la promesse du projet est littéralement celle-ci, rien ne sort.
 *
 * Dessiné sur un canevas 2D plutôt qu'en SVG animé : une quinzaine de points qui dérivent
 * en permanence font, en SVG, une quinzaine de nœuds dont le navigateur recalcule le
 * style à chaque image. Ici, c'est une seule surface.
 *
 * Sans mouvement autorisé, une seule image est peinte : le contour, les points en place,
 * et la tentative de sortie figée à mi-chemin. Le schéma reste compréhensible à l'arrêt.
 */
import { useEffect, useRef } from 'react'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'

type Point = { x: number; y: number; vx: number; vy: number; r: number }

/** Lit une couleur de la charte telle qu'elle est calculée sur la page. */
function jeton(nom: string, repli: string): string {
  if (typeof window === 'undefined') return repli
  const v = getComputedStyle(document.documentElement).getPropertyValue(nom).trim()
  return v || repli
}

export function SchemaConfidentialite({ legende }: { legende: string }) {
  const toile = useRef<HTMLCanvasElement>(null)
  const niveau = useNiveauMouvement()

  useEffect(() => {
    const noeud = toile.current
    if (!noeud) return
    const ctx = noeud.getContext('2d')
    if (!ctx) return

    const densite = Math.min(window.devicePixelRatio || 1, 2)
    let l = 0
    let h = 0

    const dimensionner = () => {
      const boite = noeud.getBoundingClientRect()
      l = boite.width
      h = boite.height
      noeud.width = Math.floor(l * densite)
      noeud.height = Math.floor(h * densite)
      ctx.setTransform(densite, 0, 0, densite, 0, 0)
    }
    dimensionner()

    // Le cadre de l'appareil, centré, aux proportions d'un téléphone.
    const cadre = () => {
      const ch = h * 0.72
      const cl = ch * 0.48
      return { x: (l - cl) / 2, y: (h - ch) / 2, l: cl, h: ch, r: 18 }
    }

    const aleatoire = (a: number, b: number) => a + Math.random() * (b - a)

    let points: Point[] = []
    const semer = () => {
      const c = cadre()
      points = Array.from({ length: 14 }, () => ({
        x: aleatoire(c.x + 14, c.x + c.l - 14),
        y: aleatoire(c.y + 14, c.y + c.h - 14),
        vx: aleatoire(-0.16, 0.16),
        vy: aleatoire(-0.16, 0.16),
        r: aleatoire(1.6, 3.2),
      }))
    }
    semer()

    /*
     * La tentative de sortie. Un point désigné part vers la droite, traverse le bord, et
     * s'efface dans les quarante pixels qui suivent. `avance` va de 0 à 1 puis reprend à
     * 0 après une pause — assez lente pour qu'on comprenne, assez rare pour ne pas
     * hypnotiser.
     */
    let avance = niveau === 'aucun' ? 0.55 : 0
    let attente = 0

    const peindre = () => {
      const c = cadre()
      const encre = jeton('--encre', '#e9eff6')
      const bord = jeton('--bord', 'rgba(255,255,255,0.18)')
      const accent = jeton('--accent', '#a9dcf5')
      const danger = jeton('--danger', '#f4aab6')

      ctx.clearRect(0, 0, l, h)

      // Le cadre.
      ctx.strokeStyle = bord
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(c.x, c.y, c.l, c.h, c.r)
      ctx.stroke()

      // Le haut-parleur, pour qu'on lise « téléphone » et non « rectangle ».
      ctx.beginPath()
      ctx.roundRect(c.x + c.l / 2 - 18, c.y + 10, 36, 4, 2)
      ctx.fillStyle = bord
      ctx.fill()

      // Les points, qui restent.
      ctx.fillStyle = accent
      for (const p of points) {
        ctx.globalAlpha = 0.75
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // La tentative de sortie.
      if (avance > 0) {
        const depart = { x: c.x + c.l - 20, y: c.y + c.h * 0.4 }
        const portee = 90
        const x = depart.x + avance * portee
        // Opaque tant qu'il est dedans, éteint dès le bord franchi.
        const dedans = x < c.x + c.l
        const reste = Math.max(0, 1 - (x - (c.x + c.l)) / 46)

        ctx.strokeStyle = danger
        ctx.globalAlpha = 0.5 * (dedans ? 1 : reste)
        ctx.setLineDash([3, 4])
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(depart.x, depart.y)
        ctx.lineTo(x, depart.y)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = danger
        ctx.globalAlpha = dedans ? 0.9 : reste * 0.9
        ctx.beginPath()
        ctx.arc(x, depart.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // La légende sous le cadre.
      ctx.fillStyle = encre
      ctx.globalAlpha = 0.55
      ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textAlign = 'center'
      ctx.fillText('localStorage', l / 2, c.y + c.h + 22)
      ctx.globalAlpha = 1
    }

    if (niveau === 'aucun') {
      peindre()
      const surRedimension = () => {
        dimensionner()
        semer()
        peindre()
      }
      window.addEventListener('resize', surRedimension)
      return () => window.removeEventListener('resize', surRedimension)
    }

    let image = 0
    let visible = true

    const boucle = () => {
      image = requestAnimationFrame(boucle)
      if (!visible) return

      const c = cadre()
      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        // Rebond sur les parois : c'est le propos du dessin, ils ne peuvent pas sortir.
        if (p.x < c.x + 10 || p.x > c.x + c.l - 10) p.vx *= -1
        if (p.y < c.y + 10 || p.y > c.y + c.h - 10) p.vy *= -1
      }

      if (attente > 0) attente -= 1
      else {
        avance += 0.006
        if (avance >= 1) {
          avance = 0
          attente = 90 // une seconse et demie de silence entre deux tentatives
        }
      }

      peindre()
    }
    image = requestAnimationFrame(boucle)

    const surVisibilite = () => {
      visible = document.visibilityState === 'visible'
    }
    const surRedimension = () => {
      dimensionner()
      semer()
    }
    document.addEventListener('visibilitychange', surVisibilite)
    window.addEventListener('resize', surRedimension)

    return () => {
      cancelAnimationFrame(image)
      document.removeEventListener('visibilitychange', surVisibilite)
      window.removeEventListener('resize', surRedimension)
    }
  }, [niveau])

  return (
    <figure>
      {/* Le canevas est décoratif ; la légende, elle, est lue. */}
      <canvas ref={toile} className="confid__toile" aria-hidden="true" />
      <figcaption className="texte-doux">{legende}</figcaption>
    </figure>
  )
}
