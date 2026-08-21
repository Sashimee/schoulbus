/*
 * Deutsch — übersetzt aus `fr.ts`, nicht umgekehrt.
 *
 * Ton wie in der Anwendung: einen Sachverhalt nennen, dann sagen, was die Software damit
 * macht. Keine Werbesprache, kein Aphorismus. Der Abschnitt „Grenzen" steht VOR der
 * Schlussaufforderung — das ist die Reihenfolge der Anwendung selbst.
 *
 * ZWEI HARTE VORGABEN, vor jeder Änderung zu lesen:
 *
 *  1. Die Zahlen im Kopf der Seite und im Schluss sind DIE DER BILDSCHIRMAUFNAHME. Der
 *     Leser sieht den Bildschirm neben dem Satz; weichen sie ab, hält er den Satz für
 *     falsch. Auf `public/captures/aujourdhui-de-*.webp` steht „in 16 Min." — deshalb
 *     „16 Min." und nicht „16 min".
 *  2. `heros.titre` wird in den Teilen-Vorschaubildern mit 76 px auf 1200 px Breite
 *     gezeichnet: HÖCHSTENS 24 ZEICHEN PRO ZEILE, danach `npm run assets:partage`.
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

export const de: Contenu = {
  langue: 'de',
  codeLangue: 'de',

  meta: {
    titre: 'Schulbus Beckerich — die Abfahrtszeiten Ihrer Kinder, ohne Nachdenken',
    description:
      `Der Schulbusplan der Gemeinde Beckerich, für jedes Kind persönlich aufbereitet: ` +
      `seine Haltestelle, seine Uhrzeit, seine Schule. Offline, ohne Konto. ` +
      `Unabhängige Seite, ohne Verbindung zur Gemeinde oder zur Schule.`,
  },

  general: {
    marque: 'Schulbus Beckerich',
    sautContenu: 'Zum Inhalt springen',
    ouvrirApp: 'App öffnen',
    fermer: 'Schließen',
    theme: 'Darstellung',
    themeClair: 'Hell',
    themeSombre: 'Dunkel',
    choixLangue: 'Sprache',
    bientot: 'Bald verfügbar',
  },

  heros: {
    etiquette: `Unabhängige Seite · ${CHIFFRES.anneesCouvertes.join(' · ')}`,
    // 23 und 18 Zeichen: unter der Grenze von 24 für das Teilen-Vorschaubild.
    titre: ['Was Sie um 07:25 sehen,', 'an einem Dienstag.'],
    altCapture: `Startbildschirm der App: die Karte von Léa, Bus um 07:45 am Kneppchen.`,
    lignes: [
      { valeur: '07:45', texte: 'die Zeit ihres Busses, an ihrer Haltestelle' },
      {
        valeur: '16 Min.',
        texte: 'bis Sie losmüssen, die 4 Minuten Fußweg schon abgezogen',
        compte: true,
      },
      { valeur: 'Kneppchen', texte: 'die nächste Haltestelle zu Ihrer Adresse' },
      { valeur: 'Léa · Noah', texte: 'eine Karte je Kind, in der Reihenfolge der Abfahrten' },
    ],
    actionPrincipale: 'App öffnen',
    actionSecondaire: 'Was die Seite nicht kann',
    legende: 'Echte Aufnahme · 22. September 2026, 07:25 Uhr',
  },

  chiffres: {
    arrets: 'bediente Haltestellen',
    villages: 'Ortschaften der Gemeinde',
    langues: 'Sprachen, auch Luxemburgisch',
    envoi: 'an einen Server gesendete Familiendaten',
    envoiValeur: '0',
    envoiNote:
      `Zwei Dinge verlassen das Gerät dennoch: Die Anwendung zählt ihre Seitenaufrufe, und ` +
      `wer Benachrichtigungen einschaltet, hinterlegt für die Dauer des Abonnements eine ` +
      `anonyme Gerätekennung auf einem Server. Weder Ihre Adresse noch die Vornamen noch die Zyklen.`,
  },

  ecrans: {
    titre: 'Vier Bildschirme, und das ist das ganze Produkt.',
    note: `Echte Aufnahmen der Anwendung, Dienstag, 22. September 2026 um 07:25 Uhr.`,
    cartes: [
      { titre: 'Der Morgenbildschirm', texte: 'Eine Uhrzeit je Kind, und sonst nichts.' },
      { titre: 'Die Wochenübersicht', texte: 'Fünf Tage, und die Karte des Fußwegs.' },
      {
        titre: 'Der offizielle Plan, übertragen',
        texte: `${CHIFFRES.lignes} Linien, ${CHIFFRES.arrets} Haltestellen, Tabelle für Tabelle.`,
      },
      {
        titre: 'Sieben Fragen, ein einziges Mal',
        texte: 'Die Adresse bestimmt die Haltestelle, der Zyklus die Schule.',
      },
    ],
  },

  fonctions: {
    etiquette: 'Was drin ist',
    titre: 'Neun Antworten auf neun Morgen, die sich nicht gleichen.',
    tuiles: [
      {
        icone: 'semaine',
        titre: 'Die Wochenübersicht',
        texte: 'Die fünf Tage eines Kindes auf einem Bildschirm.',
      },
      {
        icone: 'plan',
        titre: 'Der offizielle Plan, übertragen',
        texte: 'Mit dem PDF der Gemeinde daneben.',
      },
      {
        icone: 'agenda',
        titre: 'In Ihren Kalender',
        texte: 'Eine .ics je Kind, Ferien schon abgezogen.',
      },
      {
        icone: 'alerte',
        ton: 'alerte',
        titre: 'Die Störungen',
        texte: 'Die ausgefallene Fahrt verschwindet vom Bildschirm.',
      },
      {
        icone: 'imprimer',
        titre: 'Das Blatt für den Kühlschrank',
        texte: 'Eine A4-Seite, in Schwarzweiß.',
      },
      {
        icone: 'partage',
        titre: 'Teilen, QR und Übernahme',
        texte: 'Die Großeltern sehen denselben Bildschirm.',
      },
      {
        icone: 'repas',
        titre: 'Mittags zu Hause, oder nicht',
        texte: 'Das Essen wird Tag für Tag eingestellt.',
      },
      {
        icone: 'adresse',
        titre: 'Dienstags bei der Oma',
        texte: 'Eine andere Adresse für einen einzigen Tag.',
      },
      {
        icone: 'horloge',
        titre: 'Die Betreuung',
        texte: 'Montags gebracht, donnerstags abgeholt.',
      },
    ],
  },

  principes: {
    donnees: {
      etiquette: 'Der erste Grundsatz',
      titre: 'Keine Daten Ihrer Familie verlassen das Gerät.',
      texte:
        `Kein Konto, kein Passwort. Die ${CHIFFRES.rues} Straßen der Gemeinde stecken in der ` +
        `Seite selbst: Ihre einzutippen fragt keinen Kartendienst.`,
    },
    horsLigne: {
      etiquette: 'An der Haltestelle',
      titre: 'Die Uhrzeit steht schon da, ohne Netz.',
      points: [
        { texte: 'Installiert sich aus dem Browser, ohne App-Store' },
        { texte: 'Schriften, Fahrzeiten und Adressen sind schon da' },
        { texte: 'Nur die Karte des Fußwegs braucht noch das Netz', ton: 'nuance' },
      ],
    },
  },

  limites: {
    titre: 'Was diese Seite nicht kann.',
    note: `sechs Grenzen, bevor wir Sie bitten, sie zu öffnen`,
    items: [
      {
        titre: 'Die Fußwege sind geschätzt',
        texte: `Luftlinie, um ein Drittel erhöht, mit 4,5 km/h. Das ist keine Route.`,
      },
      {
        titre: 'Die Fahrzeiten sind eine Übertragung',
        texte: `Bei Abweichungen gilt das offizielle Dokument der Gemeinde.`,
      },
      {
        titre: 'Der Plan beruht auf einer mündlichen Zusage',
        texte: `Die Gemeinde hat im August 2026 telefonisch bestätigt, für ${CHIFFRES.anneesCouvertes[1]}.`,
      },
      {
        titre: 'Eine Benachrichtigung ist keine Garantie',
        texte: `Schule und Gemeinde bleiben der offizielle Informationsweg.`,
      },
      {
        titre: 'Die Adresssuche endet an der Gemeindegrenze',
        texte: `Anderswo muss man die Haltestelle selbst nennen, ohne Fußweg.`,
      },
      {
        titre: 'Zwei Dinge gehen dennoch hinaus',
        texte:
          `Die Seitenaufrufe, und eine anonyme Gerätekennung, wenn Sie Benachrichtigungen ` +
          `einschalten.`,
      },
    ],
    lien: 'Die Seite „Grenzen" lesen',
  },

  independance: {
    titre: 'Diese Seite ist unabhängig.',
    texte:
      `Sie wurde von einem Elternteil privat erstellt und steht in keiner Verbindung zur ` +
      `Gemeindeverwaltung Beckerich oder zur Schule. Sie spricht nur für sich selbst. Im ` +
      `Zweifel oder bei Abweichungen gilt das offizielle Dokument der Gemeinde.`,
    lien: 'Den offiziellen Plan auf kanner.beckerich.lu ansehen',
    retour: `Zurück zur Startseite`,
  },

  final: {
    // Dieselben Zahlen wie auf der Bildschirmaufnahme im Kopf der Seite.
    surtitre: 'Es ist 07:25 Uhr.',
    heure: '07:45',
    legendeHeure: 'Abfahrt · Kneppchen',
    titreAvant: 'Es bleiben ',
    titreAccent: 'sechzehn Minuten',
    titreApres: ', bis Sie losmüssen.',
    // Kein Imperativ, solange die Anwendung nicht erreichbar ist — Begründung siehe `fr.ts`.
    chapeau:
      `So wird der Morgen aussehen: eine Uhrzeit, und die Zeit, die bis zum Losgehen bleibt. ` +
      `Nichts zu suchen, nichts zu vergleichen, an keinem Morgen daran zu denken.`,
    action: 'App öffnen',
    qr: 'Oder scannen, um sie auf dem Telefon zu öffnen',
    bientot:
      `Die Anwendung ist noch in Entwicklung. Diese Seite beschreibt, was sie tut; sie führt ` +
      `noch nicht dorthin. Bis dahin bleibt der offizielle Plan der Gemeinde die Quelle, die ` +
      `es zu lesen gilt.`,
  },

  pied: {
    description:
      `Die Schulbuszeiten der Gemeinde Beckerich, für jedes Kind persönlich aufbereitet. ` +
      `Unabhängige Seite, ohne Verbindung zur Gemeinde oder zur Schule.`,
    titreSite: 'Die Seite',
    titreProjet: 'Das Projekt',
    liens: {
      site: [
        { texte: 'App öffnen', url: URL_APP },
        { texte: 'Grenzen der Seite', url: URL_LIMITES },
        { texte: 'Unabhängigkeit', url: URL_INDEPENDANCE },
      ],
      projet: [{ texte: 'Dank und Mitwirkende', url: URL_CREDITS }],
    },
    mention: 'Von einem Elternteil, in Beckerich.',
    source: `Daten: offizieller Plan der Gemeinde, ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: 'Impressum',
    viePrivee: 'Diese Seite setzt keine Cookies, misst nichts und ruft keinen Server auf.',
  },

  mentions: {
    titre: `Impressum`,
    intro: `Diese Seite nennt, wer dieses Angebot veröffentlicht. Am Übrigen ändert sie nichts: Die Seite bleibt unabhängig, und maßgeblich ist das offizielle Dokument der Gemeinde.`,
    editeurTitre: `Herausgeber`,
    editeurCorps: `Diese Seite wird von ${NOM_EDITEUR} privat und nicht gewerblich veröffentlicht. Sie ist weder beauftragt noch geprüft oder freigegeben durch die Gemeindeverwaltung Beckerich, die Grundschule oder die Maison Relais.
Anschrift: ${ADRESSE_EDITEUR}`,
    hebergeurTitre: `Hosting`,
    hebergeurCorps: `Die Seite besteht aus statischen Dateien, die von einem durch den Herausgeber gemieteten Server ausgeliefert werden. Besuchsdaten werden dort nicht aufbewahrt.`,
    donneesTitre: `Personenbezogene Daten`,
    donneesCorps: `Diese Seite setzt keine Cookies, misst keine Zugriffe und ruft keinen Dienst Dritter auf. Es werden keine personenbezogenen Daten erhoben; es gibt daher nichts einzusehen, zu berichtigen oder zu löschen. Die Anwendung selbst behält, was Sie dort eingeben, ausschließlich auf Ihrem Gerät — ihre Seite „Grenzen" führt das aus.`,
    responsabiliteTitre: `Haftung`,
    responsabiliteCorps: `Die angezeigten Zeiten stammen aus dem offiziellen Plan der Gemeinde und sind sorgfältig übertragen, jedoch ohne Gewähr. Im Zweifel oder bei Abweichungen gilt das offizielle Dokument der Gemeinde.`,
    retour: `Zurück zur Startseite`,
  },
}
