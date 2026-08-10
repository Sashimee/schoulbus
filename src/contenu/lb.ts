/*
 * Luxembourgeois. Traduit depuis `fr.ts`.
 *
 * RÉSERVE OUVERTE : cette traduction est une première rédaction, non relue par une
 * personne dont c'est la langue maternelle. Le luxembourgeois est la langue du foyer
 * dans une bonne part de la commune ; une tournure fausse s'y remarque immédiatement et
 * décrédibilise le reste de la page. À faire relire avant toute mise en ligne publique.
 *
 * Les noms officiels suivent la graphie de la commune : Biekerech, Huttange, Dillendapp.
 */
import type { Contenu } from './type.ts'
import { URL_APP, URL_CREDITS, URL_DEPOT, URL_INDEPENDANCE, URL_LIMITES } from '../config.ts'
import { CHIFFRES } from './chiffres.ts'

export const lb: Contenu = {
  langue: 'lb',
  codeLangue: 'lb',

  meta: {
    titre: 'Schoulbus Biekerech — d’Zäite vun Ären Kanner, ouni nozedenken',
    description:
      `De Schoulbusplang vun der Gemeng Biekerech, fir all Kand perséinlech opbereet: seng ` +
      `Haltestell, seng Zäit, seng Schoul. Offline, ouni Kont, ouni geschéckt Donnéeën. ` +
      `Onofhängeg Säit, ouni Verbindung mat der Gemeng oder der Schoul.`,
  },

  general: {
    marque: 'Schoulbus Biekerech',
    sautContenu: 'Op den Inhalt sprangen',
    ouvrirApp: 'App opmaachen',
    fermer: 'Zoumaachen',
    theme: 'Duerstellung',
    themeClair: 'Hell',
    themeSombre: 'Däischter',
    choixLangue: 'Sprooch',
  },

  heros: {
    etiquette: `Onofhängeg Säit · Schouljoer ${CHIFFRES.anneeScolaire}`,
    titre: ['D’Buszäite', 'vun Ären Kanner,', 'ouni nozedenken.'],
    chapeau:
      `Den offizielle Plang vun der Gemeng Biekerech, opbereet fir all eenzelt Kand. Seng ` +
      `nooste Haltestell, d’Zäit wou et fortfiert, an d’Zäit déi et zu Fouss dohinner brauch. ` +
      `Opmaachen, kucken, lassgoen.`,
    heure: '07:12',
    legendeTitre: 'Nächst Offaart',
    legendeDetail: 'Léa · Haltestell Huttange · 4 Min. zu Fouss',
    actionPrincipale: 'App opmaachen',
    actionSecondaire: 'Wat d’Säit net weess',
    invite: 'Erofscrollen',
  },

  chiffres: {
    arrets: 'Haltestellen',
    villages: 'Dierfer an der Gemeng',
    langues: 'Sproochen, och Lëtzebuergesch',
    envoi: 'Donnéeën un e Server geschéckt',
    envoiValeur: '0',
  },

  recit: {
    etiquette: 'Moies',
    titre: 'Aacht Minutten, an eng Kolonn ze fannen.',
    chapeau:
      `Den offizielle Plang stëmmt. Hien ass just laang, dicht, a fir déi ganz Gemeng op eemol ` +
      `geduecht — net fir ee bestëmmt Kand, en Dënschdeg, um siwen Auer.`,
    temps: [
      {
        titre: 'De Plang fëllt fënnef Säiten',
        texte:
          `Dräi Linnen hin, zwou zréck, eng Faart bei d’Kantinn, dozou Foussnoten fir d’Deeg wou ` +
          `d’Reegel wiesselt. Alles steet dran. Ee muss just all Moie erëm déi richteg Kolonn fir ` +
          `dat richtegt Duerf an de richtege Cycle fannen.`,
      },
      {
        titre: 'Dir fëllt en eng eenzeg Kéier aus',
        texte:
          `Wunnadress, Virnumm vum Kand, säi Cycle. D’Säit leet doraus seng Schoul, seng Linn an ` +
          `seng nooste Haltestell of, a schätzt de Fousswee dohinner. Dat dauert fënnef Minutten ` +
          `— an et widderhëlt sech net.`,
      },
      {
        titre: 'Duerno bleift nëmmen nach eng Zäit',
        texte:
          `Den Ufanksbildschierm weist näischt ausser der nächster Offaart, ganz grouss. Wann et ` +
          `Zäit gëtt fortzegoen, fänkt e Punkt niewent der Zäit u me schloen. Näischt ze sichen, ` +
          `näischt opzeklappen, näischt ze vergläichen.`,
      },
      {
        titre: 'De Rescht kënnt vun eleng',
        texte:
          `De Wochenzettel fir d’Schoultäsch, de ganze Plang fir nozekucken, den Export an de ` +
          `Kalenner vum Telefon, dat A4-Blat fir op de Frigo. Alles op senger Plaz — a näischt ` +
          `drängt sech op de Moiesbildschierm.`,
      },
    ],
  },

  fonctions: {
    etiquette: 'Wat dra stécht',
    titre: 'Alles wat e Busplang eleng net seet.',
    chapeau:
      `All Funktioun äntwert op eng Situatioun déi Elteren an der Gemeng wierklech erlieft hunn. ` +
      `Keng gouf derbäigesat well se sech op enger Lëscht gutt mécht.`,
    tuiles: [
      {
        icone: 'semaine',
        titre: 'De Wochenzettel',
        texte:
          `Déi fënnef Deeg vun engem Kand op engem Bildschierm: Offaartszäit, Haltestell, ` +
          `Schoul, Réckfaart. Deeg ouni Bus si markéiert, net einfach eidel gelooss.`,
      },
      {
        icone: 'plan',
        titre: 'Den offizielle Plang, liesbar',
        texte:
          `Déi ${CHIFFRES.lignes} Linnen an ${CHIFFRES.arrets} Haltestellen op enger Kaart — an ` +
          `den PDF vun der Gemeng mat engem Grëff derniewent.`,
      },
      {
        icone: 'agenda',
        titre: 'An Äre Kalenner',
        texte:
          `Eng .ics-Datei fir all Kalenner, oder op Wonsch en direkten Androen a Google Kalenner. ` +
          `D’Schoulvakanze si scho berücksichtegt.`,
      },
      {
        icone: 'alerte',
        titre: 'Stéierungen',
        texte:
          `Kënnegt d’Gemeng en Ausfall oder eng Verspéidung un, steet se uewen um Bildschierm — ` +
          `an als Matdeelung um Telefon, wann Dir se erlaabt hutt.`,
      },
      {
        icone: 'imprimer',
        titre: 'D’Blat fir de Frigo',
        texte:
          `Eng A4-Säit pro Kand, oder all d’Geschwëster op engem Blat. A Schwaarzwäiss gedréckt, ` +
          `ouni Verlaf an ouni gro Hannergrond: gutt liesbar, an et eidelt keng Patroun.`,
      },
      {
        icone: 'partage',
        titre: 'Deelen a QR-Code',
        texte:
          `E Link fir d’Grousseltere oder d’Dagesmamm. Hie dréit d’Astellunge mat sech — ni ` +
          `iwwer e Server, kuckt weider ënnen.`,
      },
      {
        icone: 'repas',
        titre: 'Mëttes doheem, oder net',
        texte:
          `D’Mëttegiesse gëtt Dag fir Dag agestallt. An der Kantinn Dillendapp follegt d’Kand der ` +
          `Mëttesfaart, doheem der gewéinlecher Réckfaart. De Plang riicht sech dono.`,
      },
      {
        icone: 'adresse',
        titre: 'Dënschdes bei der Bomi',
        texte:
          `Eng aner Adress fir een eenzelen Dag — déi nooste Haltestell gëtt nëmme fir dësen Dag ` +
          `nei berechent.`,
      },
      {
        icone: 'horloge',
        titre: 'D’Betreiung',
        texte:
          `D’Zäite vun der Maison Relais kommen an de Zettel, fir datt déi ugewisen Zäit och ` +
          `wierklech déi ass op déi et un dësem Dag ukënnt.`,
      },
    ],
  },

  confidentialite: {
    etiquette: 'Den éischte Prinzip',
    titre: 'Keng Donnéeë vun Ärer Famill verloossen den Apparat.',
    chapeau:
      `Dat ass keng Absichtserklärung, mee eng Eegeschaft vum Code. Wunnadress, Virnimm a ` +
      `Cyclen leien am Späicher vun Ärem Browser, an d’Säit huet keng Plaz wou se se ` +
      `hischécke kéint.`,
    points: [
      {
        titre: 'Näischt ze schécken, näischt ze verléieren',
        texte:
          `Kee Kont, keng Umeldung, kee Passwuert. Wat Dir aginn, bleift am Browser vum Apparat ` +
          `op deem Dir et aginn hutt.`,
      },
      {
        titre: 'D’Adressiche leeft offline',
        texte:
          `Déi ${CHIFFRES.rues} Stroosse vun der Gemeng stiechen an der Säit selwer. Är Strooss ` +
          `anzetippe freet kee Kaartendéngscht: kee baussen erfiert wou Dir wunnt.`,
      },
      {
        titre: 'Gedeelt gëtt hannert dem Rautezeechen',
        texte:
          `E gedeelte Link leet d’Astellungen an de Fragmentdeel vun der Adress — den Deel no ` +
          `dem „#". Browser schécken en ni un de Server. De Link funktionéiert, a kee huet en ` +
          `ënnerwee matgelies.`,
      },
    ],
    legendeSchema: 'Wat de Browser behält — a wat erausgeet, nämlech näischt.',
  },

  langues: {
    etiquette: 'Fënnef Sproochen',
    titre: 'Och déi déi doheem geschwat gëtt.',
    chapeau:
      `D’App gëtt et op Franséisch, Däitsch, Lëtzebuergesch, Portugisesch an Englesch. ` +
      `Iwwersetzungskorrekture gi publizéiert ouni nei ze bauen — e Feeler dee moies gemellt ` +
      `gëtt, kann nomëttes fort sinn.`,
    mots: [
      { code: 'fr', texte: 'Bus scolaire Beckerich' },
      { code: 'de', texte: 'Schulbus Beckerich' },
      { code: 'lb', texte: 'Schoulbus Biekerech' },
      { code: 'pt', texte: 'Autocarro escolar Beckerich' },
      { code: 'en', texte: 'Beckerich school bus' },
    ],
  },

  horsligne: {
    etiquette: 'Op der Haltestell',
    titre: 'Funktionéiert do wou d’Netz et net mécht.',
    chapeau:
      `D’Säit léisst sech wéi eng App installéieren a behält alles Néidegt um Apparat. Op der ` +
      `Bushaltestell, am Reen, mat engem Balken Empfang steet d’Zäit scho do — si huet ni ` +
      `misse gelueden ginn.`,
    points: [
      'Installéiert sech aus dem Browser, ouni App-Store',
      'Mécht op an ënner enger Sekonn, mat oder ouni Netz',
      'Schrëften, Fuerpläng an Adresse sinn scho do',
      'Aktualiséiert sech vun eleng, soubal d’Netz zréck ass',
    ],
    action: 'Wéi se installéiert gëtt',
    legendeSignal: 'Ouni Netz',
  },

  limites: {
    etiquette: 'Éierlechkeet',
    titre: 'Wat dës Säit net weess.',
    chapeau:
      `Eng App déi hir Ongenauegkeete verschweigt, léisst Iech e Bus verpassen ouni Iech ze ` +
      `warnen. Dës weist hir — an zwar do wou se zielen.`,
    items: [
      {
        titre: 'D’Fousszäite si geschat',
        texte:
          `Si gi Loftlinn berechent, am Tempo vun engem Erwuessenen. Dat ass keng Wegbeschreiwung: ` +
          `en Iwwergank, eng Steigung oder e sechsjäregt Kand veränneren d’Resultat.`,
      },
      {
        titre: 'Munch Haltestelle leien ongeféier',
        texte:
          `Ass eng Haltestell an den ëffentlechen Donnéeën net benannt, hëlt d’Säit d’Mëtt vun ` +
          `der Strooss oder vum Duerf. Si seet dat derbäi, amplaz eng Genauegkeet virzetäuschen.`,
      },
      {
        titre: 'Den offizielle Plang huet gro Beräicher',
        texte:
          `E puer Reegele vum Dokument sinn zweedeiteg. Si ginn onverännert iwwerholl a markéiert ` +
          `— ni un Ärer Plaz entscheet.`,
      },
    ],
    lien: 'D’Säit „Grenzen" liesen',
  },

  independance: {
    titre: 'Dës Säit ass onofhängeg.',
    texte:
      `Si gouf vun engem Elterendeel privat gemaach a steet a kenger Verbindung mat der ` +
      `Gemengeverwaltung Biekerech oder mat der Schoul. Si schwätzt nëmme fir sech selwer. Am ` +
      `Zweiwel oder bei Ofwäichunge gëllt dat offiziellt Dokument vun der Gemeng.`,
    lien: 'Den offizielle Plang op kanner.beckerich.lu kucken',
  },

  final: {
    surtitre: 'Et ass 07:04 Auer.',
    heure: '07:12',
    titre: 'De Bus fiert an aacht Minutten.',
    chapeau:
      `Dir musst en net sichen. Eng Kéier opmaachen, eng Kéier ausfëllen — an d’Zäit steet all ` +
      `folgende Moien do.`,
    action: 'App opmaachen',
    qr: 'Oder scannen, fir se um Telefon opzemaachen',
  },

  pied: {
    description:
      `D’Schoulbuszäite vun der Gemeng Biekerech, fir all Kand perséinlech opbereet. ` +
      `Onofhängeg Säit, ouni Verbindung mat der Gemeng oder der Schoul.`,
    titreSite: 'D’Säit',
    titreProjet: 'De Projet',
    liens: {
      site: [
        { texte: 'App opmaachen', url: URL_APP },
        { texte: 'Grenze vun der Säit', url: URL_LIMITES },
        { texte: 'Onofhängegkeet', url: URL_INDEPENDANCE },
      ],
      projet: [
        { texte: 'Merci a Mataarbechter', url: URL_CREDITS },
        { texte: 'Quellcode', url: URL_DEPOT },
      ],
    },
    mention: 'Vun engem Elterendeel, zu Biekerech.',
    source: `Donnéeën: offizielle Plang vun der Gemeng, Schouljoer ${CHIFFRES.anneeScolaire}.`,
  },
}
