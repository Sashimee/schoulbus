/*
 * Français — la version de référence.
 *
 * Les deux autres langues sont traduites depuis celle-ci, et non l'inverse : c'est la
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
 * DEUX CONTRAINTES DURES, à relire avant toute retouche :
 *
 *  1. Les nombres du héros et de l'appel final sont CEUX DES CAPTURES. Le lecteur voit
 *     l'écran à côté de la phrase ; s'ils divergent, c'est la phrase qu'il croira fausse.
 *     Ils viennent de `src/contenu/captures.ts` (mardi 22 septembre 2026, 07:25) et se
 *     lisent sur `public/captures/aujourdhui-fr-*.webp`.
 *  2. `heros.titre` est dessiné dans les vignettes de partage à 76 px sur 1200 px de large
 *     (`scripts/build-partage.mjs`) : 24 CARACTÈRES PAR LIGNE AU PLUS, et
 *     `npm run assets:partage` après chaque changement, sans quoi la vignette et la page
 *     ne disent plus la même chose.
 */
import type { Contenu } from './type.ts'
import {
  ADRESSE_CONTACT,
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
    etiquette: `Site indépendant · Années scolaires ${CHIFFRES.anneesCouvertes.join(' et ')}`,
    titre: ['Les horaires du bus', 'de vos enfants,', 'sans y réfléchir.'],
    chapeau:
      `Le plan officiel de la commune de Beckerich, repris enfant par enfant : son arrêt le ` +
      `plus proche, l’heure de son bus, et le temps qu’il lui faut pour y aller à pied. ` +
      `L’écran d’accueil ne montre que cela.`,
    // 07:45, et non l'heure du bus : c'est l'heure qu'affiche la capture d'à côté.
    heure: '07:45',
    legendeTitre: 'Prochain départ',
    legendeDetail: 'Léa · Hovelange · Kneppchen · 4 min à pied',
    actionPrincipale: 'Ouvrir l’application',
    actionSecondaire: 'Ce que le site ne sait pas',
    invite: 'Faire défiler',
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

  recit: {
    etiquette: 'Le matin',
    titre: 'Vingt minutes, et une colonne à trouver.',
    chapeau:
      `Le plan officiel est juste. Il est aussi long, dense, et écrit pour toute la commune ` +
      `à la fois — pas pour un enfant en particulier, un mardi, à sept heures.`,
    temps: [
      {
        titre: 'Le plan tient sur cinq pages',
        texte:
          `Sept lignes, onze services, et des notes de bas de page sur les jours où la règle ` +
          `change. Tout y est : le site le recopie ligne par ligne, sans rien trancher. Il ` +
          `reste seulement à retrouver, chaque matin, la bonne colonne pour le bon village et ` +
          `le bon cycle.`,
      },
      {
        titre: 'Vous le remplissez une fois',
        texte:
          `Sept questions, une par écran : l’adresse, le prénom, le cycle, puis le bus, le midi, ` +
          `le périscolaire et les jours qui sortent de l’ordinaire. Le cycle décide de l’école, ` +
          `l’adresse décide de l’arrêt. Le deuxième enfant part de la configuration de son aîné : ` +
          `il ne reste qu’un prénom et un cycle à changer.`,
      },
      {
        titre: 'Ensuite, il ne reste qu’une heure',
        texte:
          `L’écran d’accueil ne montre que le prochain départ, en très grand. À côté, « dans ` +
          `16 min » : le temps qu’il vous reste avant de SORTIR, la marche jusqu’à l’arrêt déjà ` +
          `déduite. Quand il est temps d’y aller, un point se met à battre. Rien à chercher, ` +
          `rien à déplier, rien à comparer.`,
      },
      {
        titre: 'Et le reste suit',
        texte:
          `La semaine entière d’un enfant sur un écran, avec la carte du trajet à pied jusqu’à ` +
          `son arrêt ; le plan officiel pour vérifier ; l’export vers l’agenda du téléphone ; la ` +
          `feuille A4 pour le frigo. Rien de tout cela n’encombre l’écran du matin.`,
      },
    ],
  },

  fonctions: {
    etiquette: 'Ce qu’il y a dedans',
    titre: 'Tout ce qu’un plan de bus ne dit pas tout seul.',
    chapeau: `Chaque fonction répond à une situation qu’un parent de la commune rencontre.`,
    tuiles: [
      {
        icone: 'semaine',
        titre: 'La fiche de la semaine',
        texte:
          `Les cinq jours d’un enfant sur un écran : l’heure de départ, l’arrêt, l’école, le ` +
          `retour, et une carte du trajet à pied jusqu’à l’arrêt. Certains jours vous l’emmenez ` +
          `vous-même, ou vous allez le chercher : dites-le, et ces trajets-là disparaissent au ` +
          `lieu de rester affichés pour rien.`,
      },
      {
        icone: 'plan',
        titre: 'Le plan officiel, recopié',
        texte:
          `Les ${CHIFFRES.lignes} lignes et les ${CHIFFRES.arrets} arrêts, transcrits tableau ` +
          `par tableau, avec le PDF de la commune à côté.`,
      },
      {
        icone: 'agenda',
        titre: 'Vers votre agenda',
        texte:
          `Un fichier .ics par enfant, ou un seul pour toute la fratrie. Les vacances scolaires ` +
          `en sont déjà retirées.`,
      },
      {
        icone: 'alerte',
        titre: 'Les perturbations',
        texte:
          `Un représentant de l’école ou de la commune publie l’annulation en répondant à cinq ` +
          `questions. Le trajet annulé disparaît de l’écran, le retard s’affiche barré et ` +
          `corrigé. Une notification peut prévenir, sans jamais rien garantir.`,
      },
      {
        icone: 'imprimer',
        titre: 'La feuille du frigo',
        texte:
          `Une page A4 par enfant, ou toute la fratrie sur une seule feuille. En noir et blanc, ` +
          `sans dégradé ni fond gris.`,
      },
      {
        icone: 'partage',
        titre: 'Partage, QR, et reprise',
        texte:
          `Un lien — ou un QR code — à envoyer aux grands-parents ou à la personne qui garde : ` +
          `ils voient le même écran que vous. Le même lien sert sur iPhone, où l’application ` +
          `installée ne voit pas ce que vous aviez saisi dans Safari.`,
      },
      {
        icone: 'repas',
        titre: 'Midi à la maison, ou pas',
        texte:
          `Un enfant peut manger au Dillendapp le lundi et rentrer le mardi. Le repas se règle ` +
          `jour par jour, et les trajets suivent.`,
      },
      {
        icone: 'adresse',
        titre: 'Le mardi chez la mamie',
        texte:
          `Une autre adresse pour un seul jour — et pour un seul moment de la journée : le ` +
          `matin, le midi ou le soir. L’arrêt le plus proche est recalculé pour ce jour-là.`,
      },
      {
        icone: 'horloge',
        titre: 'Le périscolaire',
        texte:
          `Vous le déposez au Dillendapp le lundi, vous venez le chercher le jeudi. Les heures ` +
          `possibles sont bornées par l’ouverture de la maison relais et resserrées par le bus ` +
          `de son cycle. Les soirs où vous ne pouvez pas venir, la fiche renvoie vers le Bummelbus.`,
      },
    ],
  },

  confidentialite: {
    etiquette: 'Le premier principe',
    titre: 'Aucune donnée de votre famille ne quitte l’appareil.',
    chapeau:
      `Ce n’est pas une intention, c’est une propriété du code. L’adresse du domicile, les ` +
      `prénoms et les cycles vivent dans la mémoire de votre navigateur, et le site n’a nulle ` +
      `part où les envoyer.`,
    points: [
      {
        titre: 'Rien à envoyer, rien à perdre',
        texte:
          `Pas de compte, pas d’inscription, pas de mot de passe. Ce que vous saisissez reste ` +
          `dans le navigateur de l’appareil où vous l’avez saisi, et un bouton des réglages ` +
          `l’efface entièrement.`,
      },
      {
        titre: 'La recherche d’adresse est hors ligne',
        texte:
          `Les ${CHIFFRES.rues} rues de la commune — ${CHIFFRES.adresses} adresses — sont ` +
          `embarquées dans le site. Taper la vôtre n’interroge aucun service de cartographie : ` +
          `personne à l’extérieur n’apprend où vous habitez. En contrepartie, la recherche ne ` +
          `connaît que cette commune-là.`,
      },
      {
        titre: 'Le partage passe après le dièse',
        texte:
          `Un lien partagé range la configuration dans le fragment de l’adresse — la partie qui ` +
          `suit le « # ». Les navigateurs ne l’envoient jamais au serveur. Le lien fonctionne, ` +
          `et personne ne l’a lu au passage.`,
      },
    ],
    legendeSchema: 'Ce que le navigateur garde, et ce qui n’en sort pas.',
  },

  langues: {
    etiquette: 'Cinq langues',
    titre: 'Y compris celle qu’on parle à la maison.',
    chapeau:
      `L’application est traduite en français, allemand, luxembourgeois, portugais et anglais. ` +
      `Les corrections de traduction sont publiées sans reconstruire le site — une faute ` +
      `signalée le matin peut être corrigée l’après-midi.`,
    mots: [
      { code: 'fr', texte: 'Bus scolaire Beckerich' },
      { code: 'de', texte: 'Schulbus Beckerich' },
      { code: 'lb', texte: 'Schoulbus Biekerech' },
      { code: 'pt', texte: 'Autocarro escolar Beckerich' },
      { code: 'en', texte: 'Beckerich school bus' },
    ],
  },

  horsligne: {
    etiquette: 'À l’arrêt',
    titre: 'Les horaires restent lisibles sans réseau.',
    chapeau:
      `Le site s’installe comme une application et garde sur l’appareil tout ce dont il a ` +
      `besoin. À l’arrêt, avec une barre de réseau, l’heure est déjà affichée : elle n’a pas ` +
      `eu à être téléchargée.`,
    points: [
      'S’installe depuis le navigateur, sans passer par un magasin d’applications',
      'S’ouvre sans attendre le réseau',
      'Les polices, les horaires et les adresses sont déjà là',
      'Se met à jour toute seule quand le réseau revient',
      // La carte du trajet à pied est le seul écran qui demande encore le réseau. Le taire
      // ici, c'est promettre un « tout hors ligne » que la fiche de la semaine dément.
      'Seule la carte du trajet à pied a encore besoin du réseau',
    ],
    action: 'Comment l’installer',
    legendeSignal: 'Sans réseau',
  },

  limites: {
    etiquette: 'Honnêteté',
    titre: 'Ce que ce site ne sait pas.',
    chapeau: `Voici ce que ce site ne sait pas faire, et ce qu’il fait de façon approchée.`,
    /*
     * SIX items, et pas cinq : `.limites__liste` est une grille de trois colonnes
     * (`sections.css`). Trois ou six remplissent leurs rangées ; quatre ou cinq laissent un
     * trou qui se lit comme un oubli.
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
        texte:
          `Ils sont calculés à vol d’oiseau, majorés d’un tiers pour les détours, à 4,5 km/h. ` +
          `Ce n’est pas un itinéraire : une côte, un passage à niveau ou un enfant de six ans ` +
          `changent le résultat.`,
      },
      {
        titre: 'Les horaires sont une transcription',
        texte:
          `Ils sont recopiés du document de la commune, avec soin et sans garantie. La commune ` +
          `peut le modifier sans préavis. En cas d’écart, c’est le document officiel qui fait foi.`,
      },
      {
        titre: 'Le plan vaut pour deux années, sur une confirmation orale',
        texte:
          `La commune a confirmé par téléphone, en août 2026, que les horaires ne changeaient ` +
          `pas pour ${CHIFFRES.anneesCouvertes[1]}. Une confirmation orale n’est pas un ` +
          `document : elle reste à revérifier à chaque rentrée, et le site le dit là où il ` +
          `affiche l’année.`,
      },
      {
        titre: 'Une notification n’est pas une garantie',
        texte:
          `Un téléphone éteint, un mode « ne pas déranger », un service de notification en ` +
          `panne, et elle n’arrive pas. L’école et la commune restent la voie d’information ` +
          `officielle ; l’application ne les remplace pas.`,
      },
      {
        titre: 'La recherche d’adresse s’arrête à la commune',
        texte:
          `Elle ne connaît que les ${CHIFFRES.rues} rues de Beckerich. Pour un domicile situé ` +
          `ailleurs — chez les grands-parents, au village voisin — il faut désigner l’arrêt ` +
          `soi-même, et le temps de marche devient inconnu.`,
      },
      {
        titre: 'Deux choses sortent quand même de l’appareil',
        texte:
          `L’application compte ses pages vues, et activer les notifications dépose un ` +
          `identifiant d’appareil anonyme sur un serveur, le temps de l’abonnement. Rien de ce ` +
          `que vous saisissez ne part avec.`,
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
    titre: 'Il reste seize minutes avant de sortir.',
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
      projet: [
        { texte: 'Crédits et remerciements', url: URL_CREDITS },
      ],
    },
    mention: 'Fait par un parent, à Beckerich.',
    source: `Données : plan officiel de la commune, années scolaires ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: "Mentions légales",
    lienContact: 'Contact',
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
    donneesCorps: `Cette page ne dépose aucun cookie, ne mesure pas l'audience et n'adresse aucune requête à un service tiers. Aucune donnée personnelle n'est collectée par le site lui-même, et il n'y a donc rien à consulter, à corriger ni à effacer.
Si vous écrivez à ${ADRESSE_CONTACT}, en revanche, votre message et l'adresse d'où il part arrivent dans une boîte aux lettres ordinaire. Ils y servent uniquement à vous répondre, ne sont transmis à personne, et sont effacés une fois l'échange terminé.
L'application, elle, garde ce que vous y saisissez sur votre seul appareil ; sa page « Limites » le détaille.`,
    responsabiliteTitre: `Responsabilité`,
    responsabiliteCorps: `Les horaires affichés sont repris du plan officiel de la commune et retranscrits avec soin, sans garantie d'exactitude. En cas de doute ou de divergence, c'est le document officiel de la commune qui fait foi.`,
    retour: `Retour à la page d'accueil`,
  },

  contact: {
    titre: 'Écrire',
    intro:
      `L’application est encore en développement. Si elle vous intéresse, ou si vous vous ` +
      `demandez ce qu’elle fera, voici par où passer. Le formulaire n’envoie rien lui-même ` +
      `— il prépare le courriel dans votre logiciel, et c’est vous qui l’envoyez.`,
    note:
      `Rien ne part de cette page. Le bouton ouvre votre logiciel de courrier avec un ` +
      `message déjà écrit ; vous le relisez, et vous décidez. Ce que vous envoyez arrive ` +
      `chez ${NOM_EDITEUR}, sert à vous répondre, n’est transmis à personne et est effacé ` +
      `une fois l’échange terminé.`,
    categorieLegende: 'De quoi s’agit-il ?',
    categories: [
      { cle: 'interet', texte: 'L’application m’intéresse' },
      { cle: 'question', texte: 'Une question sur le projet' },
      { cle: 'horaire', texte: 'Une question sur les horaires eux-mêmes' },
      { cle: 'autre', texte: 'Autre chose' },
    ],
    renvoiCommune:
      `Ce site n’est pas celui de la commune, et l’application n’est pas encore ouverte : ` +
      `il n’y a donc pas d’horaire à consulter ici pour l’instant. Pour les horaires en ` +
      `vigueur aujourd’hui, c’est le plan officiel de la commune qui fait foi.`,
    nomEtiquette: 'Votre nom',
    courrielEtiquette: 'Votre adresse électronique',
    courrielAide: 'Elle sert à vous répondre, et à rien d’autre.',
    messageEtiquette: 'Votre message',
    messageAide: 'Dites d’où vous écrivez et ce que vous cherchez à savoir : la réponse sera plus utile.',
    compteur: '{n} caractères restants',
    envoyer: 'Préparer le courriel',
    sujetPrefixe: '[schoulbus.lu]',
    ouvertTitre: 'Votre logiciel de courrier devrait s’être ouvert',
    ouvertTexte:
      `Le message y est déjà écrit ; il reste à l’envoyer. Si rien ne s’est passé, c’est ` +
      `qu’aucun logiciel de courrier n’est associé sur cet appareil — l’adresse ci-dessous ` +
      `se recopie à la main.`,
    directTitre: 'Écrire directement',
    directTexte: 'Sans passer par le formulaire :',
    erreurResume: 'Le courriel n’a pas été préparé : un champ au moins demande à être repris.',
    erreurs: {
      requis: 'Ce champ est nécessaire.',
      courrielInvalide: 'Cette adresse ne ressemble pas à une adresse électronique.',
      tropCourt: 'Quelques mots de plus aideraient à comprendre.',
      tropLong: 'C’est trop long pour un courriel préparé de cette façon.',
    },
    retour: 'Retour à la page d’accueil',
    brefTitre: 'Une question sur l’application ?',
    brefTexte:
      `Elle est encore en développement. Pour en savoir plus, ou simplement pour dire ` +
      `qu’elle vous intéresse, il y a une adresse.`,
    brefAction: 'Écrire',
  },

}
