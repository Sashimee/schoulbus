/*
 * Luxembourgeois. Traduit depuis `fr.ts`.
 *
 * RÉSERVE OUVERTE, ET ELLE S'EST AGGRAVÉE AVEC LA REFONTE : cette traduction est une
 * première rédaction, non relue par une personne dont c'est la langue maternelle. Le
 * luxembourgeois est la langue du foyer dans une bonne part de la commune ; une tournure
 * fausse s'y remarque immédiatement et décrédibilise le reste de la page.
 *
 * La refonte a RÉÉCRIT presque chaque chaîne de ce fichier — les tuiles et les limites
 * sont passées d'un paragraphe à une ligne. Une phrase courte pardonne moins qu'une
 * longue : il n'y a plus de contexte autour pour rattraper un mot mal choisi. La relecture
 * par un locuteur natif était souhaitable ; elle est maintenant nécessaire.
 *
 * Les noms officiels suivent la graphie de la commune : Biekerech, Huttange, Dillendapp.
 */
import type { Contenu } from './type.ts'
import {
  HEBERGEUR,
  NOM_EDITEUR,
  URL_APP,
  URL_CREDITS,
  URL_INDEPENDANCE,
  URL_LIMITES,
} from '../config.ts'
import { CHIFFRES } from './chiffres.ts'

