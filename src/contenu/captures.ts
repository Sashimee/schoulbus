/*
 * Les captures de l'application : ce qu'on photographie, et sous quel nom.
 *
 * Ce fichier est lu par TROIS lecteurs, et c'est toute sa raison d'être :
 *
 *   - `scripts/captures.mjs`  engendre les images ;
 *   - `src/composants/Ecrans.tsx`  les affiche ;
 *   - `src/tests/rendu.test.ts`  vérifie qu'aucune n'est annoncée sans exister.
 *
 * Même discipline que `imagePartage()` dans `config.ts`, et pour la même raison : une
 * règle de nommage recopiée dans le script qui écrit et dans la composante qui lit finit
 * par diverger, et la balise pointe alors vers un fichier que plus personne n'engendre.
 *
 * POURQUOI DES CAPTURES, ALORS QUE C'ÉTAIENT DES MAQUETTES
 * -------------------------------------------------------
 * Les écrans étaient reconstruits en DOM et en CSS. L'intention était bonne — thème et
 * langue suivis automatiquement, pas de flou sur écran dense — mais une reconstruction
 * est une deuxième source de vérité sur le même produit, et c'est la deuxième qui dérive.
 * La nôtre annonçait « Étape 2 sur 4 » quand l'assistant en compte sept, plaçait la
 * journée courte le mercredi quand ce sont le mardi et le jeudi, et citait une rue qui
 * n'existe pas dans la commune. Trois erreurs qu'aucun test ne pouvait voir, parce qu'il
 * n'y avait rien à comparer.
 *
 * Une capture, elle, ne peut mentir que d'une seule façon : être vieille. Et cela, un
 * contrôle de dérive le voit.
 */
import type { Langue } from './type.ts'

/** Les thèmes de l'application, du même nom que dans `theme.ts`. */
export type Theme = 'clair' | 'sombre'
export const THEMES: Theme[] = ['clair', 'sombre']

/**
 * Les quatre écrans montrés.
 *
 * L'ORDRE EST CELUI DE LA BANDE DE LA PAGE, et il a changé avec la refonte : on commence
 * par l'écran du matin, qui est le produit, et on finit par l'assistant, qu'on ne voit
 * qu'une fois. On montrait le plan d'abord, du temps où la page racontait le problème
 * avant de montrer la solution — la page ne raconte plus, elle montre.
 *
 * `Ecrans.tsx` apparie cette liste à `contenu.ecrans.cartes` PAR POSITION : les deux
 * listes ont donc le même ordre, et `contenu.test.ts` vérifie qu'elles ont la même
 * longueur dans les cinq langues.
 */
export type NomEcran = 'plan' | 'assistant' | 'aujourdhui' | 'semaine'

export type Ecran = {
  nom: NomEcran
  /** Le chemin dans l'application, sans le préfixe de base. */
  chemin: string
  /**
   * Ce qui doit être à l'écran avant la prise.
   *
   * Un sélecteur, jamais `networkidle` : l'application ouvre une carte et relit deux
   * fichiers à chaque ouverture, donc le réseau ne se tait pas au moment où la page est
   * prête, mais bien après.
   *
   * Et un sélecteur qui désigne LE CONTENU de l'écran, pas son enveloppe. Attendre `main`
   * ne prouve rien : la balise est là avant que l'écran ne se remplisse, et l'assistant
   * sortait une fois sur trois avec un formulaire vide au milieu de la page. Chaque
   * sélecteur ci-dessous nomme donc quelque chose qui n'existe qu'une fois l'écran fait.
   * Aucun ne dépend de la langue : ce sont des formes, pas des mots.
   */
  pret: string

  /**
   * `pret` doit-il être présent AUTANT DE FOIS qu'il y a d'enfants ?
   *
   * L'accueil pose une carte par enfant. Attendre la première, c'est pouvoir
   * photographier un foyer à moitié rendu — et c'est exactement ce qui est arrivé :
   * une capture sur trois ne montrait qu'un enfant sur deux.
   */
  parEnfant?: boolean
  /**
   * L'élément à amener en haut de l'écran avant la prise, s'il en faut un.
   *
   * Un sélecteur plutôt qu'un nombre de pixels : le même écran n'a pas la même hauteur
   * dans les cinq langues — l'allemand et le luxembourgeois débordent là où le français
   * tient —, et un défilement de 1 400 px cadrerait juste dans une langue et de travers
   * dans les quatre autres. Déclaré ici plutôt que
   * deviné dans le script, pour qu'une capture prise « un peu plus bas » reste refaisable
   * à l'identique par quelqu'un d'autre.
   */
  cadrer?: string
}

