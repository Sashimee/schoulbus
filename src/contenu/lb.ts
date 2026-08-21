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
  ADRESSE_EDITEUR,
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
    etiquette: `Onofhängeg Säit · ${CHIFFRES.anneesCouvertes.join(' · ')}`,
    // 23 an 13 Zeechen: ënner der Grenz vun 24 fir d'Deele-Virschaubild.
    titre: ['Wat Dir um 07:25 gesitt', 'en Dënschdeg.'],
    altCapture: `Startbildschierm vun der App: d’Kaart vun der Léa, Bus um 07:45 um Kneppchen.`,
    lignes: [
      { valeur: '07:45', texte: 'd’Zäit vun hirem Bus, op hirer Haltestell' },
      {
        valeur: '16 Min.',
        texte: 'bis Dir lassmusst, déi 4 Minutte Fousswee scho ofgezunn',
        compte: true,
      },
      { valeur: 'Kneppchen', texte: 'déi nooste Haltestell bei Ärer Adress' },
      { valeur: 'Léa · Noah', texte: 'eng Kaart pro Kand, an der Reiefolleg vun den Offaarten' },
    ],
    actionPrincipale: 'App opmaachen',
    actionSecondaire: 'Wat d’Säit net ka',
    legende: 'Richteg Opnam · 22. September 2026, 07:25 Auer',
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

  ecrans: {
    titre: 'Véier Bildschiermer, an dat ass dat ganzt Produit.',
    note: `Richteg Opname vun der Applikatioun, Dënschdeg den 22. September 2026 um 07:25.`,
    cartes: [
      { titre: 'De Bildschierm vum Moien', texte: 'Eng Zäit pro Kand, a soss näischt.' },
      { titre: 'D’Wochenopstellung', texte: 'Fënnef Deeg, an d’Kaart vum Fousswee.' },
      {
        titre: 'Den offizielle Plang, iwwerdroen',
        texte: `${CHIFFRES.lignes} Linnen, ${CHIFFRES.arrets} Haltestellen, Tabell fir Tabell.`,
      },
      {
        titre: 'Siwe Froen, ee Mol',
        texte: 'D’Adress bestëmmt d’Haltestell, den Zyklus d’Schoul.',
      },
    ],
  },

  fonctions: {
    etiquette: 'Wat dran ass',
    titre: 'Néng Äntwerten op néng Moiescher déi sech net gläichen.',
    tuiles: [
      {
        icone: 'semaine',
        titre: 'D’Wochenopstellung',
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
        texte: 'Déi ausgefallen Faart verschwënnt vum Bildschierm.',
      },
      {
        icone: 'imprimer',
        titre: 'D’Blat fir de Frigo',
        texte: 'Eng A4-Säit, a Schwaarzwäiss.',
      },
      {
        icone: 'partage',
        titre: 'Deelen, QR an Iwwerhuelen',
        texte: 'D’Grousselteren gesinn dee selwechte Bildschierm.',
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
        titre: 'D’Maison relais',
        texte: 'Méindes bruecht, donneschdes ofgeholl.',
      },
    ],
  },

  principes: {
    donnees: {
      etiquette: 'De éischte Prinzip',
      titre: 'Keng Donnéeë vun Ärer Famill verloossen den Apparat.',
      texte:
        `Kee Kont, kee Passwuert. Déi ${CHIFFRES.rues} Stroosse vun der Gemeng stiechen an der ` +
        `Säit selwer: Är anzetippen freet kee Kaartendéngscht.`,
    },
    horsLigne: {
      etiquette: 'Op der Haltestell',
      titre: 'D’Zäit steet scho do, ouni Netz.',
      points: [
        { texte: 'Installéiert sech aus dem Browser, ouni App-Store' },
        { texte: 'Schrëften, Zäiten an Adresse sinn scho do' },
        { texte: 'Nëmmen d’Kaart vum Fousswee brauch nach d’Netz', ton: 'nuance' },
      ],
    },
  },

  limites: {
    titre: 'Wat dës Säit net ka.',
    note: `sechs Grenzen, ier mir Iech froen se opzemaachen`,
    items: [
      {
        titre: 'D’Fousswee sinn geschat',
        texte: `Loftlinn, ëm en Drëttel erhéicht, mat 4,5 km/h. Dat ass keng Route.`,
      },
      {
        titre: 'D’Zäite sinn eng Iwwerdroung',
        texte: `Bei Ofwäichunge gëllt dat offiziellt Dokument vun der Gemeng.`,
      },
      {
        titre: 'De Plang baséiert op enger mëndlecher Zouso',
        texte: `D’Gemeng huet am August 2026 telefonesch bestätegt, fir ${CHIFFRES.anneesCouvertes[1]}.`,
      },
      {
        titre: 'Eng Notifikatioun ass keng Garantie',
        texte: `D’Schoul an d’Gemeng bleiwen den offiziellen Informatiounswee.`,
      },
      {
        titre: 'D’Adresssich hält bei der Gemengegrenz op',
        texte: `Anzwousch anescht muss een d’Haltestell selwer uginn, ouni Fousswee.`,
      },
      {
        titre: 'Zwou Saache ginn awer eraus',
        texte:
          `D’Säitenopruff, an eng anonym Apparat-Kennung, wann Dir d’Notifikatiounen ` +
          `aschalt.`,
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
    retour: `Zréck op d'Startsäit`,
  },

  final: {
    // Déiselwecht Zuele wéi op der Bildschirmopnam am Kapp vun der Säit.
    surtitre: 'Et ass 07:25 Auer.',
    heure: '07:45',
    legendeHeure: 'Offaart · Kneppchen',
    titreAvant: 'Et bleiwen ',
    titreAccent: 'sechzéng Minutten',
    titreApres: ', bis Dir lassmusst.',
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
      projet: [{ texte: 'Merci a Mataarbechter', url: URL_CREDITS }],
    },
    mention: 'Vun engem Elterendeel, zu Biekerech.',
    source: `Donnéeën: offizielle Plang vun der Gemeng, ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: 'Impressum',
    viePrivee: 'Dës Säit setzt keng Cookien, mëscht keng Miessung, a rifft kee Server un.',
  },

  mentions: {
    titre: `Impressum`,
    intro: `Dës Säit seet, wien dëst Ugebot verëffentlecht. Um Rescht ännert si näischt: D'Säit bleift onofhängeg, a maassgeevend ass dat offiziellt Dokument vun der Gemeng.`,
    editeurTitre: `Erausginn vun`,
    editeurCorps: `Dës Säit gëtt vum ${NOM_EDITEUR} privat an net kommerziell erausginn. Si ass weder a Optrag ginn, nach vun der Gemengeverwaltung Biekerech, vun der Grondschoul oder vun der Maison Relais gepréift oder guttgeheescht.
Adress: ${ADRESSE_EDITEUR}`,
    hebergeurTitre: `Hosting`,
    hebergeurCorps: `D'Säit besteet aus statesche Fichieren, déi vun engem Server ausgeliwwert ginn, deen den Erausginner lount. Do gi keng Besuchsdonnéeën opbewahrt.`,
    donneesTitre: `Perséinlech Donnéeën`,
    donneesCorps: `Dës Säit setzt keng Cookien, mëscht keng Zougrëffsmiessung a rifft kee frieme Service un. Et gi keng perséinlech Donnéeë gesammelt; et gëtt also näischt anzegesinn, ze verbesseren oder ze läschen. D'Applikatioun selwer behält dat, wat Dir do aginn, nëmmen op Ärem Apparat — hir Säit „Grenzen" beschreift dat.`,
    responsabiliteTitre: `Haftung`,
    responsabiliteCorps: `D'ugewisen Zäite kommen aus dem offizielle Plang vun der Gemeng a sinn suergfälteg iwwerdroen, awer ouni Garantie. Am Zweifel oder bei Ofwäichunge gëllt dat offiziellt Dokument vun der Gemeng.`,
    retour: `Zréck op d'Startsäit`,
  },
}
