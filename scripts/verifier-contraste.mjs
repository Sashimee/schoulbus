/*
 * Vérifie que chaque couple encre/fond de la vitrine tient son seuil.
 *
 *     node scripts/verifier-contraste.mjs
 *
 * CE QUI A CHANGÉ AVEC LA REFONTE, ET POURQUOI CE SCRIPT EST DEVENU PLUS SIMPLE
 * ---------------------------------------------------------------------------
 * Il calculait des COMPOSITIONS : les surfaces de l'application sont des voiles blancs
 * translucides posés sur un dégradé, parfois sous un halo, parfois sous le nuage WebGL.
 * Une encre ne s'y vérifiait donc pas contre une couleur mais contre un empilement, et le
 * cas dimensionnant — l'encre la plus douce, sur le point le plus clair du fond, sous le
 * voile le plus épais — devait être reconstruit à la main.
 *
 * La charte de la vitrine est faite de surfaces OPAQUES. Il n'y a plus d'empilement à
 * simuler : un couple est deux couleurs, et le rapport se calcule exactement. Ce que le
 * script perd en subtilité, il le gagne en fiabilité — il ne calcule plus ce que le
 * navigateur DEVRAIT composer, il calcule ce qu'il compose.
 *
 * DEUX SEUILS, ET LA RAISON DE CHACUN
 * -----------------------------------
 * 4,5:1 pour tout ce qui est du texte courant — c'est le niveau AA, et c'est celui que le
 * projet s'impose partout.
 *
 * 3:1 pour deux choses seulement, et ce n'est pas un assouplissement de confort : c'est
 * le seuil que la norme fixe pour les GRANDS caractères (>= 24 px, ou >= 18,66 px en
 * gras) et pour les éléments non textuels. Le corail vif `--vitrine-corail` ne sert qu'à
 * cela — le mot « seize minutes » du titre final, dessiné entre 28 et 42 px en graisse
 * 600, et le tracé d'une icône de 20 px. Partout où le corail devient du texte courant,
 * c'est `--vitrine-corail-encre` qui le porte, et lui est vérifié à 4,5.
 *
 * Chaque couple cite où il se rencontre. Tester le produit cartésien de toutes les encres
 * par tous les fonds produirait des échecs pour des combinaisons qui n'existent nulle
 * part, et un échec fantôme finit par s'ignorer — le jour où un vrai apparaît, on l'ignore
 * aussi. Ajouter une ligne ici est le prix à payer pour poser une couleur de texte sur un
 * fond où elle n'allait pas encore.
 *
 * Ce script ne remplace pas une vérification à la pipette sur un écran réel. La réserve
 * reste ouverte.
 */

const lin = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
const luminance = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16))
const contraste = (a, b) => {
  const l1 = Math.max(luminance(hex(a)), luminance(hex(b)))
  const l2 = Math.min(luminance(hex(a)), luminance(hex(b)))
  return (l1 + 0.05) / (l2 + 0.05)
}

/*
 * Les deux palettes, recopiées de la couche `vitrine` de `src/styles/vitrine.css`.
 *
 * Recopiées, oui — c'est une duplication, et elle est assumée pour la même raison que
 * `jetons.css` est une copie de l'application : un script Node ne peut pas lire une
 * variable CSS calculée par un navigateur. Le garde-fou n'est pas l'absence de copie,
 * c'est que ce script échoue bruyamment si la copie et l'original divergent d'assez pour
 * faire tomber un couple sous son seuil.
 */
const THEMES = {
  clair: {
    fond: '#fbf6ef',
    bande: '#f6efe4',
    creux: '#f3ebdf',
    surface: '#fffdf9',
    panneau: '#0b3f45',
    corailPale: '#fcede7',
    sarcellePale: '#e3edeb',

    encre: '#1c2725',
    encreDouce: '#4a5654',
    encreFaible: '#5a6664',
    sarcelle: '#0f5a61',
    sarcelleForte: '#0b3f45',
    corail: '#d9502f',
    corailEncre: '#a9381f',
    /* Assombri depuis la maquette (`#B77410`, 3,75:1) : il porte la puce d'une nuance
       qu'on doit pouvoir lire. Même teinte, même rôle, 5,69:1. */
    ambre: '#8f5a0b',
    surPanneau: '#eaf2f0',
    surPanneau2: '#c6dad8',
    surPanneau3: '#9cc7c6',
    surPlein: '#fbf6ef',
  },
  sombre: {
    fond: '#121a19',
    bande: '#171f1e',
    creux: '#1d2725',
    surface: '#1a2422',
    panneau: '#0d3a40',
    corailPale: '#3a2018',
    sarcellePale: '#16302f',

    encre: '#f2ece3',
    encreDouce: '#c4ccc9',
    encreFaible: '#9ba6a3',
    sarcelle: '#6fc3c6',
    sarcelleForte: '#a5dedf',
    corail: '#ff8c66',
    corailEncre: '#ffae91',
    ambre: '#e0a44e',
    surPanneau: '#eaf2f0',
    surPanneau2: '#c6dad8',
    surPanneau3: '#9cc7c6',
    surPlein: '#0b2a2e',
  },
}

