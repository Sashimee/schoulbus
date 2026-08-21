/*
 * Français — la version de référence.
 *
 * Les quatre autres langues sont traduites depuis celle-ci, et non l'inverse : c'est la
 * langue de l'application, celle de son code, et celle du document officiel dont tout
 * part.
 *
 * Ton : ce site ne vend rien. Il décrit ce qu'une application fait, et dit dans la même
 * page ce qu'elle ne sait pas faire. La section « Limites » vient AVANT l'appel final,
 * délibérément — c'est l'ordre qu'a choisi l'application elle-même.
 *
 * Le registre à viser est celui de l'application, pas celui d'une page de vente : énoncer
 * une situation, puis ce que le logiciel en fait. Pas d'aphorisme, pas d'antithèse, pas de
 * phrase qui se félicite. « Vous le déposez au Dillendapp le lundi, vous venez le chercher
 * le jeudi » vaut mieux que « chaque chose à sa place ».
 *
 * LA REFONTE A RACCOURCI PRESQUE TOUT. Une tuile qui tenait en un paragraphe tient en une
 * ligne, une limite aussi. Ce n'est pas un allègement cosmétique : la page se lit debout,
 * une fois, souvent sur un téléphone, et ce qui n'était lu par personne ne protégeait
 * personne. Le détail n'a pas disparu — il est dans l'application, sur sa page
 * « Limites », vers laquelle cette section-ci renvoie.
 *
 * DEUX CONTRAINTES DURES, à relire avant toute retouche :
 *
 *  1. Les nombres du héros et de l'appel final sont CEUX DES CAPTURES. Le lecteur voit
 *     l'écran à côté de la phrase ; s'ils divergent, c'est la phrase qu'il croira fausse.
 *     Ils viennent de `src/contenu/captures.ts` (mardi 22 septembre 2026, 07:25) et se
 *     lisent sur `public/captures/aujourdhui-fr-*.webp` : Léa part à 07:45, dans 16 min,
 *     depuis Hovelange · Kneppchen, à 4 min de marche ; Noah part à 07:44.
 *  2. `heros.titre` est dessiné dans les vignettes de partage à 76 px sur 1200 px de large
 *     (`scripts/build-partage.mjs`) : 24 CARACTÈRES PAR LIGNE AU PLUS, et
 *     `npm run assets:partage` après chaque changement, sans quoi la vignette et la page
 *     ne disent plus la même chose.
 */
import type { Contenu } from './type.ts'
import {
  ADRESSE_EDITEUR,
  NOM_EDITEUR,
  URL_APP,
  URL_CREDITS,
  URL_INDEPENDANCE,
  URL_LIMITES,
} from '../config.ts'
import { CHIFFRES } from './chiffres.ts'