/*
 * L'identifiant de l'enfant est `partage-0` : c'est le décodeur de l'application qui le
 * pose (`decoderFoyer` numérote les enfants d'un lien importé). Rien à découvrir donc,
 * et surtout rien à extraire d'un stockage interne.
 */
export const ECRANS: Ecran[] = [
  // Le lien « Voir la semaine » d'une carte d'enfant : pas de carte, pas de lien.
  { nom: 'aujourdhui', chemin: '/', pret: 'a[href*="/enfant/"]', parEnfant: true },
  { nom: 'semaine', chemin: '/enfant/partage-0', pret: '.leaflet-container' },
  // Le haut de `/plan` porte les avertissements ; ce qu'on veut montrer, ce sont les
  // horaires recopiés. On cadre donc sur le premier tableau.
  { nom: 'plan', chemin: '/plan', pret: 'table', cadrer: 'table' },
  // Le champ « Prénom » de la première étape : il n'apparaît qu'une fois le formulaire monté.
  { nom: 'assistant', chemin: '/enfant/partage-0/assistant', pret: 'input' },
]

/*
 * Les dimensions, et d'où elles viennent.
 *
 * `--vitrine-appareil-l` vaut 390 px et `--vitrine-appareil-h` 844 px ; `.appareil` porte
 * 10 px de rembourrage sur chaque côté. L'écran utile fait donc 370 × 824, et une capture
 * à ces dimensions remplit `.appareil__ecran` exactement — sans recadrage, sans étirement,
 * et sans qu'un jour quelqu'un ait à se demander où sont passés les bords.
 */
export const LARGEUR = 370
export const HAUTEUR = 824
/** Deux suffit : au-delà, le poids double pour un gain qu'aucun œil ne relève ici. */
export const DENSITE = 2

/** Les dimensions intrinsèques du fichier, à porter en `width`/`height` sur l'image. */
export const LARGEUR_IMAGE = LARGEUR * DENSITE
export const HAUTEUR_IMAGE = HAUTEUR * DENSITE

/**
 * L'instant simulé pendant la prise : mardi 22 septembre 2026, 07:25, heure du Luxembourg.
 *
 * Il n'est pas choisi au hasard, et chacune de ses propriétés a été vérifiée dans les
 * données de l'application :
 *
 *   - dans la validité du plan (`valideDu` 2025-09-15 → `valideAu` 2027-07-15) ;
 *   - dans l'année scolaire 2026/2027, dont le calendrier est complet ;
 *   - hors vacances et hors jour férié — sans quoi l'écran d'accueil dirait « Pas d'école
 *     aujourd'hui », ce qui est exact mais ne montre rien ;
 *   - un MARDI, c'est-à-dire l'une des deux journées sans classe l'après-midi. La maquette
 *     qu'on remplace se trompait précisément là-dessus ; la capture rend le fait visible
 *     plutôt que simplement absent.
 *
 * Quelques minutes avant le départ, pour que le décompte de l'accueil ait un sens : c'est
 * lui qui porte l'idée que l'heure affichée est celle où il faut SORTIR, marche déduite.
 */
export const INSTANT_DEMO = '2026-09-22T05:25:00.000Z'

/**
 * Le foyer de démonstration.
 *
 * Des données vraies, une famille qui n'existe pas. La fiche de la semaine dessine le
 * voisinage réel de l'adresse au moyen d'une carte : il n'était donc question ni de
 * l'adresse du mainteneur, ni du pas-de-porte d'un inconnu. D'où une adresse AU NIVEAU DE
 * LA RUE — « Am Gaart », une rue réelle de Hovelange, prise en son milieu — plutôt qu'à un
 * numéro. La commune est reconnaissable, la maison ne l'est pas.
 *
 * Deux enfants, pour que la feuille « toute la famille » et la reprise d'un cadet sur son
 * aîné ne soient pas des promesses qu'aucune image n'appuie.
 */
export const FOYER_DEMO = {
  libelle: 'Am Gaart',
  localite: 'Hovelange',
  coord: [49.72296, 5.90665] as [number, number],
  enfants: [
    { prenom: 'Léa', cycle: 'c2' },
    { prenom: 'Noah', cycle: 'c4' },
  ],
}

/**
 * Le nom du fichier d'une capture.
 *
 * Une seule règle, trois lecteurs. Changer ce format sans régénérer les images casse la
 * page en silence — c'est ce que le test d'existence est là pour empêcher.
 */
export function fichierCapture(ecran: NomEcran, langue: Langue, theme: Theme): string {
  return `captures/${ecran}-${langue}-${theme}.webp`
}
