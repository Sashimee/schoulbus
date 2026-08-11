/*
 * Le téléphone dessiné, et la capture qu'on y pose.
 *
 * L'appareil est décoratif au sens strict : `aria-hidden`. Tout ce qu'il montre est dit
 * en toutes lettres dans le texte de la section qui l'accompagne — un lecteur d'écran
 * qui le traverserait entendrait « 07:45, dans 16 min, Hovelange · Kneppchen » sans
 * contexte, et perdrait le fil du récit. Une image d'écran est une image.
 *
 * Ce qu'il contient n'est plus une maquette reconstruite mais une vraie capture de
 * l'application (voir `Ecrans.tsx`), et cela ne change pas la décision ci-dessus : une
 * capture porte encore plus de texte incident qu'une maquette, et pas un mot qu'un
 * attribut `alt` pourrait dire sans répéter la section d'à côté.
 *
 * Le basculement suit le pointeur, avec très peu d'amplitude (5°). Au-delà, la maquette
 * cesse d'être un objet posé sur la page pour devenir un jouet, et les textes qu'elle
 * contient deviennent illisibles dans les angles.
 */
import { useEffect, useRef, type ReactNode } from 'react'
import { useNiveauMouvement } from '../mouvement/useNiveauMouvement.ts'

const INCLINAISON_MAX = 5

export function Appareil({
  children,
  incline = false,
  /** Le contenu est-il une capture opaque ? Alors l'écran ne peint rien dessous. */
  capture = false,
}: {
  children: ReactNode
  incline?: boolean
  capture?: boolean
}) {
  const scene = useRef<HTMLDivElement>(null)
  const corps = useRef<HTMLDivElement>(null)
  const niveau = useNiveauMouvement()

  useEffect(() => {
    if (!incline || niveau !== 'complet') return
    const noeud = corps.current
    const cadre = scene.current
    if (!noeud || !cadre) return

    let cx = 0
    let cy = 0
    let x = 0
    let y = 0
    let image = 0

    const surDeplacement = (e: PointerEvent) => {
      const boite = cadre.getBoundingClientRect()
      // Normalisé sur la moitié de la fenêtre : l'appareil réagit à toute la page, pas
      // seulement quand la souris le survole — c'est ce qui lui donne l'air posé dans
      // une scène plutôt que collé au fond.
      cx = (e.clientX - (boite.left + boite.width / 2)) / (window.innerWidth / 2)
      cy = (e.clientY - (boite.top + boite.height / 2)) / (window.innerHeight / 2)
    }

    const boucle = () => {
      x += (cx - x) * 0.05
      y += (cy - y) * 0.05
      const ry = Math.max(-1, Math.min(1, x)) * INCLINAISON_MAX
      const rx = Math.max(-1, Math.min(1, y)) * -INCLINAISON_MAX
      noeud.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      image = requestAnimationFrame(boucle)
    }
    image = requestAnimationFrame(boucle)

    window.addEventListener('pointermove', surDeplacement, { passive: true })
    return () => {
      cancelAnimationFrame(image)
      window.removeEventListener('pointermove', surDeplacement)
      noeud.style.transform = ''
    }
  }, [incline, niveau])

  return (
    <div ref={scene} className="appareil__scene" aria-hidden="true">
      <div ref={corps} className="appareil">
        <div className={`appareil__ecran${capture ? ' appareil__ecran--capture' : ''}`}>
          {/* Sous une capture opaque, les deux lueurs ne se verraient pas : on ne les
              monte pas plutôt que de les peindre pour rien. */}
          {!capture && (
            <>
              <div className="appareil__lueur appareil__lueur--haut" />
              <div className="appareil__lueur appareil__lueur--bas" />
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
