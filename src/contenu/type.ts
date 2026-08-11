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
    /*
     * Ce qui s'affiche à la place des appels à l'action tant que `APP_PUBLIEE` vaut
     * `false`. Court : c'est une étiquette, pas une phrase.
     */
    bientot: string
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
    /** Le zéro est cadré : il porte sur ce que la famille saisit, pas sur tout trafic. */
    envoi: string
    envoiValeur: string
    /**
     * Ce qui sort quand même, sous la bande de chiffres.
     *
     * Un « 0 » affiché en grand se relit vite comme « rien ne sort », et ce serait faux :
     * l'application compte ses pages vues, et une notification suppose un identifiant
     * d'appareil déposé sur un serveur le temps de l'abonnement. La note n'est pas une
     * précaution juridique, c'est ce qui rend le chiffre vrai.
     */
    envoiNote: string
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
    /*
     * La section finale sans appel à l'action. Elle doit dire pourquoi il n'y a rien à
     * ouvrir — une page qui se termine sur un silence laisse croire qu'elle est cassée.
     */
    bientot: string
  }
  pied: {
    description: string
    titreSite: string
    titreProjet: string
    liens: { site: { texte: string; url: string }[]; projet: { texte: string; url: string }[] }
    mention: string
    source: string
    /*
     * Ce que la vitrine ne fait pas. La section « Confidentialité » le dit déjà de
     * l'APPLICATION ; cette ligne-ci parle de la PAGE qu'on est en train de lire, et
     * c'est une autre promesse — une page de présentation qui vante l'absence de
     * traqueurs tout en en portant serait le mensonge le plus banal du web.
     */
    viePrivee: string
    /** Le lien vers la page des mentions légales, dans la colonne « Le projet ». */
    lienMentions: string
  }

  /*
   * Les mentions légales. Une page à part, et non une section de plus : la page d'accueil
   * a un ordre choisi, qui va des faits à la demande d'ouvrir l'application, et une
   * obligation administrative n'a pas sa place au milieu.
   */
  mentions: {
    titre: string
    /** Ce que cette page est, et ce qu'elle ne change pas. */
    intro: string
    editeurTitre: string
    /** Qui publie. `ADRESSE_EDITEUR` s'y insère. */
    editeurCorps: string
    hebergeurTitre: string
    hebergeurCorps: string
    donneesTitre: string
    donneesCorps: string
    responsabiliteTitre: string
    responsabiliteCorps: string
    retour: string
  }
}
