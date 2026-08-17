/*
 * Allemand. Traduit depuis `fr.ts`, qui reste la référence.
 *
 * Le vouvoiement est de rigueur : la page s'adresse à des parents qu'on ne connaît pas.
 * Les noms propres — Beckerich, Huttange, Dillendapp — gardent leur graphie officielle,
 * celle du document de la commune.
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
    etiquette: `Unabhängige Seite · Schuljahre ${CHIFFRES.anneesCouvertes.join(' und ')}`,
    titre: ['Die Buszeiten', 'Ihrer Kinder,', 'ohne Nachdenken.'],
    chapeau:
      `Der offizielle Plan der Gemeinde Beckerich, Kind für Kind aufbereitet: die nächste ` +
      `Haltestelle, die Uhrzeit seines Busses und die Zeit, die es zu Fuß dorthin braucht. ` +
      `Mehr zeigt der Startbildschirm nicht.`,
    // 07:45 — dieselbe Uhrzeit wie auf der Bildschirmaufnahme daneben.
    heure: '07:45',
    legendeTitre: 'Nächste Abfahrt',
    legendeDetail: 'Léa · Hovelange · Kneppchen · 4 Min. zu Fuß',
    actionPrincipale: 'App öffnen',
    actionSecondaire: 'Was die Seite nicht weiß',
    invite: 'Scrollen',
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

  recit: {
    etiquette: 'Morgens',
    titre: 'Zwanzig Minuten, und eine Spalte zu finden.',
    chapeau:
      `Der offizielle Plan stimmt. Er ist nur lang, dicht und für die ganze Gemeinde auf ` +
      `einmal geschrieben — nicht für ein bestimmtes Kind, an einem Dienstag, um sieben Uhr.`,
    temps: [
      {
        titre: 'Der Plan füllt fünf Seiten',
        texte:
          `Sieben Linien, elf Fahrten, dazu Fußnoten für die Tage, an denen die Regel wechselt. ` +
          `Alles steht drin: Die Seite überträgt es Zeile für Zeile, ohne etwas zu entscheiden. ` +
          `Bleibt nur, jeden Morgen die richtige Spalte für die richtige Ortschaft und den ` +
          `richtigen Zyklus wiederzufinden.`,
      },
      {
        titre: 'Sie füllen ihn ein einziges Mal aus',
        texte:
          `Sieben Fragen, eine pro Bildschirm: Adresse, Vorname, Zyklus, dann Bus, Mittag, ` +
          `Betreuung und die Tage, die aus der Reihe fallen. Der Zyklus bestimmt die Schule, die ` +
          `Adresse die Haltestelle. Das zweite Kind übernimmt die Einstellungen des älteren: zu ` +
          `ändern bleiben ein Vorname und ein Zyklus.`,
      },
      {
        titre: 'Danach bleibt nur noch eine Uhrzeit',
        texte:
          `Der Startbildschirm zeigt nichts außer der nächsten Abfahrt, sehr groß. Daneben „in ` +
          `16 Min.“: die Zeit, die Ihnen bleibt, bis Sie LOSGEHEN müssen — der Fußweg zur ` +
          `Haltestelle ist schon abgezogen. Wenn es so weit ist, beginnt ein Punkt zu pulsieren. ` +
          `Nichts zu suchen, nichts aufzuklappen, nichts zu vergleichen.`,
      },
      {
        titre: 'Der Rest folgt von selbst',
        texte:
          `Die ganze Woche eines Kindes auf einem Bildschirm, mit der Karte des Fußwegs zu ` +
          `seiner Haltestelle; der offizielle Plan zum Nachprüfen; der Export in den Kalender des ` +
          `Telefons; das A4-Blatt für den Kühlschrank. Nichts davon belastet den Morgenbildschirm.`,
      },
    ],
  },

  fonctions: {
    etiquette: 'Was drinsteckt',
    titre: 'Alles, was ein Busplan allein nicht sagt.',
    chapeau: `Jede Funktion beantwortet eine Situation, die Eltern in der Gemeinde erleben.`,
    tuiles: [
      {
        icone: 'semaine',
        titre: 'Der Wochenzettel',
        texte:
          `Die fünf Tage eines Kindes auf einem Bildschirm: Abfahrtszeit, Haltestelle, Schule, ` +
          `Rückfahrt und eine Karte des Fußwegs zur Haltestelle. An manchen Tagen bringen Sie es ` +
          `selbst hin oder holen es ab: Sagen Sie es, und diese Fahrten verschwinden, statt ` +
          `unnötig dazustehen.`,
      },
      {
        icone: 'plan',
        titre: 'Der offizielle Plan, abgeschrieben',
        texte:
          `Die ${CHIFFRES.lignes} Linien und ${CHIFFRES.arrets} Haltestellen, Tabelle für ` +
          `Tabelle übertragen, mit dem PDF der Gemeinde daneben.`,
      },
      {
        icone: 'agenda',
        titre: 'In Ihren Kalender',
        texte:
          `Eine .ics-Datei pro Kind, oder eine einzige für alle Geschwister. Die Schulferien ` +
          `sind bereits herausgerechnet.`,
      },
      {
        icone: 'alerte',
        titre: 'Störungen',
        texte:
          `Eine Vertretung der Schule oder der Gemeinde meldet den Ausfall, indem sie fünf ` +
          `Fragen beantwortet. Die ausgefallene Fahrt verschwindet vom Bildschirm, die ` +
          `Verspätung erscheint durchgestrichen und korrigiert. Eine Mitteilung kann warnen — ` +
          `garantieren kann sie nichts.`,
      },
      {
        icone: 'imprimer',
        titre: 'Das Blatt für den Kühlschrank',
        texte:
          `Eine A4-Seite pro Kind, oder alle Geschwister auf einem Blatt. In Schwarzweiß, ohne ` +
          `Verlauf und ohne grauen Hintergrund.`,
      },
      {
        icone: 'partage',
        titre: 'Teilen, QR-Code und Übernahme',
        texte:
          `Ein Link — oder ein QR-Code — für die Großeltern oder die Tagesmutter: Sie sehen ` +
          `denselben Bildschirm wie Sie. Derselbe Link hilft auf dem iPhone, wo die installierte ` +
          `App nicht sieht, was Sie in Safari eingegeben hatten.`,
      },
      {
        icone: 'repas',
        titre: 'Mittags daheim, oder nicht',
        texte:
          `Ein Kind kann montags im Dillendapp essen und dienstags heimfahren. Das Mittagessen ` +
          `wird tageweise eingestellt, und die Fahrten richten sich danach.`,
      },
      {
        icone: 'adresse',
        titre: 'Dienstags bei der Oma',
        texte:
          `Eine andere Adresse für einen einzigen Tag — und für eine einzige Tageszeit: morgens, ` +
          `mittags oder abends. Die nächstgelegene Haltestelle wird für diesen Tag neu berechnet.`,
      },
      {
        icone: 'horloge',
        titre: 'Die Betreuung',
        texte:
          `Montags bringen Sie es ins Dillendapp, donnerstags holen Sie es ab. Die möglichen ` +
          `Zeiten sind durch die Öffnungszeiten der Maison Relais begrenzt und durch den Bus ` +
          `seines Zyklus weiter eingegrenzt. An Abenden, an denen Sie nicht kommen können, ` +
          `verweist der Zettel auf den Bummelbus.`,
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
          `Geräts, auf dem Sie es eingegeben haben — und eine Schaltfläche in den Einstellungen ` +
          `löscht alles wieder.`,
      },
      {
        titre: 'Die Adresssuche läuft offline',
        texte:
          `Die ${CHIFFRES.rues} Straßen der Gemeinde — ${CHIFFRES.adresses} Adressen — stecken ` +
          `in der Seite selbst. Ihre Straße einzutippen fragt keinen Kartendienst: niemand ` +
          `draußen erfährt, wo Sie wohnen. Dafür kennt die Suche auch nur diese eine Gemeinde.`,
      },
      {
        titre: 'Geteilt wird hinter dem Rautezeichen',
        texte:
          `Ein geteilter Link legt die Einstellungen in den Fragmentteil der Adresse — den Teil ` +
          `nach dem „#". Browser senden ihn niemals an den Server. Der Link funktioniert, und ` +
          `niemand hat ihn unterwegs mitgelesen.`,
      },
    ],
    legendeSchema: 'Was der Browser behält — und was ihn nicht verlässt.',
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
    titre: 'Die Fahrzeiten bleiben auch ohne Netz lesbar.',
    chapeau:
      `Die Seite lässt sich wie eine App installieren und behält alles Nötige auf dem Gerät. ` +
      `An der Haltestelle, mit einem Balken Empfang, steht die Uhrzeit schon da: sie musste ` +
      `nicht geladen werden.`,
    points: [
      'Installiert sich aus dem Browser, ohne App-Store',
      'Öffnet, ohne auf das Netz zu warten',
      'Schriften, Fahrpläne und Adressen sind bereits da',
      'Aktualisiert sich von selbst, sobald das Netz zurück ist',
      'Nur die Karte des Fußwegs braucht noch das Netz',
    ],
    action: 'So wird sie installiert',
    legendeSignal: 'Ohne Netz',
  },

  limites: {
    etiquette: 'Ehrlichkeit',
    titre: 'Was diese Seite nicht weiß.',
    chapeau: `Das kann diese Seite nicht — und das macht sie nur näherungsweise.`,
    // Sechs Einträge, nicht fünf: siehe die Begründung in `fr.ts`.
    items: [
      {
        titre: 'Die Gehzeiten sind geschätzt',
        texte:
          `Sie werden in Luftlinie berechnet, um ein Drittel für Umwege erhöht, mit 4,5 km/h. ` +
          `Das ist keine Wegbeschreibung: eine Steigung, ein Bahnübergang oder ein ` +
          `sechsjähriges Kind verändern das Ergebnis.`,
      },
      {
        titre: 'Die Fahrzeiten sind eine Abschrift',
        texte:
          `Sie sind dem Dokument der Gemeinde entnommen, sorgfältig und ohne Gewähr. Die ` +
          `Gemeinde kann es ohne Vorankündigung ändern. Bei Abweichungen gilt das offizielle ` +
          `Dokument.`,
      },
      {
        titre: 'Der Plan gilt für zwei Jahre — auf eine mündliche Zusage hin',
        texte:
          `Die Gemeinde hat im August 2026 telefonisch bestätigt, dass sich die Zeiten für ` +
          `${CHIFFRES.anneesCouvertes[1]} nicht ändern. Eine mündliche Zusage ist kein Dokument: ` +
          `Sie bleibt zu jedem Schuljahresbeginn zu prüfen, und die Seite sagt das dort, wo sie ` +
          `das Jahr anzeigt.`,
      },
      {
        titre: 'Eine Mitteilung ist keine Garantie',
        texte:
          `Ein ausgeschaltetes Telefon, ein „Nicht stören“, ein gestörter Mitteilungsdienst — ` +
          `und sie kommt nicht an. Schule und Gemeinde bleiben der offizielle Informationsweg; ` +
          `die App ersetzt ihn nicht.`,
      },
      {
        titre: 'Die Adresssuche endet an der Gemeindegrenze',
        texte:
          `Sie kennt nur die ${CHIFFRES.rues} Straßen von Beckerich. Wohnt man anderswo — bei ` +
          `den Großeltern, im Nachbarort — muss man die Haltestelle selbst angeben, und die ` +
          `Gehzeit bleibt unbekannt.`,
      },
      {
        titre: 'Zwei Dinge verlassen das Gerät doch',
        texte:
          `Die App zählt ihre Seitenaufrufe, und wer Benachrichtigungen einschaltet, hinterlegt ` +
          `für die Dauer des Abonnements eine anonyme Gerätekennung auf einem Server. Nichts von ` +
          `dem, was Sie eingeben, geht mit.`,
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
    titre: 'Sechzehn Minuten, bis Sie losmüssen.',
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
      projet: [
        { texte: 'Dank und Mitwirkende', url: URL_CREDITS },
      ],
    },
    mention: 'Von einem Elternteil, in Beckerich.',
    source: `Daten: offizieller Plan der Gemeinde, Schuljahre ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: "Impressum",
    lienContact: 'Kontakt',
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
    donneesCorps: `Diese Seite setzt keine Cookies, misst keine Zugriffe und ruft keinen Dienst Dritter auf. Von der Seite selbst werden keine personenbezogenen Daten erhoben; es gibt daher nichts einzusehen, zu berichtigen oder zu löschen.
Wenn Sie hingegen an ${ADRESSE_CONTACT} schreiben, landen Ihre Nachricht und die Adresse, von der sie kommt, in einem gewöhnlichen Postfach. Sie dienen dort ausschließlich der Antwort, werden an niemanden weitergegeben und nach Abschluss des Austauschs gelöscht.
Die Anwendung selbst behält, was Sie dort eingeben, ausschließlich auf Ihrem Gerät — ihre Seite „Grenzen" führt das aus.`,
    responsabiliteTitre: `Haftung`,
    responsabiliteCorps: `Die angezeigten Zeiten stammen aus dem offiziellen Plan der Gemeinde und sind sorgfältig übertragen, jedoch ohne Gewähr. Im Zweifel oder bei Abweichungen gilt das offizielle Dokument der Gemeinde.`,
    retour: `Zurück zur Startseite`,
  },

  contact: {
    titre: 'Schreiben',
    intro:
      `Die Anwendung ist noch in Entwicklung. Wenn Sie Interesse haben oder wissen möchten, ` +
      `was sie können wird: hier entlang. Das Formular verschickt selbst nichts — es ` +
      `bereitet die E-Mail in Ihrem Programm vor, abgeschickt wird sie von Ihnen.`,
    note:
      `Von dieser Seite geht nichts ab. Die Schaltfläche öffnet Ihr E-Mail-Programm mit einer ` +
      `fertig geschriebenen Nachricht; Sie lesen sie noch einmal und entscheiden. Was Sie ` +
      `abschicken, erreicht ${NOM_EDITEUR}, dient der Antwort, wird an niemanden ` +
      `weitergegeben und nach Abschluss des Austauschs gelöscht.`,
    categorieLegende: 'Worum geht es?',
    categories: [
      { cle: 'interet', texte: 'Die Anwendung interessiert mich' },
      { cle: 'question', texte: 'Eine Frage zum Projekt' },
      { cle: 'horaire', texte: 'Eine Frage zu den Fahrzeiten selbst' },
      { cle: 'autre', texte: 'Etwas anderes' },
    ],
    renvoiCommune:
      `Diese Seite ist nicht die der Gemeinde, und die Anwendung ist noch nicht offen: hier ` +
      `gibt es vorerst also keine Zeiten nachzusehen. Für die heute geltenden Zeiten ist der ` +
      `offizielle Plan der Gemeinde maßgeblich.`,
    nomEtiquette: 'Ihr Name',
    courrielEtiquette: 'Ihre E-Mail-Adresse',
    courrielAide: 'Sie dient der Antwort, sonst nichts.',
    messageEtiquette: 'Ihre Nachricht',
    messageAide: 'Schreiben Sie, woher Sie kommen und was Sie wissen möchten — dann wird die Antwort brauchbarer.',
    compteur: 'Noch {n} Zeichen',
    envoyer: 'E-Mail vorbereiten',
    sujetPrefixe: '[schoulbus.lu]',
    ouvertTitre: 'Ihr E-Mail-Programm sollte sich geöffnet haben',
    ouvertTexte:
      `Die Nachricht steht dort bereits; abzuschicken ist sie noch. Ist nichts passiert, ist ` +
      `auf diesem Gerät kein E-Mail-Programm hinterlegt — die Adresse unten lässt sich von ` +
      `Hand übernehmen.`,
    directTitre: 'Direkt schreiben',
    directTexte: 'Ohne den Umweg über das Formular:',
    erreurResume: 'Die E-Mail wurde nicht vorbereitet: mindestens ein Feld braucht noch etwas.',
    erreurs: {
      requis: 'Dieses Feld wird gebraucht.',
      courrielInvalide: 'Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.',
      tropCourt: 'Ein paar Worte mehr würden helfen.',
      tropLong: 'Das ist zu lang für eine so vorbereitete E-Mail.',
    },
    retour: 'Zurück zur Startseite',
    brefTitre: 'Eine Frage zur Anwendung?',
    brefTexte:
      `Sie ist noch in Entwicklung. Wer mehr wissen möchte, oder einfach sagen will, dass ` +
      `sie ihn interessiert: dafür gibt es eine Adresse.`,
    brefAction: 'Schreiben',
  },

}