export const fr: Contenu = {
  langue: 'fr',
  codeLangue: 'fr',

  meta: {
    titre: 'Bus scolaire Beckerich — les horaires de vos enfants, sans y réfléchir',
    description:
      `Le plan du bus scolaire de la commune de Beckerich, personnalisé pour chaque enfant : ` +
      `son arrêt, son heure, son école. Hors ligne, sans compte. ` +
      `Site indépendant, sans lien avec la commune ni avec l'école.`,
  },

  general: {
    marque: 'Bus scolaire Beckerich',
    sautContenu: 'Aller au contenu',
    ouvrirApp: 'Ouvrir l’application',
    fermer: 'Fermer',
    theme: 'Thème',
    themeClair: 'Clair',
    themeSombre: 'Sombre',
    choixLangue: 'Langue',
    bientot: 'Bientôt disponible',
  },

  heros: {
    etiquette: `Site indépendant · ${CHIFFRES.anneesCouvertes.join(' · ')}`,
    // 17 et 18 signes : sous la limite de 24 de la vignette de partage.
    titre: ['Ce que vous voyez', 'à 07:25, un mardi.'],
    altCapture: `Écran d’accueil de l’application : la carte de Léa, bus à 07:45 au Kneppchen.`,
    lignes: [
      { valeur: '07:45', texte: 'l’heure de son bus, à son arrêt' },
      {
        valeur: '16 min',
        texte: 'avant de sortir, les 4 minutes de marche déjà déduites',
        compte: true,
      },
      { valeur: 'Kneppchen', texte: 'l’arrêt le plus proche de votre adresse' },
      { valeur: 'Léa · Noah', texte: 'une carte par enfant, dans l’ordre des départs' },
    ],
    actionPrincipale: 'Ouvrir l’application',
    actionSecondaire: 'Ce que le site ne sait pas',
    legende: 'Capture réelle · 22 septembre 2026, 07:25',
  },

  chiffres: {
    arrets: 'arrêts desservis',
    villages: 'villages de la commune',
    langues: 'langues, dont le luxembourgeois',
    envoi: 'donnée de famille envoyée à un serveur',
    envoiValeur: '0',
    envoiNote:
      `Deux choses sortent quand même : l'application compte ses pages vues, et activer ` +
      `les notifications dépose un identifiant d'appareil anonyme sur un serveur, le temps ` +
      `de l'abonnement. Ni votre adresse, ni les prénoms, ni les cycles.`,
  },

  ecrans: {
    titre: 'Quatre écrans, et c’est tout le produit.',
    note: `De vraies captures de l’application, mardi 22 septembre 2026 à 07:25.`,
    cartes: [
      { titre: 'L’écran du matin', texte: 'Une heure par enfant, et rien d’autre.' },
      { titre: 'La fiche de la semaine', texte: 'Cinq jours, et la carte du trajet à pied.' },
      {
        titre: 'Le plan officiel, recopié',
        texte: `${CHIFFRES.lignes} lignes, ${CHIFFRES.arrets} arrêts, tableau par tableau.`,
      },
      { titre: 'Sept questions, une fois', texte: 'L’adresse décide de l’arrêt, le cycle de l’école.' },
    ],
  },

  fonctions: {
    etiquette: 'Ce qu’il y a dedans',
    titre: 'Neuf réponses à neuf matins qui ne se ressemblent pas.',
    tuiles: [
      {
        icone: 'semaine',
        titre: 'La fiche de la semaine',
        texte: 'Les cinq jours d’un enfant sur un écran.',
      },
      {
        icone: 'plan',
        titre: 'Le plan officiel, recopié',
        texte: 'Avec le PDF de la commune à côté.',
      },
      {
        icone: 'agenda',
        titre: 'Vers votre agenda',
        texte: 'Un .ics par enfant, vacances déjà retirées.',
      },
      {
        icone: 'alerte',
        ton: 'alerte',
        titre: 'Les perturbations',
        texte: 'Le trajet annulé disparaît de l’écran.',
      },
      {
        icone: 'imprimer',
        titre: 'La feuille du frigo',
        texte: 'Une page A4, en noir et blanc.',
      },
      {
        icone: 'partage',
        titre: 'Partage, QR, et reprise',
        texte: 'Les grands-parents voient le même écran.',
      },
      {
        icone: 'repas',
        titre: 'Midi à la maison, ou pas',
        texte: 'Le repas se règle jour par jour.',
      },
      {
        icone: 'adresse',
        titre: 'Le mardi chez la mamie',
        texte: 'Une autre adresse pour un seul jour.',
      },
      {
        icone: 'horloge',
        titre: 'Le périscolaire',
        texte: 'Déposé le lundi, repris le jeudi.',
      },
    ],
  },

  principes: {
    donnees: {
      etiquette: 'Le premier principe',
      titre: 'Aucune donnée de votre famille ne quitte l’appareil.',
      texte:
        `Pas de compte, pas de mot de passe. Les ${CHIFFRES.rues} rues de la commune sont ` +
        `embarquées dans le site : taper la vôtre n’interroge aucun service de cartographie.`,
    },
    horsLigne: {
      etiquette: 'À l’arrêt',
      titre: 'L’heure est déjà affichée, sans réseau.',
      points: [
        { texte: 'S’installe depuis le navigateur, sans magasin d’applications' },
        { texte: 'Polices, horaires et adresses sont déjà là' },
        { texte: 'Seule la carte du trajet à pied a encore besoin du réseau', ton: 'nuance' },
      ],
    },
  },

  limites: {
    titre: 'Ce que ce site ne sait pas.',
    note: `six limites, avant qu’on vous demande de l’ouvrir`,
    /*
     * SIX items, et pas cinq : la grille en pose trois par rangée (`sections.css`).
     * Trois ou six remplissent leurs rangées ; quatre ou cinq laissent un trou qui se lit
     * comme un oubli.
     *
     * Deux limites d'autrefois ont disparu d'ici parce qu'elles ont cessé d'être vraies :
     * les arrêts « situés à peu près » sont aujourd'hui tous vérifiés dans `arrets.json`,
     * et les « zones grises » du plan ont été levées par la commune (`incertitudes: []`).
     * Une limite qu'on garde après sa disparition n'est pas de la prudence, c'est une
     * autre inexactitude.
     */
    items: [
      {
        titre: 'Les temps de marche sont estimés',
        texte: `À vol d’oiseau, majorés d’un tiers, à 4,5 km/h. Ce n’est pas un itinéraire.`,
      },
      {
        titre: 'Les horaires sont une transcription',
        texte: `En cas d’écart, c’est le document officiel de la commune qui fait foi.`,
      },
      {
        titre: 'Le plan tient sur une confirmation orale',
        texte: `La commune a confirmé par téléphone, en août 2026, pour ${CHIFFRES.anneesCouvertes[1]}.`,
      },
      {
        titre: 'Une notification n’est pas une garantie',
        texte: `L’école et la commune restent la voie d’information officielle.`,
      },
      {
        titre: 'La recherche d’adresse s’arrête à la commune',
        texte: `Ailleurs, il faut désigner l’arrêt soi-même, sans temps de marche.`,
      },
      {
        titre: 'Deux choses sortent quand même',
        texte:
          `Les pages vues, et un identifiant d’appareil anonyme si vous activez les ` +
          `notifications.`,
      },
    ],
    lien: 'Lire la page « Limites »',
  },

  independance: {
    titre: 'Ce site est indépendant.',
    texte:
      `Il est réalisé par un parent, à titre privé, et n’a aucun lien avec l’administration ` +
      `communale de Beckerich ni avec l’école. Il n’engage qu’elle-même. En cas de doute ou de ` +
      `divergence, c’est le document officiel de la commune qui fait foi.`,
    lien: 'Voir le plan officiel sur kanner.beckerich.lu',
    retour: `Retour à la page d'accueil`,
  },

  final: {
    // Les mêmes nombres que la capture du héros : 07:25 à l'écran, départ à 07:45,
    // quatre minutes de marche — donc seize minutes avant de sortir.
    surtitre: 'Il est 07:25.',
    heure: '07:45',
    legendeHeure: 'départ · Kneppchen',
    titreAvant: 'Il reste ',
    titreAccent: 'seize minutes',
    titreApres: ' avant de sortir.',
    // Pas d'impératif tant que l'application n'est pas joignable : cette phrase est affichée
    // juste au-dessus du bloc qui annonce qu'il n'y a rien à ouvrir. Demander un geste, puis
    // dire dans le paragraphe suivant qu'il est impossible, use la confiance du lecteur plus
    // vite que n'importe quelle maladresse de style.
    chapeau:
      `Ce sera l’écran du matin : une heure, et le temps qu’il reste avant de sortir. Rien à ` +
      `chercher, rien à comparer, aucun matin à y repenser.`,
    action: 'Ouvrir l’application',
    qr: 'Ou scannez pour l’ouvrir sur le téléphone',
    // Trois choses vraies, et pas une de plus. « Pas encore ouverte au public » serait faux :
    // l'application est joignable sur GitHub Pages par qui en connaît l'adresse. Le futur
    // (« ce qu'elle fera ») le serait aussi, puisque les captures montrent un logiciel qui
    // tourne. La page CHOISIT de ne pas y mener — ce n'est pas la même chose que prétendre
    // qu'on ne le peut pas.
    bientot:
      `L’application est encore en développement. Cette page décrit ce qu’elle fait ; elle ` +
      `n’y conduit pas encore. En attendant, le plan officiel de la commune reste la source ` +
      `à consulter.`,
  },

  pied: {
    description:
      `Les horaires du bus scolaire de la commune de Beckerich, personnalisés par enfant. ` +
      `Site indépendant, sans lien avec la commune ni avec l’école.`,
    titreSite: 'Le site',
    titreProjet: 'Le projet',
    liens: {
      site: [
        { texte: 'Ouvrir l’application', url: URL_APP },
        { texte: 'Limites du site', url: URL_LIMITES },
        { texte: 'Indépendance', url: URL_INDEPENDANCE },
      ],
      projet: [{ texte: 'Crédits et remerciements', url: URL_CREDITS }],
    },
    mention: 'Fait par un parent, à Beckerich.',
    source: `Données : plan officiel de la commune, ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: 'Mentions légales',
    viePrivee: 'Cette page ne pose aucun cookie, ne mesure rien, et n’appelle aucun serveur.',
  },

  mentions: {
    titre: `Mentions légales`,
    intro: `Cette page identifie qui publie ce site. Elle ne change rien à ce qu'il dit par ailleurs : le site reste indépendant, et le document officiel de la commune fait foi.`,
    editeurTitre: `Éditeur`,
    editeurCorps: `Ce site est publié par ${NOM_EDITEUR}, à titre privé et non commercial. Il n'est ni commandé, ni validé, ni relu par l'administration communale de Beckerich, par l'école fondamentale ou par la maison relais.
Adresse : ${ADRESSE_EDITEUR}`,
    hebergeurTitre: `Hébergement`,
    hebergeurCorps: `Le site est constitué de fichiers statiques, servis depuis un serveur loué par l'éditeur. Aucune donnée de visite n'y est conservée.`,
    donneesTitre: `Données personnelles`,
    donneesCorps: `Cette page ne dépose aucun cookie, ne mesure pas l'audience et n'adresse aucune requête à un service tiers. Aucune donnée personnelle n'est collectée, et il n'y a donc rien à consulter, à corriger ni à effacer. L'application, elle, garde ce que vous y saisissez sur votre seul appareil ; sa page « Limites » le détaille.`,
    responsabiliteTitre: `Responsabilité`,
    responsabiliteCorps: `Les horaires affichés sont repris du plan officiel de la commune et retranscrits avec soin, sans garantie d'exactitude. En cas de doute ou de divergence, c'est le document officiel de la commune qui fait foi.`,
    retour: `Retour à la page d'accueil`,
  },
}
