/*
 * Les écrans de l'application — de vraies captures, désormais.
 *
 * CE QU'IL Y AVAIT AVANT, ET POURQUOI CE N'EST PLUS LÀ
 * ---------------------------------------------------
 * Ce fichier reconstruisait quatre écrans en DOM et en CSS. Le raisonnement se tenait :
 * une reconstruction suit le thème et la langue toute seule, et ne pixellise pas sur un
 * écran dense. Mais elle crée une deuxième source de vérité sur le même produit, et c'est
 * toujours la deuxième qui dérive. La nôtre a fini par annoncer « Étape 2 sur 4 » quand
 * l'assistant en compte sept, par placer la journée courte le mercredi quand ce sont le
 * mardi et le jeudi, et par donner une adresse — « 12, rue de Huttange » — dans une rue
 * qui n'existe pas : toutes les rues de la commune sont en luxembourgeois. Rien de tout
 * cela ne pouvait être détecté, faute d'avoir quoi que ce soit à comparer.
 *
 * Une capture ne peut se tromper que d'une seule façon : vieillir. Et cela, `npm run
 * captures` suivi d'une comparaison le voit.
 *
 * LE THÈME, ET POURQUOI DEUX IMAGES PLUTÔT QU'UNE
 * ----------------------------------------------
 * Le visiteur peut basculer le thème depuis l'en-tête. Deux solutions sont donc exclues :
 *
 *   - `<picture>` avec `media="(prefers-color-scheme: …)"` ne voit que la préférence du
 *     système, jamais le choix manuel ;
 *   - choisir la source en React d'après l'état du thème rendrait l'hydratation
 *     incohérente avec le HTML pré-rendu.
 *
 * Les deux variantes sont donc dans le document, et la CSS en masque une — avec la même
 * cascade que `jetons.css` emploie pour les couleurs, ce qui garantit qu'image et page
 * basculent ensemble. Une image `loading="lazy"` dans un sous-arbre `display: none` n'est
 * pas téléchargée : une seule descend, l'autre à la demande si l'on bascule.
 *
 * L'APPAREIL RESTE `aria-hidden`
 * ------------------------------
 * L'argument d'origine ne faiblit pas, il se renforce : une capture contient PLUS de texte
 * incident qu'une maquette, et tout ce qu'elle montre est déjà dit en toutes lettres dans
 * la section d'à côté. Un lecteur d'écran qui la traverserait entendrait « 07:45, dans 16
 * min, Hovelange · Kneppchen » hors de tout contexte. Une image qui redit son voisinage
 * est décorative, et se déclare comme telle.
 */
import { HAUTEUR_IMAGE, LARGEUR_IMAGE, THEMES, fichierCapture } from '../contenu/captures.ts'
import type { NomEcran } from '../contenu/captures.ts'
import { useLangue } from '../i18n/contexte.ts'

/**
 * Une capture de l'application, dans la langue courante et dans les deux thèmes.
 *
 * `width`/`height` portent les dimensions réelles du fichier : le rapport est donc connu
 * avant que le moindre octet n'arrive, et la page ne sursaute pas au chargement.
 */
export function Capture({ ecran }: { ecran: NomEcran }) {
  const { langue } = useLangue()

  return (
    <span className="capture">
      {THEMES.map((theme) => (
        <img
          key={theme}
          className={`capture__vue capture__vue--${theme}`}
          src={`${import.meta.env.BASE_URL}${fichierCapture(ecran, langue, theme)}`}
          width={LARGEUR_IMAGE}
          height={HAUTEUR_IMAGE}
          alt=""
          /*
           * `lazy` PARTOUT, y compris pour le héros, et c'est ce qui fait descendre un
           * seul fichier au lieu de deux : une image différée dans un sous-arbre
           * `display: none` n'est pas demandée. L'image du thème courant, elle, est dans
           * le champ de vision et part immédiatement malgré l'attribut.
           *
           * Et surtout : pas de `fetchPriority="high"`. React en déduit un
           * `<link rel="preload">` SANS `media`, qui rapatrie la capture claire même chez
           * un visiteur en thème sombre — soit exactement le doublon que les deux
           * annonces conditionnelles d'`entree-serveur.ts` sont là pour éviter. L'avance
           * du héros vient de là, et de nulle part ailleurs.
           */
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ))}
    </span>
  )
}
