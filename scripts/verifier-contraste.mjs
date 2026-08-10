/*
 * Vérifie que chaque couple encre/fond de la vitrine tient 4,5:1.
 *
 *     node scripts/verifier-contraste.mjs
 *
 * Pourquoi un script et non une relecture à l'œil : les surfaces de la charte sont des
 * VOILES, pas des couleurs. Une encre ne se vérifie donc pas contre une valeur mais
 * contre une composition — arrêt du dégradé, halo décoratif, un voile de verre. C'est la
 * méthode du lot 18 de l'application, reprise ici parce que la vitrine ajoute une
 * composition que l'application n'avait pas : le nuage WebGL, dont le point le plus clair
 * n'est pas celui du dégradé CSS.
 *
 * Le cas dimensionnant est toujours le même : l'encre la plus douce, sur le point le plus
 * clair du fond, sous le voile le plus épais. S'il passe, tous les autres passent.
 *
 * Ce script ne remplace pas une vérification à la pipette sur un écran réel — il calcule
 * ce que le navigateur devrait composer, pas ce qu'il compose. La réserve reste ouverte.
 */

const lin = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
const luminance = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const contraste = (a, b) => {
  const l1 = Math.max(luminance(a), luminance(b))
  const l2 = Math.min(luminance(a), luminance(b))
  return (l1 + 0.05) / (l2 + 0.05)
}
/** Un voile blanc d'opacité `alpha` posé sur `fond`. */
const voile = (fond, alpha) => fond.map((c) => c * (1 - alpha) + 255 * alpha)
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16))

const SEUIL = 4.5

/*
 * Le point le plus clair de chaque thème.
 *
 * En sombre, c'est l'arrêt c0 du dégradé (#142b47) auquel le nuage AJOUTE son halo
 * d'accent — l'addition, contrairement au fondu du CSS, ne peut qu'éclaircir. En clair,
 * c'est l'arrêt le plus lumineux, et le halo y est trop faible pour compter.
 */
const THEMES = {
  sombre: {
    fondClair: hex('#142b47').map((c, i) => c + hex('#2f7fb8')[i] * 0.1),
    encre: hex('#e9eff6'),
    encreDouce: hex('#c2cdda'),
    accent: hex('#a9dcf5'),
    danger: hex('#f4aab6'),
    attention: hex('#ecc386'),
  },
  clair: {
    // En thème clair, le pire cas est le fond le plus SOMBRE : les encres y sont foncées.
    fondClair: hex('#cfd8e2'),
    encre: hex('#151a20'),
    encreDouce: hex('#4a5262'),
    accent: hex('#12395f'),
    danger: hex('#8f1f2b'),
    attention: hex('#6b4300'),
  },
}

/*
 * Les voiles de la charte. `--surface-haute` n'y figure pas : dans la vitrine, il ne sert
 * qu'au survol d'un bouton discret, dont le libellé est en `--encre` — le cas est couvert
 * par la ligne « encre sur le rail », qui a la même opacité.
 */
const VOILES = {
  sombre: { surface: 0.07, rail: 0.12 },
  clair: { surface: 0.55, rail: 0.6 },
}

/**
 * Les couples RÉELLEMENT composés par la page, et eux seuls.
 *
 * Tester le produit cartésien de toutes les encres par tous les voiles produit des échecs
 * pour des combinaisons qui n'existent nulle part — `--danger` sur le rail flottant, par
 * exemple, alors qu'aucun texte d'alerte n'y est jamais posé. Un échec fantôme finit par
 * s'ignorer, et le jour où un vrai apparaît, on l'ignore aussi.
 *
 * Chaque ligne cite donc où le couple se rencontre. Ajouter un couple ici est le prix à
 * payer pour poser une couleur de texte sur une surface où elle n'allait pas encore.
 */
function couples(t, v) {
  return [
    ['encre', t.encre, 0, 'corps de texte, titres'],
    ['encre-douce', t.encreDouce, 0, 'chapeaux, légendes, texte de pied de page'],
    ['accent', t.accent, 0, 'heure géante du héros, liens'],
    ['encre', t.encre, v.surface, 'titre de tuile, texte de carte'],
    ['encre-douce', t.encreDouce, v.surface, 'texte de tuile, étiquette'],
    ['accent', t.accent, v.surface, 'heure dans une carte, icône de puce'],
    ['attention', t.attention, v.surface, 'étiquette « sans réseau »'],
    ['encre', t.encre, v.rail, 'marque et bouton de l’en-tête flottant'],
    ['encre-douce', t.encreDouce, v.rail, 'langue et thème non sélectionnés'],
    ['accent', t.accent, v.rail, 'entrée courante du rail de la maquette'],
  ]
}

let echecs = 0

for (const [nomTheme, t] of Object.entries(THEMES)) {
  console.log(`\nThème ${nomTheme}`)
  for (const [nomEncre, encre, alpha, ou] of couples(t, VOILES[nomTheme])) {
    const fond = alpha === 0 ? t.fondClair : voile(t.fondClair, alpha)
    const r = contraste(encre, fond)
    const ok = r >= SEUIL
    if (!ok) echecs++
    console.log(
      `  ${ok ? 'ok   ' : 'ÉCHEC'} ${r.toFixed(2).padStart(5)}:1   ${nomEncre.padEnd(11)} — ${ou}`,
    )
  }
}

if (echecs > 0) {
  console.error(`\n${echecs} couple(s) sous ${SEUIL}:1. Ne pas publier en l'état.`)
  process.exit(1)
}
console.log(`\nTous les couples tiennent ${SEUIL}:1.`)
