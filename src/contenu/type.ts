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

/*
 * Les catégories du formulaire de contact.
 *
 * Elles disent CE POUR QUOI la page existe, et c'est pour cela qu'aucune ne propose de
 * signaler une erreur : l'application n'est pas encore ouverte (`APP_PUBLIEE`), personne
 * ne peut donc y avoir vu quoi que ce soit de faux. Une page qui appellerait des rapports
 * de panne sur un logiciel que nul n'a pu essayer serait la première du site à parler d'un
 * état qui n'existe pas. On y vient pour se renseigner, pas pour rapporter.
 *
 * Un type et non des chaînes libres : `horaire` déclenche le renvoi vers la commune, et
 * une faute de frappe dans l'une des trois langues aurait fait disparaître ce renvoi
 * là-bas seulement — c'est-à-dire précisément là où personne ne le relirait.
 */
export type CleCategorie = 'interet' | 'question' | 'horaire' | 'autre'

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
  /** Attribut `lang` du document, `hreflang`, et `inLanguage` du balisage structuré. */
  codeLangue: string
  /**
   * La locale de partage (`og:locale`), au format `langue_TERRITOIRE`.
   *
   * Un champ, et non `${codeLangue}_LU` assemblé au moment de rendre : la concaténation
   * tenait pour acquis que toute langue du site fût une langue DU LUXEMBOURG. L'anglais
   * ne l'est pas — il s'adresse précisément aux familles qui n'ont ni le français, ni
   * l'allemand, ni le luxembourgeois —, et `en_LU` désignerait une variante qui n'existe
   * nulle part.
   *
   * `codeLangue` reste sans territoire (`en`, et non `en-GB`) : c'est lui qui porte
   * `lang`, `hreflang` et `inLanguage`, où restreindre à une région écarterait des
   * lecteurs que la page vise. Open Graph est le seul à réclamer un territoire, et le
   * seul à en recevoir un.
   */
  localePartage: string
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
  /**
   * La page « Indépendance » (`/independance/`), et non plus une section de l'accueil.
   *
   * ATTENTION à `lien` : il est PARTAGÉ avec le bloc « bientôt » de l'appel final, qui
   * l'emploie pour son bouton vers le plan officiel. Le supprimer en croyant nettoyer cette
   * page laisserait ce bouton sans libellé.
   */
  independance: {
    titre: string
    texte: string
    lien: string
    retour: string
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
    /** Le lien vers la page de contact. Il sert au pied de page ET à l'en-tête. */
    lienContact: string
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

  /*
   * Le contact. Une page à part, comme les mentions et l'indépendance, et pour la même
   * raison : l'accueil va des faits à l'application, et un formulaire au milieu ferait
   * dévier la lecture avant qu'elle ait servi.
   *
   * Ce que le formulaire est, et qu'il faut avoir en tête en écrivant ces textes : il
   * n'envoie rien. Il assemble une adresse `mailto:` et ouvre le logiciel de courrier de
   * la personne, qui décide seule d'envoyer. Aucune de ces chaînes ne doit donc laisser
   * croire à un envoi depuis la page — ce serait le seul endroit du site où l'on
   * promettrait quelque chose que le code ne fait pas.
   */
  contact: {
    titre: string
    /** Ce que cette page permet. Sert aussi de description aux moteurs de recherche. */
    intro: string
    /** Ce que le formulaire fait vraiment, et ce qu'il ne fait pas. */
    note: string
    /** La légende du groupe de catégories. Un `fieldset` sans `legend` n'annonce rien. */
    categorieLegende: string
    /*
     * Les catégories, dans le même ORDRE et avec les mêmes clés dans les trois langues —
     * la clé entre dans l'objet du courriel, et une clé traduite rendrait les règles de
     * tri de la boîte fausses dans deux langues sur trois. Un test le tient.
     */
    categories: { cle: CleCategorie; texte: string }[]
    /*
     * Le renvoi vers la commune, montré quand la catégorie « horaire » est choisie.
     *
     * Ce n'est pas une politesse. Quelqu'un qui cherche l'heure d'un bus tombera sur ce
     * site, et rien dans son adresse ne dit qu'il n'est pas celui de la commune : le
     * premier principe du projet est de ne pas passer pour elle. S'y ajoute qu'il n'y a
     * rien à consulter ici pour l'instant, l'application n'étant pas ouverte. Répondre
     * « voyez le plan officiel » vaut mieux que laisser croire à un guichet.
     */
    renvoiCommune: string
    nomEtiquette: string
    courrielEtiquette: string
    courrielAide: string
    messageEtiquette: string
    messageAide: string
    /** Le compte des caractères restants. `{n}` y est remplacé par le nombre. */
    compteur: string
    envoyer: string
    /** Ce qui précède la catégorie dans l'objet du courriel, pour qu'il se trie. */
    sujetPrefixe: string
    /*
     * Ce qui s'affiche APRÈS avoir ouvert le logiciel de courrier. Nécessaire, et non
     * décoratif : sur un appareil sans logiciel de courrier configuré, `mailto:` ne fait
     * rien de visible, et sans ce message la page paraît cassée.
     */
    ouvertTitre: string
    ouvertTexte: string
    /** L'adresse en clair, pour qui préfère écrire lui-même — ou n'a pas de JavaScript. */
    directTitre: string
    directTexte: string
    /** Annoncé au-dessus du formulaire quand l'envoi a été refusé. */
    erreurResume: string
    erreurs: {
      requis: string
      courrielInvalide: string
      tropCourt: string
      tropLong: string
    }
    retour: string
    /*
     * Le rappel au bas de l'accueil. Un épilogue, pas un second appel à l'action :
     * l'appel final referme la page sur l'heure par laquelle elle s'est ouverte, et une
     * deuxième demande juste après lui prendrait ce qu'il a.
     */
    brefTitre: string
    brefTexte: string
    brefAction: string
  }
}
