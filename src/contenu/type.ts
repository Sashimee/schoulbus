/*
 * La forme du contenu, écrite une fois.
 *
 * Le type n'est pas de la décoration : il fait échouer la compilation quand une des
 * trois langues perd un paragraphe. L'application se protège autrement — un dictionnaire
 * plat, avec repli sur le français —, mais elle a cinq langues et deux mille clés. La
 * vitrine en a trois et une centaine : le type est plus sûr, et il se lit.
 *
 * Une règle de rédaction traverse tout le fichier : la vitrine ne promet rien que
 * l'application ne tienne. Pas de « toujours à l'heure », pas de « suivi en temps réel ».
 * Le site affiche un plan officiel personnalisé, il ne sait pas où est le bus.
 */

export type Langue = 'fr' | 'de' | 'lb'

export type Temps = {
  titre: string
  texte: string
}

export type Tuile = {
  titre: string
  texte: string
  /** Icône du jeu de `composants/Icones.tsx`. */
  icone: string
  /*
   * Pas de largeur ici. La composition de la grille est posée par rang dans
   * `sections.css` : la largeur d'une tuile décrit la mise en page, pas la fonction, et
   * un rang recopié dans les trois langues finirait par diverger dans l'une d'elles.
   */
}

export type Contenu = {
  langue: Langue
  /** Attribut `lang` du document, et `og:locale`. */
  codeLangue: string
  meta: {
    titre: string
    description: string
  }
  general: {
    marque: string
    sautContenu: string
    ouvrirApp: string
    fermer: string
    theme: string
    themeClair: string
    themeSombre: string
    choixLangue: string
  }
  heros: {
    etiquette: string
    /** Découpé en lignes ; chaque mot est révélé séparément. */
    titre: string[]
    chapeau: string
    heure: string
    legendeTitre: string
    legendeDetail: string
    actionPrincipale: string
    actionSecondaire: string
    invite: string
  }
  chiffres: {
    arrets: string
    villages: string
    langues: string
    envoi: string
    envoiValeur: string
  }
  recit: {
    etiquette: string
    titre: string
    chapeau: string
    temps: [Temps, Temps, Temps, Temps]
  }
  fonctions: {
    etiquette: string
    titre: string
    chapeau: string
    tuiles: Tuile[]
  }
  confidentialite: {
    etiquette: string
    titre: string
    chapeau: string
    points: { titre: string; texte: string }[]
    legendeSchema: string
  }
  langues: {
    etiquette: string
    titre: string
    chapeau: string
    /** Le titre de l'application dans chacune des cinq langues qu'elle parle. */
    mots: { code: string; texte: string }[]
  }
  horsligne: {
    etiquette: string
    titre: string
    chapeau: string
    points: string[]
    action: string
    legendeSignal: string
  }
  limites: {
    etiquette: string
    titre: string
    chapeau: string
    items: { titre: string; texte: string }[]
    lien: string
  }
  independance: {
    titre: string
    texte: string
    lien: string
  }
  final: {
    surtitre: string
    heure: string
    titre: string
    chapeau: string
    action: string
    qr: string
  }
  pied: {
    description: string
    titreSite: string
    titreProjet: string
    liens: { site: { texte: string; url: string }[]; projet: { texte: string; url: string }[] }
    mention: string
    source: string
  }
}
