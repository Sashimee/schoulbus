/*
 * Allemand. Traduit depuis `fr.ts`, qui reste la référence.
 *
 * Le vouvoiement est de rigueur : la page s'adresse à des parents qu'on ne connaît pas.
 * Les noms propres — Beckerich, Huttange, Dillendapp — gardent leur graphie officielle,
 * celle du document de la commune.
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

export const de: Contenu = {
  langue: 'de',
  codeLangue: 'de',

  meta: {
    titre: 'Schulbus Beckerich — die Abfahrtszeiten Ihrer Kinder, ohne Nachdenken',
    description:
      `Der Schulbusplan der Gemeinde Beckerich, für jedes Kind persönlich aufbereitet: ` +
      `seine Haltestelle, seine Uhrzeit, seine Schule. Offline, ohne Konto, ohne gesendete ` +
      `Daten. Unabhängige Seite, ohne Verbindung zur Gemeinde oder zur Schule.`,
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
    etiquette: `Unabhängige Seite · Schuljahr ${CHIFFRES.anneeScolaire}`,
    titre: ['Die Buszeiten', 'Ihrer Kinder,', 'ohne Nachdenken.'],
    chapeau:
      `Der offizielle Plan der Gemeinde Beckerich, aufbereitet für jedes einzelne Kind. ` +
      `Seine nächste Haltestelle, die Uhrzeit, zu der es losfährt, und die Zeit, die es zu Fuß ` +
      `dorthin braucht. Aufmachen, hinsehen, losgehen.`,
    heure: '07:12',
    legendeTitre: 'Nächste Abfahrt',
    legendeDetail: 'Léa · Haltestelle Huttange · 4 Min. zu Fuß',
    actionPrincipale: 'App öffnen',
    actionSecondaire: 'Was die Seite nicht weiß',
    invite: 'Scrollen',
  },

  chiffres: {
    arrets: 'bediente Haltestellen',
    villages: 'Ortschaften der Gemeinde',
    langues: 'Sprachen, auch Luxemburgisch',
    envoi: 'an einen Server gesendete Daten',
    envoiValeur: '0',
  },

  recit: {
    etiquette: 'Morgens',
    titre: 'Acht Minuten, und eine Spalte zu finden.',
    chapeau:
      `Der offizielle Plan stimmt. Er ist nur lang, dicht und für die ganze Gemeinde auf ` +
      `einmal gedacht — nicht für ein bestimmtes Kind, an einem Dienstag, um sieben Uhr.`,
    temps: [
      {
        titre: 'Der Plan füllt fünf Seiten',
        texte:
          `Drei Linien hin, zwei zurück, eine Fahrt zur Kantine, dazu Fußnoten für die Tage, an ` +
          `denen die Regel wechselt. Alles steht drin. Man muss nur jeden Morgen die richtige ` +
          `Spalte für die richtige Ortschaft und den richtigen Zyklus wiederfinden.`,
      },
      {
        titre: 'Sie füllen ihn ein einziges Mal aus',
        texte:
          `Wohnadresse, Vorname des Kindes, sein Zyklus. Die Seite leitet daraus Schule, Linie ` +
          `und nächstgelegene Haltestelle ab und schätzt den Fußweg dorthin. Das dauert fünf ` +
          `Minuten — und wiederholt sich nicht.`,
      },
      {
        titre: 'Danach bleibt nur noch eine Uhrzeit',
        texte:
          `Der Startbildschirm zeigt nichts außer der nächsten Abfahrt, sehr groß. Wenn es Zeit ` +
          `wird loszugehen, beginnt neben der Uhrzeit ein Punkt zu pulsieren. Nichts zu suchen, ` +
          `nichts aufzuklappen, nichts zu vergleichen.`,
      },
      {
        titre: 'Der Rest folgt von selbst',
        texte:
          `Der Wochenzettel für die Schultasche, der vollständige Plan zum Nachprüfen, der ` +
          `Export in den Kalender des Telefons, das A4-Blatt für den Kühlschrank. Jedes an ` +
          `seinem Platz — und keines drängt sich auf den Morgenbildschirm.`,
      },
    ],
  },

  fonctions: {
    etiquette: 'Was drinsteckt',
    titre: 'Alles, was ein Busplan allein nicht sagt.',
    chapeau:
      `Jede Funktion beantwortet eine Situation, die Eltern in der Gemeinde wirklich erlebt ` +
      `haben. Keine wurde hinzugefügt, weil sie sich auf einer Liste gut macht.`,
    tuiles: [
      {
        icone: 'semaine',
        titre: 'Der Wochenzettel',
        texte:
          `Die fünf Tage eines Kindes auf einem Bildschirm: Abfahrtszeit, Haltestelle, Schule, ` +
          `Rückfahrt. Tage ohne Bus sind als solche gekennzeichnet, nicht einfach leer gelassen.`,
      },
      {
        icone: 'plan',
        titre: 'Der offizielle Plan, lesbar',
        texte:
          `Die ${CHIFFRES.lignes} Linien und ${CHIFFRES.arrets} Haltestellen auf einer Karte — ` +
          `und das PDF der Gemeinde mit einem Griff daneben.`,
      },
      {
        icone: 'agenda',
        titre: 'In Ihren Kalender',
        texte:
          `Eine .ics-Datei für jeden Kalender, oder auf Wunsch ein direkter Eintrag in Google ` +
          `Kalender. Die Schulferien sind bereits berücksichtigt.`,
      },
      {
        icone: 'alerte',
        titre: 'Störungen',
        texte:
          `Kündigt die Gemeinde einen Ausfall oder eine Verspätung an, steht sie ganz oben auf ` +
          `dem Bildschirm — und als Mitteilung auf dem Telefon, wenn Sie sie erlaubt haben.`,
      },
      {
        icone: 'imprimer',
        titre: 'Das Blatt für den Kühlschrank',
        texte:
          `Eine A4-Seite pro Kind, oder alle Geschwister auf einem Blatt. In Schwarzweiß ` +
          `gedruckt, ohne Verlauf und ohne grauen Hintergrund: gut lesbar, und es leert keine ` +
          `Patrone.`,
      },
      {
        icone: 'partage',
        titre: 'Teilen und QR-Code',
        texte:
          `Ein Link für die Großeltern oder die Tagesmutter. Er trägt die Einstellungen mit ` +
          `sich — niemals über einen Server, siehe weiter unten.`,
      },
      {
        icone: 'repas',
        titre: 'Mittags daheim, oder nicht',
        texte:
          `Das Mittagessen wird tageweise eingestellt. In der Kantine Dillendapp folgt das Kind ` +
          `der Mittagsfahrt, zu Hause der gewöhnlichen Rückfahrt. Der Plan richtet sich danach.`,
      },
      {
        icone: 'adresse',
        titre: 'Dienstags bei der Oma',
        texte:
          `Eine abweichende Adresse für einen einzelnen Tag — die nächstgelegene Haltestelle ` +
          `wird nur für diesen Tag neu berechnet.`,
      },
      {
        icone: 'horloge',
        titre: 'Die Betreuung',
        texte:
          `Die Zeiten der Maison Relais fließen in den Zettel ein, damit die angezeigte Uhrzeit ` +
          `auch wirklich die ist, auf die es an diesem Tag ankommt.`,
      },
    ],
  },

  confidentialite: {
    etiquette: 'Der erste Grundsatz',
    titre: 'Keine Daten Ihrer Familie verlassen das Gerät.',
    chapeau:
      `Das ist keine Absichtserklärung, sondern eine Eigenschaft des Codes. Wohnadresse, ` +
      `Vornamen und Zyklen liegen im Speicher Ihres Browsers, und die Seite hat keinen Ort, ` +
      `an den sie sie schicken könnte.`,
    points: [
      {
        titre: 'Nichts zu senden, nichts zu verlieren',
        texte:
          `Kein Konto, keine Anmeldung, kein Passwort. Was Sie eingeben, bleibt im Browser des ` +
          `Geräts, auf dem Sie es eingegeben haben.`,
      },
      {
        titre: 'Die Adresssuche läuft offline',
        texte:
          `Die ${CHIFFRES.rues} Straßen der Gemeinde stecken in der Seite selbst. Ihre Straße ` +
          `einzutippen fragt keinen Kartendienst: niemand draußen erfährt, wo Sie wohnen.`,
      },
      {
        titre: 'Geteilt wird hinter dem Rautezeichen',
        texte:
          `Ein geteilter Link legt die Einstellungen in den Fragmentteil der Adresse — den Teil ` +
          `nach dem „#". Browser senden ihn niemals an den Server. Der Link funktioniert, und ` +
          `niemand hat ihn unterwegs mitgelesen.`,
      },
    ],
    legendeSchema: 'Was der Browser behält — und was hinausgeht, nämlich nichts.',
  },

  langues: {
    etiquette: 'Fünf Sprachen',
    titre: 'Auch die, die zu Hause gesprochen wird.',
    chapeau:
      `Die App ist auf Französisch, Deutsch, Luxemburgisch, Portugiesisch und Englisch ` +
      `verfügbar. Übersetzungskorrekturen werden ohne neuen Build veröffentlicht — ein morgens ` +
      `gemeldeter Fehler kann nachmittags behoben sein.`,
    mots: [
      { code: 'fr', texte: 'Bus scolaire Beckerich' },
      { code: 'de', texte: 'Schulbus Beckerich' },
      { code: 'lb', texte: 'Schoulbus Biekerech' },
      { code: 'pt', texte: 'Autocarro escolar Beckerich' },
      { code: 'en', texte: 'Beckerich school bus' },
    ],
  },

  horsligne: {
    etiquette: 'An der Haltestelle',
    titre: 'Funktioniert dort, wo das Netz es nicht tut.',
    chapeau:
      `Die Seite lässt sich wie eine App installieren und behält alles Nötige auf dem Gerät. ` +
      `An der Bushaltestelle, im Regen, mit einem Balken Empfang steht die Uhrzeit schon da — ` +
      `sie musste nie geladen werden.`,
    points: [
      'Installiert sich aus dem Browser, ohne App-Store',
      'Öffnet in unter einer Sekunde, mit oder ohne Netz',
      'Schriften, Fahrpläne und Adressen sind bereits da',
      'Aktualisiert sich von selbst, sobald das Netz zurück ist',
    ],
    action: 'So wird sie installiert',
    legendeSignal: 'Ohne Netz',
  },

  limites: {
    etiquette: 'Ehrlichkeit',
    titre: 'Was diese Seite nicht weiß.',
    chapeau:
      `Eine App, die ihre Näherungen verschweigt, lässt Sie einen Bus verpassen, ohne Sie zu ` +
      `warnen. Diese zeigt ihre — und zwar dort, wo sie zählen.`,
    items: [
      {
        titre: 'Die Gehzeiten sind geschätzt',
        texte:
          `Sie werden in Luftlinie berechnet, im Tempo eines Erwachsenen. Das ist keine ` +
          `Wegbeschreibung: ein Bahnübergang, eine Steigung oder ein sechsjähriges Kind ` +
          `verändern das Ergebnis.`,
      },
      {
        titre: 'Manche Haltestellen liegen ungefähr',
        texte:
          `Ist eine Haltestelle in den öffentlichen Daten nicht benannt, nimmt die Seite die ` +
          `Mitte der Straße oder der Ortschaft. Sie sagt das dazu, statt eine Genauigkeit ` +
          `vorzutäuschen.`,
      },
      {
        titre: 'Der offizielle Plan hat Graubereiche',
        texte:
          `Einige Regeln des Dokuments sind mehrdeutig. Sie werden unverändert übernommen und ` +
          `als solche gekennzeichnet — nie an Ihrer Stelle entschieden.`,
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
  },

  final: {
    surtitre: 'Es ist 07:04 Uhr.',
    heure: '07:12',
    titre: 'Der Bus fährt in acht Minuten.',
    chapeau:
      `Sie müssen ihn nicht suchen. Einmal öffnen, einmal ausfüllen — und die Uhrzeit steht an ` +
      `jedem folgenden Morgen da.`,
    action: 'App öffnen',
    qr: 'Oder scannen, um sie auf dem Telefon zu öffnen',
    bientot:
      `Die Anwendung ist noch nicht öffentlich. Diese Seite beschreibt, was sie können wird; ` +
      `bis dahin bleibt der offizielle Plan der Gemeinde die einzige Quelle.`,
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
      projet: [
        { texte: 'Dank und Mitwirkende', url: URL_CREDITS },
        { texte: 'Quellcode', url: URL_DEPOT },
      ],
    },
    mention: 'Von einem Elternteil, in Beckerich.',
    source: `Daten: offizieller Plan der Gemeinde, Schuljahr ${CHIFFRES.anneeScolaire}.`,
    lienMentions: "Impressum",
    viePrivee: 'Diese Seite setzt keine Cookies, misst nichts und ruft keinen Server auf.',
  },

  mentions: {
    titre: `Impressum`,
    intro: `Diese Seite nennt, wer dieses Angebot veröffentlicht. Am Übrigen ändert sie nichts: Die Seite bleibt unabhängig, und maßgeblich ist das offizielle Dokument der Gemeinde.`,
    editeurTitre: `Herausgeber`,
    editeurCorps: `Diese Seite wird von ${NOM_EDITEUR} privat und nicht gewerblich veröffentlicht. Sie ist weder beauftragt noch geprüft oder freigegeben durch die Gemeindeverwaltung Beckerich, die Grundschule oder die Maison Relais.
Anschrift: ${ADRESSE_EDITEUR}
Kontakt: über das Code-Repository, dessen Adresse in der Fußzeile steht.`,
    hebergeurTitre: `Hosting`,
    hebergeurCorps: `Die Seite besteht aus statischen Dateien, die von einem durch den Herausgeber gemieteten Server ausgeliefert werden. Besuchsdaten werden dort nicht aufbewahrt.`,
    donneesTitre: `Personenbezogene Daten`,
    donneesCorps: `Diese Seite setzt keine Cookies, misst keine Zugriffe und ruft keinen Dienst Dritter auf. Es werden keine personenbezogenen Daten erhoben; es gibt daher nichts einzusehen, zu berichtigen oder zu löschen. Die Anwendung selbst behält, was Sie dort eingeben, ausschließlich auf Ihrem Gerät — ihre Seite „Grenzen" führt das aus.`,
    responsabiliteTitre: `Haftung`,
    responsabiliteCorps: `Die angezeigten Zeiten stammen aus dem offiziellen Plan der Gemeinde und sind sorgfältig übertragen, jedoch ohne Gewähr. Im Zweifel oder bei Abweichungen gilt das offizielle Dokument der Gemeinde.`,
    retour: `Zurück zur Startseite`,
  },

}