export const lb: Contenu = {
  langue: 'lb',
  codeLangue: 'lb',

  meta: {
    titre: 'Schoulbus Biekerech — d’Zäite vun Äre Kanner, ouni nozedenken',
    description:
      `De Schoulbusplang vun der Gemeng Biekerech, fir all Kand perséinlech opbereet: seng ` +
      `Statioun, seng Zäit, seng Schoul. Offline, ouni Kont. ` +
      `Onofhängeg Säit, ouni Verbindung mat der Gemeng oder der Schoul.`,
    sansScript:
      `Dës Säit léisst sech ouni JavaScript liesen. Nëmmen d’Animatiounen an de ` +
      `Sproochwiessel brauchen et.`,
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
    etiquette: `Onofhängeg Säit · ${CHIFFRES.anneesCouvertes.join(' · ')}`,
    // 24 an 13 Zeechen: op der Grenz vun 24 fir d'Deele-Virschaubild.
    titre: ['Wat Dir um 07:25 gesitt,', 'en Dënschdeg.'],
    altCapture: `Startbildschierm vun der App: d’Kaart vun der Léa, Bus um 07:45 um Kneppchen.`,
    lignes: [
      { valeur: '07:45', texte: 'd’Zäit vun hirem Bus, op hirer Statioun' },
      {
        valeur: '16 Min.',
        texte: 'bis Dir lassmusst, déi 4 Minutten zu Fouss scho ofgezunn',
        compte: true,
      },
      { valeur: 'Kneppchen', texte: 'déi nooste Statioun bei Ärer Adress' },
      { valeur: 'Léa · Noah', texte: 'eng Kaart pro Kand, an der Reiefolleg vun den Offaarten' },
    ],
    actionPrincipale: 'App opmaachen',
    actionSecondaire: 'Wat d’Säit net kann',
    legende: 'Richteg Opnam · 15. September 2026, 07:25 Auer',
  },

  chiffres: {
    arrets: 'bedéngte Statiounen',
    villages: 'Dierfer an der Gemeng',
    langues: 'Sproochen, och Lëtzebuergesch',
    envoi: 'Familljendonnéeën, déi ouni Är Ufro den Apparat verloossen',
    envoiValeur: '0',
    envoiNote:
      `Dräi Saache ginn awer eraus: d’Applikatioun zielt hir Säitenopruffer, wien ` +
      `d’Notifikatiounen aschalt, hannerleet eng anonym Apparat-Kennung op engem Server, sou ` +
      `laang wéi den Abonnement leeft, a wien d’Weeër an de Google Kalenner schreift, schéckt ` +
      `de Virnumm vum Kand an den Numm vu senger Statioun bei Google. Weder Är Adress, nach ` +
      `d’Cyclen.`,
  },

  ecrans: {
    titre: 'Véier Bildschiermer, an dat ass de ganze Produit.',
    note: `Richteg Opname vun der Applikatioun, Dënschdeg de 15. September 2026 um 07:25.`,
    cartes: [
      { titre: 'De Bildschierm vum Moien', texte: 'Eng Zäit pro Kand, a soss näischt.' },
      { titre: 'D’Woch', texte: 'Fënnef Deeg, an d’Kaart vum Wee zu Fouss.' },
      {
        titre: 'Den offizielle Plang, iwwerdroen',
        texte: `${CHIFFRES.lignes} Linnen, ${CHIFFRES.arrets} Statiounen, Tabell fir Tabell.`,
      },
      {
        titre: 'Sechs Froen, ee Mol',
        texte: 'D’Adress bestëmmt d’Statioun, de Cycle d’Schoul.',
      },
    ],
  },

  fonctions: {
    etiquette: 'Wat dran ass',
    titre: 'Néng Äntwerten op néng Moienter, déi sech net gläichen.',
    tuiles: [
      {
        icone: 'semaine',
        titre: 'D’Woch',
        texte: 'Déi fënnef Deeg vun engem Kand op engem Bildschierm.',
      },
      {
        icone: 'plan',
        titre: 'Den offizielle Plang, iwwerdroen',
        texte: 'Mam PDF vun der Gemeng dernieft.',
      },
      {
        icone: 'agenda',
        titre: 'An Äre Kalenner',
        texte: 'Eng .ics pro Kand, Vakanze scho ofgezunn.',
      },
      {
        icone: 'alerte',
        ton: 'alerte',
        titre: 'D’Stéierungen',
        texte: 'D’Faart, déi ausfält, verschwënnt vum Bildschierm.',
      },
      {
        icone: 'imprimer',
        titre: 'D’Blat fir de Frigo',
        texte: 'Eng A4-Säit, a Schwaarzwäiss.',
      },
      {
        icone: 'partage',
        titre: 'Deelen, QR an Iwwerhuelen',
        texte: 'D’Grousseltere gesinn dee selwechte Bildschierm.',
      },
      {
        icone: 'repas',
        titre: 'Mëttes doheem, oder net',
        texte: 'D’Iesse gëtt Dag fir Dag agestallt.',
      },
      {
        icone: 'adresse',
        titre: 'Dënschdes bei d’Bomi',
        texte: 'Eng aner Adress fir een eenzegen Dag.',
      },
      {
        icone: 'horloge',
        titre: 'D’Maison Relais',
        texte: 'Méindes bruecht, donneschdes ofgeholl.',
      },
    ],
  },

  principes: {
    donnees: {
      etiquette: 'Den éischte Prinzip',
      titre: 'Keng Donnéeë vun Ärer Famill verloossen den Apparat.',
      texte:
        `Kee Kont, kee Passwuert. Déi ${CHIFFRES.rues} Stroosse vun der Gemeng stiechen an der ` +
        `Säit selwer: Är anzetippe freet kee Kaartendéngscht.`,
    },
    horsLigne: {
      etiquette: 'Op der Statioun',
      titre: 'D’Zäit steet scho do, ouni Netz.',
      points: [
        { texte: 'Installéiert sech aus dem Browser, ouni App-Store' },
        { texte: 'Schrëften, Zäiten an Adresse si scho do' },
        { texte: 'Nëmmen d’Kaart vum Wee zu Fouss brauch nach d’Netz', ton: 'nuance' },
      ],
    },
  },

  limites: {
    titre: 'Wat dës Säit net kann.',
    note: `sechs Grenzen, ier mir Iech froen, se opzemaachen`,
    items: [
      {
        titre: 'D’Zäiten zu Fouss si geschat',
        texte: `Loftlinn, ëm en Drëttel erhéicht, mat 4,5 km/h. Dat ass keng Route.`,
      },
      {
        titre: 'D’Zäite sinn eng Iwwerdroung',
        texte: `Bei Ofwäichunge gëllt dat offiziellt Dokument vun der Gemeng.`,
      },
      {
        titre: 'De Plang gëllt bis den 18. Dezember 2026',
        texte: `Den neie Campus, virgesi fir Januar 2027, ännert Zäiten a Weeër.`,
      },
      {
        titre: 'Eng Notifikatioun ass keng Garantie',
        texte: `D’Schoul an d’Gemeng bleiwen den offiziellen Informatiounswee.`,
      },
      {
        titre: 'D’Adresssich hält bei der Gemengegrenz op',
        texte: `Anzwousch anescht muss een den Arrêt selwer uginn, ouni Zäit zu Fouss.`,
      },
      {
        titre: 'Dräi Saache ginn awer eraus',
        texte:
          `D’Säitenopruffer, eng anonym Apparat-Kennung, wann Dir d’Notifikatiounen aschalt, ` +
          `an de Virnumm vum Kand, wann Dir d’Weeër an de Google Kalenner schreift.`,
      },
    ],
    lien: 'D’Säit „Grenzen“ liesen',
    lienSignaler: 'E Feeler mellen',
  },

  independance: {
    titre: 'Dës Säit ass onofhängeg.',
    texte:
      `Si gouf vun engem Elterendeel privat gemaach a steet a kenger Verbindung mat der ` +
      `Gemengeverwaltung Biekerech oder mat der Schoul. Si schwätzt nëmme fir sech selwer. Am ` +
      `Zweiwel oder bei Ofwäichunge gëllt dat offiziellt Dokument vun der Gemeng.`,
    lien: 'Den offizielle Plang op kanner.beckerich.lu kucken',
    retour: `Zréck op d’Startsäit`,
  },

  final: {
    // Déiselwecht Zuele wéi op der Bildschirmopnam am Kapp vun der Säit.
    surtitre: 'Et ass 07:25 Auer.',
    heure: '07:45',
    legendeHeure: 'Offaart · Kneppchen',
    titreAvant: 'Et bleiwe ',
    titreAccent: 'siechzéng Minutten',
    titreApres: ', bis Dir lassmusst.',
    // Keen Imperativ, sou laang wéi d'Applikatioun net erreechbar ass — Begrënnung an `fr.ts`.
    chapeau:
      `Sou wäert de Moien ausgesinn: eng Zäit, an d’Zäit, déi bleift bis ee lassmuss. Näischt ze ` +
      `sichen, näischt ze vergläichen, a kee Moien drun ze denken.`,
    action: 'App opmaachen',
    qr: 'Oder scannen, fir se um Telefon opzemaachen',
    bientot:
      `D’Applikatioun ass nach an der Entwécklung. Dës Säit beschreift, wat se mécht; si féiert ` +
      `nach net dohinner. Bis dohinner bleift den offizielle Plang vun der Gemeng d’Quell, déi ` +
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
      projet: [{ texte: 'Merci a Mataarbechter', url: URL_CREDITS }],
    },
    mention: 'Vun engem Elterendeel, zu Biekerech.',
    source: `Donnéeën: offizielle Plang vun der Gemeng, ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: 'Impressum',
    lienContact: 'Schreiwen',
    viePrivee:
      `Dës Säit setzt keng Cookien, mécht keng Miessung, a kontaktéiert kee Drëtten. Den ` +
      `eenzegen Envoi geet vum Kontaktformulaire aus, wann Dir en ausléist.`,
  },

  mentions: {
    titre: `Impressum`,
    intro: `Dës Säit seet, wien se verëffentlecht. Um Rescht ännert si näischt: D’Säit bleift onofhängeg, a gëllt dat offiziellt Dokument vun der Gemeng.`,
    editeurTitre: `Editeur`,
    editeurCorps: `Dës Säit gëtt vum ${NOM_EDITEUR} privat an net kommerziell erausginn. Si ass weder an Optrag ginn, nach vun der Gemengeverwaltung Biekerech, vun der Grondschoul oder vun der Maison Relais gepréift oder guttgeheescht.`,
    editeurAdresseEtiquette: `Adress`,
    editeurTelephoneEtiquette: `Telefon`,
    editeurCourrielEtiquette: `E-Mail`,
    hebergeurTitre: `Hosting`,
    hebergeurCorps: `D’Säit besteet aus statesche Fichieren, déi vun engem virtuelle private Server ausgeliwwert ginn, deen den Editeur bei ${HEBERGEUR} lount. Do gi keng Besuchsdonnéeë gespäichert.`,
    donneesTitre: `Perséinlech Donnéeën`,
    donneesCorps: `Dës Säit setzt keng Cookien, mécht keng Zougrëffsmiessung a kontaktéiert kee friemen Déngscht. Eng eenzeg Saach geet vun hei eraus, an Dir sidd et, dee se ausléist: de Formulaire vun der Kontaktsäit. En iwwerdréit de Sujet, d’Noriicht an d’Adress fir d’Äntwert, déi Dir gitt, op d’Adress vum Editeur hei uewen; dës Noriichte gi zwielef Méint gespäichert a duerno geläscht. Virun deem Termin kënnt Dir iwwer déiselwecht Adress froen, déi Är ze kucken, ze verbesseren oder ze läschen. D’Applikatioun selwer behält dat, wat Dir do aginn, nëmmen op Ärem Apparat — hir Säit „Grenzen“ beschreift dat.`,
    responsabiliteTitre: `Haftung`,
    responsabiliteCorps: `D’ugewisen Zäite kommen aus dem offizielle Plang vun der Gemeng a si suergfälteg iwwerdroen, awer ouni Garantie. Am Zweiwel oder bei Ofwäichunge gëllt dat offiziellt Dokument vun der Gemeng.`,
    retour: `Zréck op d’Startsäit`,
  },

  contact: {
    titre: `Schreiwen`,
    intro: `E Formulaire an eng Adress, fir eng Zäit ze mellen, déi net stëmmt, oder eppes, wat falsch ugewise gëtt. Dohannert steet en Elterendeel, kee Service.`,
    adresseTitre: `D’Adress`,
    adresseIntro: `Noriichte kommen hei un:`,
    adresseNote: `D’Adress steet am Kloertext: Ären E-Mail-Programm geet duer, a si bleift nëtzlech den Dag, wou de Formulaire hei uewen ausfält. Eng Äntwert ka e puer Deeg daueren.`,
    utileTitre: `Wat hëlleft`,
    utileCorps: `Eng Zäit, déi net stëmmt: d’Linn, d’Statioun, den Dag, d’Zäit, déi Dir erwaart hutt.
Eppes, wat falsch ugewise gëtt: den Apparat, de Browser, wat de Bildschierm weist.
Schreift an der Sprooch, déi Iech kënnt.`,
    limitesTitre: `Wat dës Adress net ka maachen`,
    limitesCorps: `Si féiert weder op d’Gemeng, nach op d’Schoul, nach op d’Maison Relais. Eng Absence, eng Umeldung, eng aner Statioun: dat gehéiert direkt bei hinnen.
Et gëllt dat offiziellt Dokument vun der Gemeng. Weist dës Säit eppes anescht, dann ass dës Säit falsch — a genau dat ass eng Meldung wäert.`,
    formulaireTitre: `Vun hei aus schreiwen`,
    formulaireNote: `De Formulaire schéckt dat, wat Dir schreift: de Sujet, d’Noriicht, an d’Adress fir d’Äntwert, wann Dir eng gitt. Méi geet net eraus — weder Ären Numm, nach wou Dir sidd, nach soss eppes, woumat een Iech vun engem Besuch op deen anere erëmerkennt. Är IP-Adress déngt eng Stonn laang dozou, Envoien a Serie ze verhënneren, an enger onliesbarer Form, déi net op Iech zeréckféiert, a näischt dovunner gëtt op eng Festplack geschriwwen. Noriichten, déi ukommen, gi zwielef Méint gespäichert a duerno geläscht.`,
    sujetEtiquette: `Ëm wat geet et?`,
    messageEtiquette: `Är Noriicht`,
    reponseEtiquette: `Är Adress, fir d’Äntwert`,
    reponseAide: `Fräiwëlleg. Ouni si kënnt d’Noriicht trotzdeem un — mä et gëtt kee Wee, Iech ze äntweren.`,
    leurreEtiquette: `Dëst Feld eidel loossen`,
    envoyer: `Schécken`,
    envoiEnCours: `Gëtt geschéckt…`,
    envoiReussi: `D’Noriicht ass ënnerwee. Merci — eng Äntwert ka e puer Deeg daueren.`,
    erreurVide: `De Sujet oder d’Noriicht feelt.`,
    erreurTropLong: `D’Noriicht ass ze laang. Haalt dat Wesentlecht: d’Linn, d’Statioun, den Dag, d’Zäit.`,
    erreurTropDeLiens: `Ze vill Linken. Beschreift léiwer, wat Dir gesitt.`,
    erreurTropVite: `Ze séier geschéckt, fir vun Hand geschriwwen ze sinn. Probéiert an e puer Sekonnen nach eng Kéier.`,
    erreurTropSouvent: `Ze vill Noriichte vun dëser Verbindung. Probéiert an enger Stonn nach eng Kéier, oder schreift un d’Adress hei ënnen.`,
    erreurEnvoi: `Den Envoi huet net geklappt. Schreift un d’Adress hei ënnen: déi funktionéiert ëmmer nach.`,
    retour: `Zréck op d’Startsäit`,
  },
}
