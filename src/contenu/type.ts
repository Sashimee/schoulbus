/*
 * La forme du contenu, écrite une fois.
 *
 * Le type n'est pas de la décoration : il fait échouer la compilation quand une des
 * cinq langues perd un paragraphe. L'application se protège autrement — un dictionnaire
 * plat, avec repli sur le français —, mais elle a deux mille clés. La vitrine en a une
 * centaine : le type est plus sûr, et il se lit.
 *
 * Une règle de rédaction traverse tout le fichier : la vitrine ne promet rien que
 * l'application ne tienne. Pas de « toujours à l'heure », pas de « suivi en temps réel ».
 * Le site affiche un plan officiel personnalisé, il ne sait pas où est le bus.
 *
 * CE QUE LA REFONTE A RETIRÉ D'ICI, et pourquoi c'est écrit plutôt qu'oublié :
 *
 *   `recit`           les quatre « temps » du matin. La démonstration est passée au
 *                     héros, qui la fait en une capture et quatre lignes au lieu de
 *                     quatre paragraphes.
 *   `confidentialite` devenu `principes.donnees` — le schéma dessiné et ses trois points
 *                     disaient en une section ce que la carte sombre dit en trois phrases.
 *   `langues`         le ruban des cinq langues. Le sélecteur de l'en-tête en montre
 *                     désormais cinq : une section qui répétait « nous parlons cinq
 *                     langues » au-dessus d'un sélecteur qui en propose cinq était une
 *                     démonstration de ce qui était déjà à l'écran.
 *   `horsligne`       devenu `principes.horsLigne`.
 *
 * Ces quatre-là ne sont pas « à réintroduire plus tard ». Ce qu'ils disaient de vrai est
 * dans les limites, dans les tuiles ou dans les principes ; ce qu'ils disaient en trop
 * était de la longueur.
 */

/**
 * Les cinq langues.
 *
 * La vitrine en parlait trois (fr, de, lb) quand l'application en parlait cinq, et la
 * page l'annonçait elle-même dans sa bande de chiffres : « 5 langues, dont le
 * luxembourgeois ». Une page de présentation qui vante cinq langues en trois langues se
 * contredit à voix haute. Le portugais et l'anglais sont donc ici aussi.
 *
 * L'ordre est celui de l'application : les trois langues du pays, puis les deux autres.
 */
export type Langue = 'fr' | 'de' | 'lb' | 'pt' | 'en'

/**
 * Une ligne d'annotation du héros : à gauche une valeur qu'on lit dans la capture,
 * à droite ce qu'elle veut dire.
 *
 * `valeur` est TOUJOURS lisible sur `public/captures/aujourdhui-{langue}-*.webp`. C'est
 * la contrainte dure du fichier : le lecteur voit l'écran à côté de la phrase.
 */
export type LigneHeros = {
  valeur: string
  texte: string
  /**
   * `compte` marque LA ligne du décompte — celle qui porte le point et la seule à
   * prendre le corail. Une seule ligne des quatre l'a, et `contenu.test.ts` le vérifie
   * dans les cinq langues : le corail signale ce qui presse, et il ne le signale plus
   * du tout s'il est sur toutes les lignes.
   */
  compte?: true
}

export type Tuile = {
  titre: string
  texte: string
  /** Icône du jeu de `composants/Icones.tsx`. */
  icone: string
  /**
   * La seule tuile dont l'icône est en corail : les perturbations.
   *
   * Posé sur la donnée et non sur un `nth-child` en CSS, parce qu'une règle de position
   * se décale sans bruit dès qu'on réordonne les tuiles — et qu'elle ne peut pas être
   * vérifiée langue par langue.
   */
  ton?: 'alerte'
  /*
   * Pas de largeur ici. La composition de la grille est posée par `auto-fit` dans
   * `sections.css` : la largeur d'une tuile décrit la mise en page, pas la fonction, et
   * un rang recopié dans cinq langues finirait par diverger dans l'une d'elles.
   */
}

/** Une des quatre captures montrées, avec ce qu'on en dit. */
export type CarteEcran = {
  titre: string
  texte: string
}

export type Limite = {
  titre: string
  texte: string
}

