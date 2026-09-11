/*
 * Point d'entrée du navigateur.
 *
 * Deux démarrages possibles, et il faut choisir le bon :
 *
 *  - En production, la page arrive déjà rendue en HTML statique (`scripts/prerendu.mjs`).
 *    `hydrateRoot` reprend la main sur cet arbre au lieu de le reconstruire — sans quoi
 *    la page clignoterait, et tout l'intérêt du pré-rendu serait perdu.
 *  - En développement, `index.html` n'est qu'un gabarit : le conteneur est vide, et
 *    `hydrateRoot` échoue bruyamment avant de tout refaire à la main.
 *
 * La distinction se fait sur l'état réel du conteneur, pas sur `import.meta.env.DEV` :
 * c'est la présence de contenu qui décide si l'on hydrate, et ce sera vrai aussi le jour
 * où l'on servira le build depuis `vite preview`.
 *
 * La langue est déduite de l'adresse, exactement comme au pré-rendu : les deux doivent
 * donner le même arbre, sinon React jette l'HTML reçu et refait tout.
 *
 * ON ATTEND LE DICTIONNAIRE AVANT D'HYDRATER. Les cinq langues étaient dans le paquet ;
 * chacune est maintenant un morceau qu'on va chercher, et `import()` n'est pas synchrone.
 * Attendre ne fait pourtant rien clignoter : le document est déjà pré-rendu, complet et
 * dans la bonne langue, et React ne touche au DOM qu'au moment où elle s'y accroche. Ce
 * qui arrive quelques millisecondes plus tard n'est pas la page, c'est son interactivité —
 * exactement le marché déjà passé pour `lenis` et pour `motion`.
 */
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { Independance } from './pages/Independance.tsx'
import { Contact } from './pages/Contact.tsx'
import { Mentions } from './pages/Mentions.tsx'
import { FournisseurI18n } from './i18n/Fournisseur.tsx'
import { langueDuChemin, pageDuChemin } from './i18n/contexte.ts'
import { chargerContenu } from './i18n/registre.ts'
import './styles/vitrine.css'

const racine = document.getElementById('racine')

if (racine) {
  // La page se déduit de l'adresse, comme la langue, et pour la même raison : le
  // pré-rendu a fait le même calcul, et les deux arbres doivent coïncider.
  const page = pageDuChemin(window.location.pathname)
  const langue = langueDuChemin(window.location.pathname)

  // Le seul point du démarrage qui attend. Le document reste à l'écran pendant ce temps.
  await chargerContenu(langue)

  const arbre = (
    <StrictMode>
      <FournisseurI18n langueInitiale={langue} pageInitiale={page}>
        {page === 'mentions' ? (
          <Mentions />
        ) : page === 'independance' ? (
          <Independance />
        ) : page === 'contact' ? (
          <Contact />
        ) : (
          <App />
        )}
      </FournisseurI18n>
    </StrictMode>
  )

  // `childElementCount` et non `childNodes` : le gabarit contient un commentaire de
  // substitution, qui est un nœud sans être un élément.
  if (racine.childElementCount > 0) hydrateRoot(racine, arbre)
  else createRoot(racine).render(arbre)
}
