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

export const lb: Contenu = {
  langue: 'lb',
  codeLangue: 'lb',

  meta: {
    titre: 'Schoulbus Biekerech — d’Zäite vun Ären Kanner, ouni nozedenken',
    description:
      `De Schoulbusplang vun der Gemeng Biekerech, fir all Kand perséinlech opbereet: seng ` +
      `Haltestell, seng Zäit, seng Schoul. Offline, ouni Kont. ` +
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
    bientot: 'Geschwë verfügbar',
  },

  heros: {
    etiquette: `Onofhängeg Säit · Schouljoren ${CHIFFRES.anneesCouvertes.join(' an ')}`,
    titre: ['D’Buszäite', 'vun Ären Kanner,', 'ouni nozedenken.'],
    chapeau:
      `Den offizielle Plang vun der Gemeng Biekerech, Kand fir Kand opbereet: seng nooste ` +
      `Haltestell, d’Zäit vu sengem Bus, an d’Zäit déi et zu Fouss dohinner brauch. Méi weist ` +
      `den Ufankssbildschirm net.`,
    // 07:45 — déiselwecht Zäit wéi op der Bildschirmopnam nieft dem Text.
    heure: '07:45',
    legendeTitre: 'Nächst Offaart',
    legendeDetail: 'Léa · Hovelange · Kneppchen · 4 Min. zu Fouss',
    actionPrincipale: 'App opmaachen',
    actionSecondaire: 'Wat d’Säit net weess',
    invite: 'Erofscrollen',
  },

  chiffres: {
    arrets: 'Haltestellen',
    villages: 'Dierfer an der Gemeng',
    langues: 'Sproochen, och Lëtzebuergesch',
    envoi: 'Familljendonnéeën un e Server geschéckt',
    envoiValeur: '0',
    envoiNote:
      `Zwou Saache ginn awer trotzdem eraus: d'Applikatioun zielt hir Säitenopruff, a wien ` +
      `d'Notifikatiounen aschalt, hannerleet eng anonym Apparat-Kennung op engem Server, sou ` +
      `laang wéi den Abonnement leeft. Weder Är Adress, nach d'Virnimm, nach d'Zyklen.`,
  },

  recit: {
    etiquette: 'Moies',
    titre: 'Zwanzeg Minutten, an eng Kolonn ze fannen.',
    chapeau:
      `Den offizielle Plang stëmmt. Hien ass just laang, dicht, a fir déi ganz Gemeng op eemol ` +
      `geschriwwen — net fir ee bestëmmt Kand, en Dënschdeg, um siwen Auer.`,
    temps: [
      {
        titre: 'De Plang fëllt fënnef Säiten',
        texte:
          `Siwe Linnen, eelef Faarten, dozou Foussnote fir d’Deeg wou d’Reegel wiesselt. Alles ` +
          `steet dran: d’Säit iwwerdréit et Zeil fir Zeil, ouni eppes ze entscheeden. Bleift ` +
          `just, all Moie déi richteg Kolonn fir dat richtegt Duerf an de richtege Cycle ze ` +
          `fannen.`,
      },
      {
        titre: 'Dir fëllt en eng eenzeg Kéier aus',
        texte:
          `Siwe Froen, eng pro Bildschierm: d’Adress, de Virnumm, de Cycle, dann de Bus, de ` +
          `Mëtteg, d’Betreiung an d’Deeg déi aus der Rei falen. De Cycle bestëmmt d’Schoul, ` +
          `d’Adress d’Haltestell. Dat zweet Kand iwwerhëlt d’Astellunge vum eelere: ze änneren ` +
          `bleiwen e Virnumm an e Cycle.`,
      },
      {
        titre: 'Duerno bleift nëmmen nach eng Zäit',
        texte:
          `Den Ufanksbildschierm weist näischt ausser der nächster Offaart, ganz grouss. ` +
          `Niewendrun „an 16 Min.“: d’Zäit déi Iech bleift bis Dir LASSGOEN musst — de Fousswee ` +
          `bis bei d’Haltestell ass scho ofgezunn. Wann et sou wäit ass, fänkt e Punkt u ze ` +
          `blénken. Näischt ze sichen, näischt opzeklappen, näischt ze vergläichen.`,
      },
      {
        titre: 'De Rescht kënnt vun eleng',
        texte:
          `Déi ganz Woch vun engem Kand op engem Bildschierm, mat der Kaart vum Fousswee bis bei ` +
          `seng Haltestell; den offizielle Plang fir nozekucken; den Export an de Kalenner vum ` +
          `Telefon; dat A4-Blat fir op de Frigo. Näischt dovun belaascht de Moiesbildschierm.`,
      },
    ],
  },

  fonctions: {
    etiquette: 'Wat dra stécht',
    titre: 'Alles wat e Busplang eleng net seet.',
    chapeau: `All Funktioun äntwert op eng Situatioun déi Elteren an der Gemeng erliewen.`,
    tuiles: [
      {
        icone: 'semaine',
        titre: 'De Wochenzettel',
        texte:
          `Déi fënnef Deeg vun engem Kand op engem Bildschierm: Offaartszäit, Haltestell, ` +
          `Schoul, Réckfaart an eng Kaart vum Fousswee bis bei d’Haltestell. Munch Deeg bréngt ` +
          `Dir et selwer hin oder hëlt et of: sot et, an déi Faarte verschwannen, amplaz ëmsoss ` +
          `do ze stoen.`,
      },
      {
        icone: 'plan',
        titre: 'Den offizielle Plang, ofgeschriwwen',
        texte:
          `Déi ${CHIFFRES.lignes} Linnen an ${CHIFFRES.arrets} Haltestellen, Tabell fir Tabell ` +
          `iwwerdroen, mam PDF vun der Gemeng derniewent.`,
      },
      {
        icone: 'agenda',
        titre: 'An Äre Kalenner',
        texte:
          `Eng .ics-Datei pro Kand, oder eng eenzeg fir all d’Geschwëster. D’Schoulvakanze si ` +
          `scho erausgerechent.`,
      },
      {
        icone: 'alerte',
        titre: 'Stéierungen',
        texte:
          `Eng Vertriedung vun der Schoul oder der Gemeng mellt den Ausfall, andeems se op fënnef ` +
          `Froen äntwert. Déi ausgefall Faart verschwënnt vum Bildschierm, d’Verspéidung ` +
          `erschéngt duerchgestrach a korrigéiert. Eng Matdeelung ka warnen — garantéiere kann se ` +
          `näischt.`,
      },
      {
        icone: 'imprimer',
        titre: 'D’Blat fir de Frigo',
        texte:
          `Eng A4-Säit pro Kand, oder all d’Geschwëster op engem Blat. A Schwaarzwäiss, ouni ` +
          `Verlaf an ouni gro Hannergrond.`,
      },
      {
        icone: 'partage',
        titre: 'Deelen, QR-Code an Iwwerhuelen',
        texte:
          `E Link — oder e QR-Code — fir d’Grousseltere oder d’Dagesmamm: si gesinn dee selwechte ` +
          `Bildschierm wéi Dir. Dee selwechte Link hëlleft um iPhone, wou déi installéiert App ` +
          `net gesäit wat Dir a Safari aginn hutt.`,
      },
      {
        icone: 'repas',
        titre: 'Mëttes doheem, oder net',
        texte:
          `E Kand kann e Méindeg am Dillendapp iessen an en Dënschdeg heemfueren. D’Mëttegiesse ` +
          `gëtt Dag fir Dag agestallt, an d’Faarte riichte sech dono.`,
      },
      {
        icone: 'adresse',
        titre: 'Dënschdes bei der Bomi',
        texte:
          `Eng aner Adress fir een eenzelen Dag — a fir ee eenzege Moment vum Dag: moies, mëttes ` +
          `oder owes. Déi nooste Haltestell gëtt fir dësen Dag nei berechent.`,
      },
      {
        icone: 'horloge',
        titre: 'D’Betreiung',
        texte:
          `E Méindeg bréngt Dir et an den Dillendapp, en Donneschdeg hëlt Dir et of. Déi ` +
          `méiglech Zäite sinn duerch d’Ouverture vun der Maison Relais begrenzt an duerch de Bus ` +
          `vu sengem Cycle weider ageschränkt. Owes wou Dir net kënnt kommen, verweist de Zettel ` +
          `op de Bummelbus.`,
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
          `op deem Dir et aginn hutt — an e Knäppchen an den Astellunge läscht alles nees.`,
      },
      {
        titre: 'D’Adressiche leeft offline',
        texte:
          `Déi ${CHIFFRES.rues} Stroosse vun der Gemeng — ${CHIFFRES.adresses} Adressen — ` +
          `stiechen an der Säit selwer. Är Strooss ` +
          `anzetippe freet kee Kaartendéngscht: kee baussen erfiert wou Dir wunnt. Dofir kennt ` +
          `d’Sich awer och nëmmen dës eng Gemeng.`,
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
    titre: 'D’Zäite bleiwen och ouni Netz liesbar.',
    chapeau:
      `D’Säit léisst sech wéi eng App installéieren a behält alles Néidegt um Apparat. Op der ` +
      `Haltestell, mat engem Balken Empfang, steet d’Zäit scho do: si huet net misse gelueden ` +
      `ginn.`,
    points: [
      'Installéiert sech aus dem Browser, ouni App-Store',
      'Mécht op, ouni op d’Netz ze waarden',
      'Schrëften, Fuerpläng an Adresse sinn scho do',
      'Aktualiséiert sech vun eleng, soubal d’Netz zréck ass',
      'Nëmmen d’Kaart vum Fousswee brauch nach d’Netz',
    ],
    action: 'Wéi se installéiert gëtt',
    legendeSignal: 'Ouni Netz',
  },

  limites: {
    etiquette: 'Éierlechkeet',
    titre: 'Wat dës Säit net weess.',
    chapeau: `Dat hei kann dës Säit net — an dat hei mécht se nëmmen ongeféier.`,
    // Sechs Androen, net fënnef: d'Begrënnung steet an `fr.ts`.
    items: [
      {
        titre: 'D’Fousszäite si geschat',
        texte:
          `Si gi Loftlinn berechent, ëm en Drëttel erhéicht fir Ëmweeër, mat 4,5 km/h. Dat ass ` +
          `keng Wegbeschreiwung: eng Steigung, en Iwwergank oder e sechsjäregt Kand veränneren ` +
          `d’Resultat.`,
      },
      {
        titre: 'D’Zäite sinn eng Ofschrëft',
        texte:
          `Si sinn aus dem Dokument vun der Gemeng iwwerholl, mat Suergfalt an ouni Garantie. ` +
          `D’Gemeng kann et ouni Virwarnung änneren. Bei Ofwäichunge gëllt dat offiziellt Dokument.`,
      },
      {
        titre: 'De Plang gëllt fir zwee Joer, op eng mëndlech Zouso hin',
        texte:
          `D’Gemeng huet am August 2026 um Telefon confirméiert, datt d’Zäite fir ` +
          `${CHIFFRES.anneesCouvertes[1]} onverännert bleiwen. Eng mëndlech Zouso ass kee ` +
          `Dokument: si bleift bei all Rentrée nozekucken, an d’Säit seet dat do wou se d’Joer ` +
          `uweist.`,
      },
      {
        titre: 'Eng Notifikatioun ass keng Garantie',
        texte:
          `En ausgeschalten Telefon, e „Net stéieren“, en Notifikatiounsdéngscht deen ausfällt — ` +
          `a si kënnt net un. D’Schoul an d’Gemeng bleiwen den offiziellen Informatiounswee; ` +
          `d’App ersetzt en net.`,
      },
      {
        titre: 'D’Adressesich hält bei der Gemengegrenz op',
        texte:
          `Si kennt nëmmen déi ${CHIFFRES.rues} Stroosse vu Biekerech. Wunnt een anzwousch — bei ` +
          `de Grousselteren, am Nopeschduerf — muss een d’Haltestell selwer uginn, an d’Fousszäit ` +
          `bleift onbekannt.`,
      },
      {
        titre: 'Zwou Saache ginn awer aus dem Apparat eraus',
        texte:
          `D’App zielt hir Säitenopruff, a wien d’Notifikatiounen aschalt, hannerleet eng anonym ` +
          `Apparat-Kennung op engem Server, sou laang wéi den Abonnement leeft. Näischt vun deem ` +
          `wat Dir aginn hutt geet mat.`,
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
    // Déiselwecht Zuele wéi op der Bildschirmopnam am Kapp vun der Säit.
    surtitre: 'Et ass 07:25 Auer.',
    heure: '07:45',
    titre: 'Sechzéng Minutte bis Dir lassmusst.',
    // Keen Imperativ, sou laang wéi d'Applikatioun net erreechbar ass — Begrënnung an `fr.ts`.
    chapeau:
      `Sou wäert de Moie ausgesinn: eng Zäit, an d’Zäit déi bleift bis ee lassmuss. Näischt ze ` +
      `sichen, näischt ze vergläichen, u kee Moie drun ze denken.`,
    action: 'App opmaachen',
    qr: 'Oder scannen, fir se um Telefon opzemaachen',
    bientot:
      `D’Applikatioun ass nach an der Entwécklung. Dës Säit beschreift, wat se mécht; si féiert ` +
      `nach net dohinner. Bis dohinner bleift den offizielle Plang vun der Gemeng d’Quell déi ` +
      `ee liese soll.`,
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
    source: `Donnéeën: offizielle Plang vun der Gemeng, Schouljoren ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: "Impressum",
    viePrivee: 'Dës Säit setzt keng Cookien, mëscht keng Miessung, a rifft kee Server un.',
  },

  mentions: {
    titre: `Impressum`,
    intro: `Dës Säit seet, wien dëst Ugebot verëffentlecht. Um Rescht ännert si näischt: D'Säit bleift onofhängeg, a maassgeevend ass dat offiziellt Dokument vun der Gemeng.`,
    editeurTitre: `Erausginn vun`,
    editeurCorps: `Dës Säit gëtt vum ${NOM_EDITEUR} privat an net kommerziell erausginn. Si ass weder a Optrag ginn, nach vun der Gemengeverwaltung Biekerech, vun der Grondschoul oder vun der Maison Relais gepréift oder guttgeheescht.
Adress: ${ADRESSE_EDITEUR}
Kontakt: iwwer den Depot vum Code, deem seng Adress am Fouss vun der Säit steet.`,
    hebergeurTitre: `Hosting`,
    hebergeurCorps: `D'Säit besteet aus statesche Fichieren, déi vun engem Server ausgeliwwert ginn, deen den Erausginner lount. Do gi keng Besuchsdonnéeën opbewahrt.`,
    donneesTitre: `Perséinlech Donnéeën`,
    donneesCorps: `Dës Säit setzt keng Cookien, mëscht keng Zougrëffsmiessung a rifft kee frieme Service un. Et gi keng perséinlech Donnéeën gesammelt; et gëtt also näischt anzegesinn, ze verbesseren oder ze läschen. D'Applikatioun selwer behält dat, wat Dir do aginn, nëmmen op Ärem Apparat — hir Säit „Grenzen" beschreift dat.`,
    responsabiliteTitre: `Haftung`,
    responsabiliteCorps: `D'ugewisen Zäite kommen aus dem offizielle Plang vun der Gemeng a sinn suergfälteg iwwerdroen, awer ouni Garantie. Am Zweifel oder bei Ofwäichunge gëllt dat offiziellt Dokument vun der Gemeng.`,
    retour: `Zréck op d'Startsäit`,
  },

}