export type Contenu = {
  langue: Langue
  /** Attribut `lang` du document, et `og:locale`. */
  codeLangue: string
  meta: {
    titre: string
    description: string
    /**
     * Le paragraphe servi à qui n'a pas de JavaScript. Il était écrit en dur dans
     * `index.html`, donc en français — recopié tel quel par le pré-rendu, il servait un
     * texte français sous `/de/`, `/lb/`, `/pt/` et `/en/`, c'est-à-dire que le seul
     * lecteur pour qui ce bloc existe était le seul à ne pas être servi dans sa langue.
     * Les deux liens qui l'accompagnent réemploient `general.ouvrirApp` et
     * `independance.lien` : ils sont déjà relus dans les cinq langues.
     */
    sansScript: string
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
    /**
     * Découpé en lignes ; chaque mot est révélé séparément.
     *
     * Chaque ligne tient dans `SIGNES_MAX_TITRE`. Ce n'est pas une règle de style : c'est
     * la largeur dessinable de la vignette de partage, et elle est vérifiée aux deux bouts
     * — par `src/tests/contenu.test.ts` et par `scripts/build-partage.mjs`, qui refuse de
     * dessiner une ligne qui déborderait.
     */
    titre: string[]
    /** Le texte alternatif de la capture du héros. Il décrit l'écran, pas la marque. */
    altCapture: string
    /** Les quatre annotations, dans l'ordre où on lit l'écran. */
    lignes: [LigneHeros, LigneHeros, LigneHeros, LigneHeros]
    actionPrincipale: string
    actionSecondaire: string
    /** Sous les actions : ce que la capture est, et de quand elle date. */
    legende: string
  }
  chiffres: {
    arrets: string
    villages: string
    langues: string
    /**
     * Le zéro est cadré, et son cadrage a changé le 8 septembre.
     *
     * Il disait « donnée de famille envoyée à un serveur », et c'était devenu faux :
     * l'export vers Google Agenda envoie le prénom de l'enfant et le nom de son arrêt à
     * Google (`bus-scolaire-beckerich/src/lib/agenda/`), et un prénom est une donnée de
     * famille. Le zéro porte désormais sur ce qui part SANS QU'ON LE DEMANDE — ce qui est
     * vrai, et reste la chose qu'un parent veut savoir.
     */
    envoi: string
    envoiValeur: string
    /**
     * Ce qui sort quand même, sous la bande de chiffres.
     *
     * Un « 0 » affiché en grand se relit vite comme « rien ne sort », et ce serait faux :
     * l'application compte ses pages vues, une notification suppose un identifiant
     * d'appareil déposé sur un serveur le temps de l'abonnement, et l'export vers Google
     * Agenda envoie à Google le prénom de l'enfant et le nom de son arrêt. La note n'est
     * pas une précaution juridique, c'est ce qui rend le chiffre vrai.
     *
     * LA TROISIÈME MANQUAIT jusqu'au 8 septembre, et la note affirmait même le contraire
     * — « ni les prénoms ». C'était la seule affirmation de la vitrine que l'application
     * ne tenait pas.
     *
     * LA MAQUETTE NE LA PORTAIT PAS. Elle a été rétablie : afficher « 0 » en grand sans
     * elle, dans la même page qui énumère six limites, aurait été la seule affirmation
     * de la vitrine que l'application ne tient pas.
     */
    envoiNote: string
  }
  /** La bande des quatre captures. */
  ecrans: {
    titre: string
    note: string
    cartes: [CarteEcran, CarteEcran, CarteEcran, CarteEcran]
  }
  fonctions: {
    etiquette: string
    titre: string
    tuiles: Tuile[]
  }
  /**
   * Les deux cartes de principe : ce que le logiciel ne fait pas de vos données, et ce
   * qu'il fait sans réseau. Elles ont remplacé deux sections entières.
   */
  principes: {
    donnees: {
      etiquette: string
      titre: string
      texte: string
    }
    horsLigne: {
      etiquette: string
      titre: string
      /**
       * `ton: 'nuance'` porte la puce ambre — la seule des trois qui dise une
       * restriction. Taire la carte du trajet à pied ici, c'est promettre un « tout hors
       * ligne » que la fiche de la semaine dément dès qu'on l'ouvre sans réseau.
       */
      points: { texte: string; ton?: 'nuance' }[]
    }
  }
  limites: {
    titre: string
    /** La note en chiffres, à côté du titre : combien de limites, et pourquoi ici. */
    note: string
    items: Limite[]
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
    /** Sous l'heure de la tuile : d'où part ce départ-là. */
    legendeHeure: string
    /*
     * Le titre est coupé en trois parce que son milieu est en corail — c'est le seul mot
     * coloré de la page, et il désigne le temps qui reste. Le découper dans le contenu
     * plutôt que d'y glisser une balise évite d'avoir du HTML dans un fichier de texte,
     * et laisse chaque langue placer son accent où sa grammaire le met : l'allemand ne
     * met pas « sechzehn Minuten » à la même place que le français.
     */
    titreAvant: string
    titreAccent: string
    titreApres: string
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
     * Ce que la vitrine ne fait pas. La carte « données » le dit déjà de l'APPLICATION ;
     * cette ligne-ci parle de la PAGE qu'on est en train de lire, et c'est une autre
     * promesse — une page de présentation qui vante l'absence de traqueurs tout en en
     * portant serait le mensonge le plus banal du web.
     */
    viePrivee: string
    /** Le lien vers la page des mentions légales, dans la colonne « Le projet ». */
    lienMentions: string
    /** Le lien vers la page de contact, à côté du précédent. */
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
   * La page de contact.
   *
   * Le site décrivait une application sans offrir le moindre moyen d'écrire à qui la fait.
   * Ce que cette page doit tenir, et qui explique la forme de ces clés :
   *
   * - L'ADRESSE EST EN CLAIR, et avant tout le reste. C'est ce qui rend la page utile sans
   *   JavaScript, et ce qui la garde utile si un formulaire vient s'y ajouter et tombe.
   * - Elle dit ce qu'elle NE PEUT PAS FAIRE. C'est le premier principe du projet, et c'est
   *   ici qu'il coûte le plus cher à tenir : un parent qui écrit pour signaler une absence
   *   ou demander un changement d'arrêt s'adresse à la commune, pas à ce site, et il faut
   *   qu'il le lise AVANT d'écrire — pas dans une réponse trois jours plus tard.
   * - Elle ne promet aucun délai. Une boîte relevée par une personne entre deux journées
   *   de travail n'est pas un service, et l'écrire vaut mieux que de le laisser deviner.
   */
  contact: {
    titre: string
    /** Ce que cette page est. Sert aussi de description aux moteurs. */
    intro: string
    adresseTitre: string
    /** La phrase qui précède l'adresse. L'adresse elle-même vient de `ADRESSE_CONTACT`. */
    adresseIntro: string
    /** Ce qu'il advient d'un message reçu, et ce que la page ne fait pas en l'affichant. */
    adresseNote: string
    utileTitre: string
    /** Un paragraphe par ligne : ce qui aide à traiter un signalement. */
    utileCorps: string
    limitesTitre: string
    /** Ce que cette adresse ne peut pas faire, et à qui s'adresser à sa place. */
    limitesCorps: string
    retour: string
  }
}

/**
 * Signes au plus par ligne de `heros.titre`.
 *
 * `scripts/build-partage.mjs` dessine ces lignes à 76 px sur une vignette de 1200 px dont
 * 88 px de marge de chaque côté : il en reste 1024, soit vingt-quatre signes à cette
 * graisse. Au-delà, la ligne sort de l'image — et la vignette est ce qu'un groupe de
 * parents voit AVANT d'ouvrir le lien.
 *
 * LE LUXEMBOURGEOIS EST EXACTEMENT À VINGT-QUATRE. Ce n'est pas un défaut, c'est un piège :
 * la première retouche de ce titre fera tomber la construction. Le nombre vit donc ici,
 * en un seul endroit, et les deux gardiens disent quoi faire quand il tombe — plutôt que
 * de laisser quelqu'un découvrir un « expected 25 to be less than or equal to 24 » sans
 * savoir d'où sort le 24.
 */
export const SIGNES_MAX_TITRE = 24