/** Les couples de TEXTE COURANT. Seuil 4,5:1. */
function couplesTexte(t) {
  return [
    ['encre', t.encre, t.fond, 'titres et corps, sur le fond de page'],
    ['encre', t.encre, t.bande, 'titres des bandes teintées (écrans, limites)'],
    ['encre', t.encre, t.surface, 'titre de tuile, titre de carte, texte du bloc final'],
    ['encre', t.encre, t.creux, 'rien pour l’instant — gardé : le creux accueille du texte'],
    ['encre-douce', t.encreDouce, t.fond, 'gloses du héros, chapeau final'],
    ['encre-douce', t.encreDouce, t.bande, 'note de la bande des écrans'],
    ['encre-douce', t.encreDouce, t.surface, 'points de la carte « à l’arrêt »'],
    ['encre-faible', t.encreFaible, t.fond, 'légende de la capture du héros'],
    ['encre-faible', t.encreFaible, t.bande, 'texte des cartes d’écran, des limites'],
    ['encre-faible', t.encreFaible, t.surface, 'texte de tuile, libellé de chiffre'],
    ['encre-faible', t.encreFaible, t.creux, 'légende « départ · Kneppchen » de la tuile finale'],
    ['sarcelle', t.sarcelle, t.fond, 'liens, sur-titres en chasse fixe'],
    ['sarcelle', t.sarcelle, t.bande, 'lien « Lire la page Limites »'],
    ['sarcelle', t.sarcelle, t.surface, 'icônes des tuiles, puces de la carte claire'],
    ['sarcelle-forte', t.sarcelleForte, t.fond, 'valeurs des annotations du héros'],
    ['sarcelle-forte', t.sarcelleForte, t.surface, 'nombres de la bande de chiffres'],
    ['sarcelle-forte', t.sarcelleForte, t.creux, 'l’heure de la tuile finale'],
    ['sarcelle-forte', t.sarcelleForte, t.sarcellePale, 'étiquette calme du héros'],
    ['corail-encre', t.corailEncre, t.fond, 'la valeur du décompte, dans le héros'],
    ['corail-encre', t.corailEncre, t.bande, 'la note « six limites… »'],
    ['corail-encre', t.corailEncre, t.creux, 'le zéro de la bande de chiffres'],
    ['corail-encre', t.corailEncre, t.corailPale, 'l’étiquette « bientôt disponible »'],
    ['ambre', t.ambre, t.surface, 'la puce de la nuance, dans la carte « à l’arrêt »'],
    ['sur-panneau', t.surPanneau, t.panneau, 'le titre de la carte sombre'],
    ['sur-panneau-2', t.surPanneau2, t.panneau, 'le texte de la carte sombre'],
    ['sur-panneau-3', t.surPanneau3, t.panneau, 'l’étiquette de la carte sombre'],
    ['sur-plein', t.surPlein, t.sarcelle, 'le libellé du bouton principal'],
  ]
}

/**
 * Les couples de GRANDS CARACTÈRES et d'éléments non textuels. Seuil 3:1.
 *
 * Deux, et il ne doit jamais y en avoir un troisième sans qu'on écrive ici pourquoi.
 */
function couplesGrands(t) {
  return [
    ['corail', t.corail, t.surface, '« seize minutes » du titre final — 28 à 42 px, graisse 600'],
    ['corail', t.corail, t.surface, 'le tracé de l’icône « perturbations » — 20 px, non textuel'],
  ]
}

const SEUIL_TEXTE = 4.5
const SEUIL_GRAND = 3

let echecs = 0

for (const [nomTheme, t] of Object.entries(THEMES)) {
  console.log(`\nThème ${nomTheme}`)
  for (const [groupe, couples, seuil] of [
    ['texte courant', couplesTexte(t), SEUIL_TEXTE],
    ['grands caractères et graphiques', couplesGrands(t), SEUIL_GRAND],
  ]) {
    console.log(`  ${groupe} (>= ${seuil}:1)`)
    for (const [nom, encre, fond, ou] of couples) {
      const r = contraste(encre, fond)
      const ok = r >= seuil
      if (!ok) echecs++
      console.log(
        `    ${ok ? 'ok   ' : 'ÉCHEC'} ${r.toFixed(2).padStart(5)}:1   ${nom.padEnd(14)} — ${ou}`,
      )
    }
  }
}

if (echecs > 0) {
  console.error(`\n${echecs} couple(s) sous leur seuil. Ne pas publier en l'état.`)
  process.exit(1)
}
console.log('\nTous les couples tiennent leur seuil.')
