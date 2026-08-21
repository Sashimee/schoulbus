/*
 * English — translated from `fr.ts`.
 *
 * The vocabulary follows the application's own
 * (`../bus-scolaire-beckerich/src/i18n/en.json`) rather than a dictionary's: "stop", not
 * "bus stop station"; "on foot", not "walking route". A landing page that names things
 * differently from the app it describes makes the reader translate twice.
 *
 * English is the one language here that is nobody's home language in the municipality.
 * That is not a reason to write it loosely — it is the language a newly arrived family
 * falls back on before they have any of the other four, which is exactly the moment when
 * a school bus timetable is hardest to work out.
 *
 * TWO HARD CONSTRAINTS, to re-read before touching anything:
 *
 *  1. The numbers in the hero and the closing block are THE ONES IN THE SCREENSHOT. The
 *     reader sees the screen next to the sentence; when they diverge, it is the sentence
 *     they stop believing. The app in English reads "in 16 min" — hence "16 min".
 *  2. `heros.titre` is drawn into the share thumbnails at 76px across 1200px
 *     (`scripts/build-partage.mjs`): AT MOST 24 CHARACTERS PER LINE, then run
 *     `npm run assets:partage`.
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

export const en: Contenu = {
  langue: 'en',
  codeLangue: 'en',

  meta: {
    titre: 'Beckerich school bus — your children’s times, without thinking about it',
    description:
      `The Beckerich municipal school bus plan, worked out for each child: their stop, ` +
      `their time, their school. Offline, no account. ` +
      `An independent site, with no link to the municipality or the school.`,
  },

  general: {
    marque: 'Beckerich school bus',
    sautContenu: 'Skip to content',
    ouvrirApp: 'Open the app',
    fermer: 'Close',
    theme: 'Appearance',
    themeClair: 'Light',
    themeSombre: 'Dark',
    choixLangue: 'Language',
    bientot: 'Coming soon',
  },

  heros: {
    etiquette: `Independent site · ${CHIFFRES.anneesCouvertes.join(' · ')}`,
    // 22 and 13 characters: under the share thumbnail's limit of 24.
    titre: ['What you see at 07:25,', 'on a Tuesday.'],
    altCapture: `The app's home screen: Léa's card, bus at 07:45 from the Kneppchen stop.`,
    lignes: [
      { valeur: '07:45', texte: 'her bus time, at her own stop' },
      {
        valeur: '16 min',
        texte: 'before you leave, the 4-minute walk already taken off',
        compte: true,
      },
      { valeur: 'Kneppchen', texte: 'the stop nearest your address' },
      { valeur: 'Léa · Noah', texte: 'one card per child, in order of departure' },
    ],
    actionPrincipale: 'Open the app',
    actionSecondaire: 'What this site cannot do',
    legende: 'Real screenshot · 22 September 2026, 07:25',
  },

  chiffres: {
    arrets: 'stops served',
    villages: 'villages in the municipality',
    langues: 'languages, Luxembourgish among them',
    envoi: 'items of family data sent to a server',
    envoiValeur: '0',
    envoiNote:
      `Two things do leave all the same: the app counts its page views, and turning on ` +
      `notifications stores an anonymous device identifier on a server for as long as the ` +
      `subscription lasts. Not your address, not the names, not the cycles.`,
  },

  ecrans: {
    titre: 'Four screens, and that is the whole product.',
    note: `Real screenshots of the app, Tuesday 22 September 2026 at 07:25.`,
    cartes: [
      { titre: 'The morning screen', texte: 'One time per child, and nothing else.' },
      { titre: 'The week at a glance', texte: 'Five days, and the map of the walk.' },
      {
        titre: 'The official plan, copied out',
        texte: `${CHIFFRES.lignes} routes, ${CHIFFRES.arrets} stops, table by table.`,
      },
      {
        titre: 'Seven questions, once',
        texte: 'The address settles the stop, the cycle settles the school.',
      },
    ],
  },

  fonctions: {
    etiquette: 'What is inside',
    titre: 'Nine answers to nine mornings that are never the same.',
    tuiles: [
      {
        icone: 'semaine',
        titre: 'The week at a glance',
        texte: 'One child’s five days on a single screen.',
      },
      {
        icone: 'plan',
        titre: 'The official plan, copied out',
        texte: 'With the municipality’s PDF beside it.',
      },
      {
        icone: 'agenda',
        titre: 'Into your calendar',
        texte: 'One .ics per child, holidays already removed.',
      },
      {
        icone: 'alerte',
        ton: 'alerte',
        titre: 'Disruptions',
        texte: 'A cancelled journey disappears from the screen.',
      },
      {
        icone: 'imprimer',
        titre: 'The sheet for the fridge',
        texte: 'One A4 page, in black and white.',
      },
      {
        icone: 'partage',
        titre: 'Sharing, QR, and hand-over',
        texte: 'Grandparents see exactly the same screen.',
      },
      {
        icone: 'repas',
        titre: 'Lunch at home, or not',
        texte: 'The meal is set day by day.',
      },
      {
        icone: 'adresse',
        titre: 'Tuesdays at grandma’s',
        texte: 'A different address for one day only.',
      },
      {
        icone: 'horloge',
        titre: 'After-school care',
        texte: 'Dropped off Monday, picked up Thursday.',
      },
    ],
  },

  principes: {
    donnees: {
      etiquette: 'The first principle',
      titre: 'No data about your family leaves the device.',
      texte:
        `No account, no password. The municipality's ${CHIFFRES.rues} streets are carried ` +
        `inside the site itself: typing yours queries no mapping service.`,
    },
    horsLigne: {
      etiquette: 'At the stop',
      titre: 'The time is already on screen, with no network.',
      points: [
        { texte: 'Installs from the browser, with no app store' },
        { texte: 'Fonts, timetables and addresses are already there' },
        { texte: 'Only the map of the walk still needs the network', ton: 'nuance' },
      ],
    },
  },

  limites: {
    titre: 'What this site does not know.',
    note: `six limits, before we ask you to open it`,
    items: [
      {
        titre: 'Walking times are estimates',
        texte: `As the crow flies, raised by a third, at 4.5 km/h. It is not a route.`,
      },
      {
        titre: 'The timetables are a transcription',
        texte: `Where they differ, the municipality's official document prevails.`,
      },
      {
        titre: 'The plan rests on a spoken confirmation',
        texte: `The municipality confirmed by telephone, in August 2026, for ${CHIFFRES.anneesCouvertes[1]}.`,
      },
      {
        titre: 'A notification is not a guarantee',
        texte: `The school and the municipality remain the official channel.`,
      },
      {
        titre: 'Address search stops at the municipal boundary',
        texte: `Elsewhere you must name the stop yourself, with no walking time.`,
      },
      {
        titre: 'Two things do leave all the same',
        texte: `Page views, and an anonymous device identifier if you turn on notifications.`,
      },
    ],
    lien: 'Read the “Limits” page',
  },

  independance: {
    titre: 'This site is independent.',
    texte:
      `It was made by a parent, privately, and has no link to the Beckerich municipal ` +
      `administration or to the school. It speaks only for itself. In case of doubt or ` +
      `disagreement, the municipality's official document prevails.`,
    lien: 'See the official plan on kanner.beckerich.lu',
    retour: `Back to the home page`,
  },

  final: {
    // The same numbers as the screenshot in the hero.
    surtitre: 'It is 07:25.',
    heure: '07:45',
    legendeHeure: 'departure · Kneppchen',
    titreAvant: 'There are ',
    titreAccent: 'sixteen minutes',
    titreApres: ' left before you leave.',
    // No imperative while the app is not reachable — reasoning in `fr.ts`.
    chapeau:
      `This will be the morning screen: one time, and how long is left before you go. ` +
      `Nothing to look up, nothing to compare, no morning spent thinking about it.`,
    action: 'Open the app',
    qr: 'Or scan to open it on the phone',
    bientot:
      `The app is still in development. This page describes what it does; it does not lead ` +
      `there yet. In the meantime, the municipality's official plan remains the source to ` +
      `consult.`,
  },

  pied: {
    description:
      `The school bus times of the municipality of Beckerich, worked out for each child. ` +
      `An independent site, with no link to the municipality or the school.`,
    titreSite: 'The site',
    titreProjet: 'The project',
    liens: {
      site: [
        { texte: 'Open the app', url: URL_APP },
        { texte: 'Limits of the site', url: URL_LIMITES },
        { texte: 'Independence', url: URL_INDEPENDANCE },
      ],
      projet: [{ texte: 'Credits and thanks', url: URL_CREDITS }],
    },
    mention: 'Made by a parent, in Beckerich.',
    source: `Data: the municipality's official plan, ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: 'Legal notice',
    viePrivee: 'This page sets no cookies, measures nothing, and calls no server.',
  },

  mentions: {
    titre: `Legal notice`,
    intro: `This page states who publishes the site. It changes nothing else about it: the site remains independent, and the municipality's official document prevails.`,
    editeurTitre: `Publisher`,
    editeurCorps: `This site is published by ${NOM_EDITEUR}, privately and non-commercially. It is neither commissioned, nor approved, nor reviewed by the Beckerich municipal administration, the primary school or the maison relais.
Address: ${ADRESSE_EDITEUR}`,
    hebergeurTitre: `Hosting`,
    hebergeurCorps: `The site consists of static files, served from a server rented by the publisher. No visit data is kept there.`,
    donneesTitre: `Personal data`,
    donneesCorps: `This page sets no cookies, does not measure audience and makes no request to any third-party service. No personal data is collected, so there is nothing to consult, correct or erase. The app itself keeps what you enter on your device alone; its “Limits” page sets that out in detail.`,
    responsabiliteTitre: `Liability`,
    responsabiliteCorps: `The times shown are taken from the municipality's official plan and transcribed with care, without any guarantee of accuracy. In case of doubt or disagreement, the municipality's official document prevails.`,
    retour: `Back to the home page`,
  },
}
