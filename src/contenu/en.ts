/*
 * Anglais. Traduit depuis `fr.ts`, qui reste la référence.
 *
 * POUR QUI CETTE LANGUE EXISTE
 * ----------------------------
 * Pas pour des anglophones de naissance : il n'y en a presque pas dans la commune.
 * L'anglais est ici la langue de repli des familles qui n'ont ni le français, ni
 * l'allemand, ni le luxembourgeois — et qui, pour cette raison même, ne sont pas en
 * position de repérer une tournure fautive. Cela commande deux choses : des phrases
 * simples plutôt qu'élégantes, et aucun idiome dont le sens se devine mal.
 *
 * LE VOCABULAIRE VIENT DE L'APPLICATION, PAS D'ICI
 * ------------------------------------------------
 * `../bus-scolaire-beckerich/src/i18n/en.json` est déjà écrit, et c'est le premier texte
 * anglais que le lecteur rencontrera après cette page. Les termes qu'il fixe se reprennent
 * tels quels : *stop*, *nearest stop*, *municipality*, *official plan*, *fundamental
 * school*, *Dillendapp maison relais*, *after-school centre*, *walking route*, *journey*,
 * *cycle*, *Independent site*. En inventer d'autres ici ferait décrire le même produit en
 * deux vocabulaires, et c'est la vitrine qui aurait tort.
 *
 * Anglais BRITANNIQUE, comme le déclare `localePartage` : *centre* et non *center*,
 * *timetable* et non *schedule*, *travelling* et non *traveling*. Un mélange des deux est
 * ce qui se remarque en premier.
 *
 * L'adresse est le « you » neutre, sans familiarité — l'équivalent du vouvoiement que
 * l'allemand a dû choisir. Les noms propres gardent leur graphie officielle : Beckerich,
 * Hovelange, Huttange, Noerdange, Kneppchen, Dillendapp, Bummelbus.
 *
 * DEUX CONTRAINTES DURES, les mêmes que dans `fr.ts` :
 *
 *  1. Les nombres du héros et de l'appel final sont CEUX DES CAPTURES — ici
 *     `public/captures/aujourdhui-en-*.webp` (mardi 22 septembre 2026, 07:25). L'heure
 *     reste sur 24 heures : c'est ce que l'application affiche, en anglais comme ailleurs.
 *  2. `heros.titre` est dessiné à 76 px sur 1200 px de large : 24 CARACTÈRES PAR LIGNE AU
 *     PLUS, et `npm run assets:partage` après chaque changement.
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

export const en: Contenu = {
  langue: 'en',
  codeLangue: 'en',
  localePartage: 'en_GB',

  meta: {
    titre: 'Beckerich school bus — your children’s bus times, without thinking about it',
    description:
      `The Beckerich municipality school bus plan, worked out child by child: their stop, ` +
      `their time, their school. Offline, no account. ` +
      `Independent site, with no connection to the municipality or the school.`,
  },

  general: {
    // Le titre que porte l'application elle-même en anglais (`app.titre`). Il entre dans
    // `og:site_name`, dans le balisage structuré et dans la vignette de partage : trois
    // endroits qui se contrediraient en silence si on en inventait une variante.
    marque: 'Beckerich school bus',
    sautContenu: 'Skip to content',
    ouvrirApp: 'Open the app',
    fermer: 'Close',
    theme: 'Theme',
    themeClair: 'Light',
    themeSombre: 'Dark',
    choixLangue: 'Language',
    bientot: 'Coming soon',
  },

  heros: {
    etiquette: `Independent site · School years ${CHIFFRES.anneesCouvertes.join(' and ')}`,
    // 19 / 14 / 18 caractères. C'est la ligne d'accroche de l'application elle-même
    // (`app.baseline`), découpée : la vitrine et l'application ouvrent sur la même phrase.
    titre: ['Your children’s bus', 'times, without', 'thinking about it.'],
    chapeau:
      `The official plan of the municipality of Beckerich, taken up child by child: their ` +
      `nearest stop, the time of their bus, and how long it takes them to walk there. ` +
      `The home screen shows nothing else.`,
    // 07:45, et non l'heure du bus : c'est l'heure qu'affiche la capture d'à côté.
    heure: '07:45',
    legendeTitre: 'Next departure',
    legendeDetail: 'Léa · Hovelange · Kneppchen · 4 min walk',
    actionPrincipale: 'Open the app',
    actionSecondaire: 'What the site cannot do',
    invite: 'Scroll',
  },

  chiffres: {
    arrets: 'stops served',
    villages: 'villages in the municipality',
    langues: 'languages, including Luxembourgish',
    envoi: 'pieces of family data sent to a server',
    envoiValeur: '0',
    envoiNote:
      `Two things do leave all the same: the app counts its page views, and turning on ` +
      `notifications puts an anonymous device identifier on a server for as long as you ` +
      `stay subscribed. Not your address, not the first names, not the cycles.`,
  },

  recit: {
    etiquette: 'The morning',
    titre: 'Twenty minutes, and a column to find.',
    chapeau:
      `The official plan is accurate. It is also long, dense, and written for the whole ` +
      `municipality at once — not for one particular child, on a Tuesday, at seven o’clock.`,
    temps: [
      {
        titre: 'The plan runs to five pages',
        texte:
          `Seven routes, eleven services, and footnotes about the days when the rule changes. ` +
          `It is all there: the site transcribes it line by line, deciding nothing on your ` +
          `behalf. All that remains is to find, every morning, the right column for the right ` +
          `village and the right cycle.`,
      },
      {
        titre: 'You fill it in once',
        texte:
          `Seven questions, one per screen: the address, the first name, the cycle, then the ` +
          `bus, lunch, the after-school centre and the days that fall outside the ordinary. ` +
          `The cycle settles the school, the address settles the stop. A second child starts ` +
          `from their elder sibling’s setup: only a first name and a cycle are left to change.`,
      },
      {
        titre: 'After that, only a time is left',
        texte:
          `The home screen shows the next departure, and very little else, in large type. ` +
          `Beside it, “in 16 min”: the time you have left before LEAVING, with the walk to the ` +
          `stop already taken off. When it is time to go, a dot starts beating. Nothing to look ` +
          `up, nothing to unfold, nothing to compare.`,
      },
      {
        titre: 'And the rest follows',
        texte:
          `A child’s whole week on one screen, with the walking route to their stop on a map; ` +
          `the official plan to check against; an export to the phone’s calendar; the A4 sheet ` +
          `for the fridge. None of that clutters the morning screen.`,
      },
    ],
  },

  fonctions: {
    etiquette: 'What is inside',
    titre: 'Everything a bus plan does not say on its own.',
    chapeau: `Each feature answers a situation that a parent in the municipality runs into.`,
    tuiles: [
      {
        icone: 'semaine',
        titre: 'The week at a glance',
        texte:
          `A child’s five days on one screen: departure time, stop, school, return, and a map ` +
          `of the walking route to the stop. On some days you take them yourself, or collect ` +
          `them: say so, and those journeys disappear instead of staying on screen for nothing.`,
      },
      {
        icone: 'plan',
        titre: 'The official plan, transcribed',
        texte:
          `The ${CHIFFRES.lignes} routes and ${CHIFFRES.arrets} stops, transcribed table by ` +
          `table, with the municipality’s PDF alongside.`,
      },
      {
        icone: 'agenda',
        titre: 'Into your calendar',
        texte:
          `One .ics file per child, or a single one for the whole family. School holidays have ` +
          `already been taken out.`,
      },
      {
        icone: 'alerte',
        titre: 'Disruptions',
        texte:
          `Someone from the school or the municipality publishes a cancellation by answering ` +
          `five questions. The cancelled journey disappears from the screen; a delay is shown ` +
          `struck through and corrected. A notification can warn you, without ever guaranteeing ` +
          `anything.`,
      },
      {
        icone: 'imprimer',
        titre: 'The sheet for the fridge',
        texte:
          `One A4 page per child, or the whole family on a single sheet. In black and white, ` +
          `with no gradients and no grey backgrounds.`,
      },
      {
        icone: 'partage',
        titre: 'Sharing, QR codes, and picking up again',
        texte:
          `A link — or a QR code — to send to the grandparents or to whoever is minding the ` +
          `children: they see the same screen as you. The same link works on iPhone, where the ` +
          `installed app cannot see what you entered in Safari.`,
      },
      {
        icone: 'repas',
        titre: 'Lunch at home, or not',
        texte:
          `A child can eat at the Dillendapp on Monday and come home on Tuesday. Lunch is set ` +
          `day by day, and the journeys follow.`,
      },
      {
        icone: 'adresse',
        titre: 'Tuesdays at grandma’s',
        texte:
          `A different address for a single day — and for a single part of that day: the ` +
          `morning, midday or evening. The nearest stop is worked out again for that day.`,
      },
      {
        icone: 'horloge',
        titre: 'The after-school centre',
        texte:
          `You drop them at the Dillendapp on Monday, you collect them on Thursday. The ` +
          `possible times are bounded by the maison relais opening hours and narrowed by the ` +
          `bus for their cycle. On evenings when you cannot come, the sheet points to the ` +
          `Bummelbus.`,
      },
    ],
  },

  confidentialite: {
    etiquette: 'The first principle',
    titre: 'No data about your family leaves the device.',
    chapeau:
      `This is not an intention, it is a property of the code. Your home address, the first ` +
      `names and the cycles live in your browser’s memory, and the site has nowhere to send ` +
      `them.`,
    points: [
      {
        titre: 'Nothing to send, nothing to lose',
        texte:
          `No account, no sign-up, no password. What you enter stays in the browser of the ` +
          `device where you entered it, and one button in the settings erases all of it.`,
      },
      {
        titre: 'Address search works offline',
        texte:
          `The ${CHIFFRES.rues} streets of the municipality — ${CHIFFRES.adresses} addresses — ` +
          `are carried inside the site. Typing yours queries no mapping service: nobody on the ` +
          `outside learns where you live. In return, the search knows this municipality and no ` +
          `other.`,
      },
      {
        titre: 'Sharing happens after the hash',
        texte:
          `A shared link keeps the setup in the fragment of the address — the part after the ` +
          `“#”. Browsers never send it to the server. The link works, and nobody read it on ` +
          `the way.`,
      },
    ],
    legendeSchema: 'What the browser keeps, and what does not leave it.',
  },

  langues: {
    etiquette: 'Five languages',
    titre: 'Including the one spoken at home.',
    chapeau:
      `The app is translated into French, German, Luxembourgish, Portuguese and English. ` +
      `Translation corrections are published without rebuilding the site — a mistake reported ` +
      `in the morning can be fixed the same afternoon.`,
    // Le titre de l'application dans chacune de ses langues. Ce ne sont pas des traductions
    // à refaire : les quatre fichiers de contenu portent la même liste, mot pour mot.
    mots: [
      { code: 'fr', texte: 'Bus scolaire Beckerich' },
      { code: 'de', texte: 'Schulbus Beckerich' },
      { code: 'lb', texte: 'Schoulbus Biekerech' },
      { code: 'pt', texte: 'Autocarro escolar Beckerich' },
      { code: 'en', texte: 'Beckerich school bus' },
    ],
  },

  horsligne: {
    etiquette: 'At the stop',
    titre: 'The times stay readable with no network.',
    chapeau:
      `The site installs like an app and keeps everything it needs on the device. At the stop, ` +
      `on one bar of signal, the time is already on screen: it did not have to be downloaded.`,
    points: [
      'Installs from the browser, with no app store involved',
      'Opens without waiting for the network',
      'The fonts, the times and the addresses are already there',
      'Updates itself when the network comes back',
      // La carte du trajet à pied est le seul écran qui demande encore le réseau. Le taire
      // ici, c'est promettre un « tout hors ligne » que la fiche de la semaine dément.
      'Only the walking route map still needs the network',
    ],
    action: 'How to install it',
    legendeSignal: 'No network',
  },

  limites: {
    etiquette: 'Honesty',
    titre: 'What this site cannot do.',
    chapeau: `Here is what this site cannot do, and what it does only approximately.`,
    /*
     * SIX items, et pas cinq : `.limites__liste` est une grille de trois colonnes
     * (`sections.css`). Trois ou six remplissent leurs rangées ; quatre ou cinq laissent un
     * trou qui se lit comme un oubli.
     */
    items: [
      {
        titre: 'Walking times are estimates',
        texte:
          `They are measured as the crow flies, increased by a third for detours, at 4.5 km/h. ` +
          `This is not a route: a hill, a level crossing or a six-year-old changes the answer.`,
      },
      {
        titre: 'The times are a transcription',
        texte:
          `They are copied from the municipality’s document, carefully and without guarantee. ` +
          `The municipality can change it without notice. In case of any discrepancy, the ` +
          `official document prevails.`,
      },
      {
        titre: 'The plan covers two years, on a spoken confirmation',
        texte:
          `The municipality confirmed by telephone, in August 2026, that the times were not ` +
          `changing for ${CHIFFRES.anneesCouvertes[1]}. A spoken confirmation is not a ` +
          `document: it has to be checked again each September, and the site says so wherever ` +
          `it shows the year.`,
      },
      {
        titre: 'A notification is not a guarantee',
        texte:
          `A phone switched off, a “do not disturb” mode, a notification service down, and it ` +
          `does not arrive. The school and the municipality remain the official channel; the ` +
          `app does not replace them.`,
      },
      {
        titre: 'Address search stops at the municipality',
        texte:
          `It knows only the ${CHIFFRES.rues} streets of Beckerich. For a home somewhere else ` +
          `— at the grandparents’, in the next village — you have to name the stop yourself, ` +
          `and the walking time becomes unknown.`,
      },
      {
        titre: 'Two things do leave the device',
        texte:
          `The app counts its page views, and turning on notifications puts an anonymous device ` +
          `identifier on a server for as long as you stay subscribed. Nothing you enter goes ` +
          `with it.`,
      },
    ],
    lien: 'Read the “Limits” page',
  },

  independance: {
    titre: 'This site is independent.',
    texte:
      `It is made by a parent, privately, and has no connection with the municipal ` +
      `administration of Beckerich or with the school. It commits nobody but itself. In case ` +
      `of doubt or discrepancy, the municipality’s official document prevails.`,
    lien: 'See the official plan on kanner.beckerich.lu',
    retour: 'Back to the home page',
  },

  final: {
    // Les mêmes nombres que la capture du héros : 07:25 à l'écran, départ à 07:45,
    // quatre minutes de marche — donc seize minutes avant de sortir.
    surtitre: 'It is 07:25.',
    heure: '07:45',
    titre: 'Sixteen minutes left before leaving.',
    // Pas d'impératif tant que l'application n'est pas joignable : cette phrase est affichée
    // juste au-dessus du bloc qui annonce qu'il n'y a rien à ouvrir.
    chapeau:
      `This will be the morning screen: a time, and how long is left before leaving. Nothing ` +
      `to look up, nothing to compare, no morning spent thinking about it.`,
    action: 'Open the app',
    qr: 'Or scan to open it on the phone',
    // Trois choses vraies, et pas une de plus. « Not yet open to the public » serait faux :
    // l'application est joignable par qui en connaît l'adresse. La page CHOISIT de ne pas y
    // mener — ce n'est pas la même chose que prétendre qu'on ne le peut pas.
    bientot:
      `The app is still in development. This page describes what it does; it does not lead ` +
      `there yet. In the meantime, the municipality’s official plan remains the source to ` +
      `consult.`,
  },

  pied: {
    description:
      `School bus times for the municipality of Beckerich, worked out for each child. ` +
      `Independent site, with no connection to the municipality or the school.`,
    titreSite: 'The site',
    titreProjet: 'The project',
    liens: {
      site: [
        { texte: 'Open the app', url: URL_APP },
        { texte: 'Limits of this site', url: URL_LIMITES },
        { texte: 'Independence', url: URL_INDEPENDANCE },
      ],
      projet: [
        { texte: 'Credits and thanks', url: URL_CREDITS },
      ],
    },
    mention: 'Made by a parent, in Beckerich.',
    source: `Data: the municipality’s official plan, school years ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: 'Legal notice',
    lienContact: 'Contact',
    viePrivee: 'This page sets no cookies, measures nothing, and calls no server.',
  },

  mentions: {
    titre: `Legal notice`,
    intro: `This page identifies who publishes this site. It changes nothing about what the site says elsewhere: the site remains independent, and the municipality's official document prevails.`,
    editeurTitre: `Publisher`,
    editeurCorps: `This site is published by ${NOM_EDITEUR}, privately and non-commercially. It was neither commissioned, approved nor reviewed by the municipal administration of Beckerich, by the fundamental school or by the maison relais.
Address: ${ADRESSE_EDITEUR}`,
    hebergeurTitre: `Hosting`,
    hebergeurCorps: `The site is made of static files, served from a server rented by the publisher. No visitor data is kept there.`,
    donneesTitre: `Personal data`,
    donneesCorps: `This page sets no cookies, measures no audience and makes no request to any third-party service. No personal data is collected by the site itself, so there is nothing to consult, correct or erase.
If you write to ${ADRESSE_CONTACT}, on the other hand, your message and the address it comes from arrive in an ordinary mailbox. They are used only to reply to you, are passed on to nobody, and are deleted once the exchange is over.
The app, for its part, keeps what you enter on your device alone; its “Limits” page sets this out in detail.`,
    responsabiliteTitre: `Liability`,
    responsabiliteCorps: `The times shown are taken from the municipality's official plan and transcribed with care, without any guarantee of accuracy. In case of doubt or discrepancy, the municipality's official document prevails.`,
    retour: `Back to the home page`,
  },

  contact: {
    titre: 'Write',
    intro:
      `The app is still in development. If it is of interest to you, or if you are wondering ` +
      `what it will do, this is the way through. The form sends nothing itself — it prepares ` +
      `the email in your own software, and you are the one who sends it.`,
    note:
      `Nothing leaves this page. The button opens your mail software with the message already ` +
      `written; you read it over, and you decide. What you send reaches ${NOM_EDITEUR}, is ` +
      `used to reply to you, is passed on to nobody and is deleted once the exchange is over.`,
    categorieLegende: 'What is this about?',
    /*
     * Les clés ne sont PAS traduites : elles entrent dans l'objet du courriel et `horaire`
     * déclenche le renvoi vers la commune. Les libellés, eux, restent sous 39 caractères —
     * `contact.test.ts` construit le pire cas de `mailto:` avec le plus long des quatre
     * langues, et vérifie qu'il tient sous 2000 caractères.
     */
    categories: [
      { cle: 'interet', texte: 'The app interests me' },
      { cle: 'question', texte: 'A question about the project' },
      { cle: 'horaire', texte: 'A question about the times' },
      { cle: 'autre', texte: 'Something else' },
    ],
    renvoiCommune:
      `This is not the municipality’s site, and the app is not open yet: there are no times ` +
      `to consult here for the moment. For the times in force today, the municipality’s ` +
      `official plan prevails.`,
    nomEtiquette: 'Your name',
    courrielEtiquette: 'Your email address',
    courrielAide: 'It is used to reply to you, and for nothing else.',
    messageEtiquette: 'Your message',
    messageAide: 'Say where you are writing from and what you want to know: the reply will be more useful.',
    compteur: '{n} characters left',
    envoyer: 'Prepare the email',
    sujetPrefixe: '[schoulbus.lu]',
    ouvertTitre: 'Your mail software should have opened',
    ouvertTexte:
      `The message is already written there; all that is left is to send it. If nothing ` +
      `happened, no mail software is set up on this device — the address below can be copied ` +
      `out by hand.`,
    directTitre: 'Write directly',
    directTexte: 'Without going through the form:',
    erreurResume: 'The email was not prepared: at least one field needs another look.',
    erreurs: {
      requis: 'This field is required.',
      courrielInvalide: 'This does not look like an email address.',
      tropCourt: 'A few more words would help us understand.',
      tropLong: 'That is too long for an email prepared this way.',
    },
    retour: 'Back to the home page',
    brefTitre: 'A question about the app?',
    brefTexte:
      `It is still in development. To find out more, or simply to say that it is of interest ` +
      `to you, there is an address.`,
    brefAction: 'Write',
  },

}
