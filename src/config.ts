/*
 * Les adresses extérieures, en un seul endroit.
 *
 * `URL_APP` est provisoire : l'application vit aujourd'hui sur GitHub Pages. Le jour où
 * elle prend un domaine propre — `app.schoulbus.lu` ou un sous-chemin de `schoulbus.lu` —
 * c'est cette ligne qui change, et rien d'autre. Même discipline que le `BASE_PATH` de
 * l'application, pour la même raison : une adresse recopiée dans quinze composantes est
 * une adresse qu'on oublie de corriger dans trois d'entre elles.
 */
export const URL_APP = 'https://sashimee.github.io/bus-scolaire-beckerich'

/**
 * L'application est-elle publique ?
 *
 * Tant que cette constante vaut `false`, la vitrine DÉCRIT l'application sans mener à
 * elle : aucun bouton, aucun QR, aucune entrée de pied de page, et rien dans le balisage
 * structuré ne désigne `URL_APP`. À leur place, une mention « bientôt disponible ».
 *
 * Un interrupteur plutôt qu'une suppression, pour deux raisons.
 *
 * La première est que les textes des appels à l'action existent en trois langues et ont
 * été relus. Les effacer maintenant, ce serait réinventer dans quelques semaines une
 * formulation luxembourgeoise qui attend déjà sa relecture — une deuxième fois, et sans
 * nécessité.
 *
 * La seconde est qu'un lien qu'on retire à la main revient à la main. Le jour où
 * l'application sera publiée, cette ligne passe à `true` et tout réapparaît d'un coup,
 * aux mêmes endroits, dans les mêmes mots. Les deux états sont testés (`src/tests/`) :
 * il n'existe pas d'état intermédiaire où la moitié des liens serait revenue.
 *
 * Ce que cet interrupteur ne couvre pas lui-même, faute d'être du code : le `<noscript>`
 * de `index.html`, qui est du HTML statique. Un test tient désormais l'invariant à sa
 * place (`rendu.test.ts`), de sorte que les deux ne peuvent plus se contredire.
 *
 * Refermée : l'application est encore en développement, et la vitrine redevient une page de
 * présentation seule. Elle a été ouverte un temps, puis refermée le lendemain — c'est
 * exactement l'usage prévu, et la raison pour laquelle c'est un interrupteur.
 *
 * Attention à ce que ce `false` ne dit PAS : il retire les chemins depuis cette page, il ne
 * rend pas l'application inaccessible. Elle reste publiée sur GitHub Pages, et `URL_APP`
 * demeure dans le paquet JavaScript comme donnée de configuration — `sansApplication()` en
 * a besoin pour filtrer le pied de page. Qui connaît l'adresse y entre. Rendre l'application
 * réellement inatteignable se décide dans son dépôt à elle, pas ici.
 */
export const APP_PUBLIEE = false

/**
 * La source officielle. Elle n'est pas décorative : le site est indépendant de la
 * commune, et tout ce qu'il affiche vient de ce document. Le lien doit rester visible
 * partout où l'on parle d'horaires.
 */
export const URL_SOURCE_OFFICIELLE = 'https://kanner.beckerich.lu/infos/horaires-de-bus'

/** Pages d'information de l'application, citées depuis la vitrine. */
export const URL_LIMITES = `${URL_APP}/limites`
export const URL_INDEPENDANCE = `${URL_APP}/independance`
export const URL_CREDITS = `${URL_APP}/credits`
export const URL_INSTALLER = `${URL_APP}/installer`

/**
 * Origine publique de la vitrine, posée à la construction (voir `vite.config.ts`).
 * Sert aux métadonnées de partage, qui exigent des URL absolues.
 */
declare const __ORIGINE__: string
export const ORIGINE = typeof __ORIGINE__ === 'string' ? __ORIGINE__ : 'https://schoulbus.lu'

/**
 * Le nom de la vignette de partage d'une langue. Le français est à la racine, comme sa
 * page — même règle que `cheminLangue`, et c'est voulu : une vignette allemande sous un
 * lien français donnerait à un groupe de parents une page qu'ils n'ouvriront pas.
 *
 * Posé ici, et non dans `scripts/build-partage.mjs` : le script qui engendre les fichiers
 * et le pré-rendu qui les annonce doivent lire la même règle, sinon la balise pointe un
 * jour vers un fichier que personne n'écrit plus. Ce fichier est le seul des deux qui
 * s'importe aussi bien depuis Node que depuis le navigateur.
 */
export function imagePartage(langue: string): string {
  return langue === 'fr' ? 'partage.png' : `partage-${langue}.png`
}

/**
 * L'éditeur du site, tel qu'il figure aux mentions légales.
 *
 * Le nom est déjà public : il est dans les crédits de l'application, dont le fichier de
 * données précise que rien n'y est inscrit sans accord. L'ADRESSE, elle, ne l'est nulle
 * part — et c'est justement ce qu'une mention légale luxembourgeoise réclame.
 *
 * Tant que cette ligne porte la valeur de remplacement, LA PAGE N'EXISTE PAS : elle n'est
 * ni engendrée, ni annoncée au plan du site, ni liée depuis le pied de page (voir `PAGES`
 * dans `i18n/contexte.ts`). Une page de mentions légales qui afficherait
 * « adresse à compléter » serait pire que pas de page du tout — elle prouverait qu'on ne
 * l'a pas relue. Le jour où cette ligne est remplie, les six adresses apparaissent.
 */
export const ADRESSE_EDITEUR = 'ADRESSE-À-COMPLÉTER'

/** Le nom de l'éditeur. Repris des crédits de l'application. */
export const NOM_EDITEUR = 'Alex Baskewitsch'

/**
 * L'adresse à laquelle on écrit.
 *
 * Une adresse de RÔLE, et non celle d'une personne. Elle paraît en clair dans le HTML
 * pré-rendu, où n'importe quel moissonneur la lit — c'est le prix d'une page qui reste
 * lisible sans JavaScript, et masquer l'adresse par un script la retirerait justement à
 * qui n'en exécute pas. Une adresse de rôle se filtre, se réoriente et se remplace sans
 * toucher à une boîte privée ; `ADRESSE_EDITEUR` deux lignes plus haut dit assez que les
 * coordonnées personnelles ne se publient pas à la légère.
 *
 * Elle ne figure QUE sur la page de contact. Le pied de page, l'en-tête et l'accueil
 * mènent à la page, pas à l'adresse : trois fichiers pré-rendus la portent au lieu des
 * dix-huit qu'aurait produits un `mailto:` dans le pied de page.
 */
export const ADRESSE_CONTACT = 'info@schoulbus.lu'

/** Les mentions légales sont-elles complètes, et donc publiables ? */
export function mentionsPretes(): boolean {
  return !ADRESSE_EDITEUR.includes('À-COMPLÉTER')
}
