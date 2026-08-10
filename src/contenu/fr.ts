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
 */
import type { Contenu } from './type.ts'
import {
  ADRESSE_EDITEUR,
  NOM_EDITEUR,
  URL_APP,
  URL_CREDITS,
  URL_DEPOT,
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
      `son arrêt, son heure, son école. Hors ligne, sans compte, sans donnée envoyée. ` +
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
    etiquette: `Site indépendant · Année scolaire ${CHIFFRES.anneeScolaire}`,
    titre: ['Les horaires du bus', 'de vos enfants,', 'sans y réfléchir.'],
    chapeau:
      `Le plan officiel de la commune de Beckerich, personnalisé pour chaque enfant. ` +
      `Son arrêt le plus proche, l’heure à laquelle il part, le temps qu’il lui faut pour y aller. ` +
      `Vous ouvrez, vous regardez, vous partez.`,
    heure: '07:12',
    legendeTitre: 'Prochain départ',
    legendeDetail: 'Léa · arrêt de Huttange · 4 min à pied',
    actionPrincipale: 'Ouvrir l’application',
    actionSecondaire: 'Ce que le site ne sait pas',
    invite: 'Faire défiler',
  },

  chiffres: {
    arrets: 'arrêts desservis',
    villages: 'villages de la commune',
    langues: 'langues, dont le luxembourgeois',
    envoi: 'donnée envoyée à un serveur',
    envoiValeur: '0',
  },

  recit: {
    etiquette: 'Le matin',
    titre: 'Huit minutes, et une colonne à trouver.',
    chapeau:
      `Le plan officiel est juste. Il est aussi long, dense, et pensé pour toute la commune ` +
      `à la fois — pas pour un enfant en particulier, un mardi, à sept heures.`,
    temps: [
      {
        titre: 'Le plan tient sur cinq pages',
        texte:
          `Trois lignes à l’aller, deux au retour, une desserte de cantine, et des notes de bas ` +
          `de page sur les jours où la règle change. Tout y est. Il faut seulement retrouver, ` +
          `chaque matin, la bonne colonne pour le bon village et le bon cycle.`,
      },
      {
        titre: 'Vous le remplissez une fois',
        texte:
          `L’adresse du domicile, le prénom de l’enfant, son cycle. Le site en déduit son école, ` +
          `sa ligne et son arrêt le plus proche, puis estime le temps de marche jusque là-bas. ` +
          `Cela prend cinq minutes, et cela ne se refait pas.`,
      },
      {
        titre: 'Ensuite, il ne reste qu’une heure',
        texte:
          `L’écran d’accueil ne montre rien d’autre que le prochain départ, en très grand. ` +
          `Quand le moment de sortir approche, un point se met à battre à côté de l’heure. ` +
          `Il n’y a rien à chercher, rien à déplier, rien à comparer.`,
      },
      {
        titre: 'Et le reste suit',
        texte:
          `La fiche de la semaine pour le cartable, le plan complet pour vérifier, l’export vers ` +
          `l’agenda du téléphone, la feuille A4 à coller sur le frigo. Chaque chose à sa place, ` +
          `et aucune ne s’impose à l’écran du matin.`,
      },
    ],
  },

  fonctions: {
    etiquette: 'Ce qu’il y a dedans',
    titre: 'Tout ce qu’un plan de bus ne dit pas tout seul.',
    chapeau:
      `Chaque fonction répond à une situation réelle rencontrée par un parent de la commune. ` +
      `Aucune n’a été ajoutée parce qu’elle faisait bien sur une liste.`,
    tuiles: [
      {
        icone: 'semaine',
        titre: 'La fiche de la semaine',
        texte:
          `Les cinq jours d’un enfant sur un seul écran : heure de départ, arrêt, école, retour. ` +
          `Les jours où il ne prend pas le bus sont marqués comme tels, pas laissés vides.`,
      },
      {
        icone: 'plan',
        titre: 'Le plan officiel, lisible',
        texte:
          `Les ${CHIFFRES.lignes} lignes et les ${CHIFFRES.arrets} arrêts sur une carte, ` +
          `et le PDF de la commune consultable en un geste.`,
      },
      {
        icone: 'agenda',
        titre: 'Vers votre agenda',
        texte:
          `Un fichier .ics pour n’importe quel calendrier, ou une écriture directe dans Google ` +
          `Agenda si vous la demandez. Les vacances scolaires sont déjà dedans.`,
      },
      {
        icone: 'alerte',
        titre: 'Les perturbations',
        texte:
          `Quand la commune annonce une annulation ou un retard, elle apparaît en tête d’écran — ` +
          `et sur le téléphone, en notification, si vous l’avez acceptée.`,
      },
      {
        icone: 'imprimer',
        titre: 'La feuille du frigo',
        texte:
          `Une page A4 par enfant, ou toute la fratrie sur une seule feuille. Imprimée en noir ` +
          `et blanc, sans dégradé ni fond gris : c’est lisible, et cela ne vide pas une cartouche.`,
      },
      {
        icone: 'partage',
        titre: 'Partage et QR',
        texte:
          `Un lien à envoyer aux grands-parents ou à la personne qui garde. Il transporte la ` +
          `configuration, jamais vers un serveur — voir plus bas.`,
      },
      {
        icone: 'repas',
        titre: 'Midi à la maison, ou pas',
        texte:
          `Le repas se règle jour par jour. À la cantine Dillendapp, l’enfant suit la desserte ` +
          `de midi ; à la maison, il suit le retour ordinaire. Le plan s’adapte tout seul.`,
      },
      {
        icone: 'adresse',
        titre: 'Le mardi chez la mamie',
        texte:
          `Une adresse différente pour un jour donné, et l’arrêt le plus proche est recalculé ` +
          `pour ce jour-là uniquement.`,
      },
      {
        icone: 'horloge',
        titre: 'Le périscolaire',
        texte:
          `Les heures de maison relais entrent dans la fiche, pour que l’heure affichée soit ` +
          `celle qui compte vraiment ce jour-là.`,
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
          `dans le navigateur de l’appareil sur lequel vous l’avez saisi.`,
      },
      {
        titre: 'La recherche d’adresse est hors ligne',
        texte:
          `Les ${CHIFFRES.rues} rues de la commune sont embarquées dans le site. Taper votre rue ` +
          `n’interroge aucun service de cartographie : personne à l’extérieur n’apprend où vous ` +
          `habitez.`,
      },
      {
        titre: 'Le partage passe après le dièse',
        texte:
          `Un lien partagé range la configuration dans le fragment de l’adresse — la partie qui ` +
          `suit le « # ». Les navigateurs ne l’envoient jamais au serveur. Le lien fonctionne, ` +
          `et personne ne l’a lu au passage.`,
      },
    ],
    legendeSchema: 'Ce que le navigateur garde, et ce qui sort — c’est-à-dire rien.',
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
    titre: 'Fonctionne là où le réseau ne fonctionne pas.',
    chapeau:
      `Le site s’installe comme une application, et garde tout ce dont il a besoin sur ` +
      `l’appareil. À l’arrêt de bus, sous la pluie, avec une barre de réseau, l’heure est déjà ` +
      `affichée — elle n’a jamais eu besoin d’être téléchargée.`,
    points: [
      'S’installe depuis le navigateur, sans passer par un magasin d’applications',
      'S’ouvre en moins d’une seconde, réseau ou pas',
      'Les polices, les horaires et les adresses sont déjà là',
      'Se met à jour toute seule quand le réseau revient',
    ],
    action: 'Comment l’installer',
    legendeSignal: 'Sans réseau',
  },

  limites: {
    etiquette: 'Honnêteté',
    titre: 'Ce que ce site ne sait pas.',
    chapeau:
      `Une application qui cache ses approximations vous fait rater un bus sans prévenir. ` +
      `Celle-ci affiche les siennes, à l’endroit où elles comptent.`,
    items: [
      {
        titre: 'Les temps de marche sont estimés',
        texte:
          `Ils sont calculés à vol d’oiseau, à allure d’adulte. Ce n’est pas un itinéraire : ` +
          `un passage à niveau, une côte ou un enfant de six ans changent le résultat.`,
      },
      {
        titre: 'Certains arrêts sont situés à peu près',
        texte:
          `Quand l’arrêt n’est pas nommé dans les données publiques, le site retient le centre ` +
          `de la rue ou du village. Il l’indique, plutôt que de faire croire à une précision.`,
      },
      {
        titre: 'Le plan officiel a ses zones grises',
        texte:
          `Certaines règles du document sont ambiguës. Elles sont recopiées telles quelles et ` +
          `signalées, jamais tranchées à votre place.`,
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
  },

  final: {
    surtitre: 'Il est 07:04.',
    heure: '07:12',
    titre: 'Le bus part dans huit minutes.',
    chapeau:
      `Vous n’avez pas à le chercher. Ouvrez le site une fois, remplissez-le une fois, et ` +
      `l’heure sera là tous les matins suivants.`,
    action: 'Ouvrir l’application',
    qr: 'Ou scannez pour l’ouvrir sur le téléphone',
    bientot:
      `L’application n’est pas encore ouverte au public. Cette page décrit ce qu’elle fera ; ` +
      `en attendant, le plan officiel de la commune reste la seule source à consulter.`,
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
        { texte: 'Code source', url: URL_DEPOT },
      ],
    },
    mention: 'Fait par un parent, à Beckerich.',
    source: `Données : plan officiel de la commune, année scolaire ${CHIFFRES.anneeScolaire}.`,
    lienMentions: "Mentions légales",
    viePrivee: 'Cette page ne pose aucun cookie, ne mesure rien, et n’appelle aucun serveur.',
  },

  mentions: {
    titre: `Mentions légales`,
    intro: `Cette page identifie qui publie ce site. Elle ne change rien à ce qu'il dit par ailleurs : le site reste indépendant, et le document officiel de la commune fait foi.`,
    editeurTitre: `Éditeur`,
    editeurCorps: `Ce site est publié par ${NOM_EDITEUR}, à titre privé et non commercial. Il n'est ni commandé, ni validé, ni relu par l'administration communale de Beckerich, par l'école fondamentale ou par la maison relais.
Adresse : ${ADRESSE_EDITEUR}
Contact : par le dépôt du code, dont l'adresse figure en pied de page.`,
    hebergeurTitre: `Hébergement`,
    hebergeurCorps: `Le site est constitué de fichiers statiques, servis depuis un serveur loué par l'éditeur. Aucune donnée de visite n'y est conservée.`,
    donneesTitre: `Données personnelles`,
    donneesCorps: `Cette page ne dépose aucun cookie, ne mesure pas l'audience et n'adresse aucune requête à un service tiers. Aucune donnée personnelle n'est collectée, et il n'y a donc rien à consulter, à corriger ni à effacer. L'application, elle, garde ce que vous y saisissez sur votre seul appareil ; sa page « Limites » le détaille.`,
    responsabiliteTitre: `Responsabilité`,
    responsabiliteCorps: `Les horaires affichés sont repris du plan officiel de la commune et retranscrits avec soin, sans garantie d'exactitude. En cas de doute ou de divergence, c'est le document officiel de la commune qui fait foi.`,
    retour: `Retour à la page d'accueil`,
  },

}
