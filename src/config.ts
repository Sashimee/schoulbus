/*
 * Les adresses extérieures, en un seul endroit.
 *
 * `URL_APP` a été provisoire : l'application a vécu sur GitHub Pages avant de prendre son
 * domaine propre. Le déménagement n'a demandé que cette ligne — c'est ce que cette
 * discipline achetait, et c'est la même que le `BASE_PATH` de l'application, pour la même
 * raison : une adresse recopiée dans quinze composantes est une adresse qu'on oublie de
 * corriger dans trois d'entre elles.
 *
 * Un changement d'adresse déplace aussi le QR : `npm run assets:qr`, puis commiter.
 */
export const URL_APP = 'https://app.schoulbus.lu'

/**
 * L'application est-elle publique ?
 *
 * Tant que cette constante vaut `false`, la vitrine DÉCRIT l'application sans mener à
 * elle : aucun bouton, aucun QR, aucune entrée de pied de page, et rien dans le balisage
 * structuré ne désigne `URL_APP`. À leur place, une mention « bientôt disponible ».
 *
 * Un interrupteur plutôt qu'une suppression, pour deux raisons.
 *
 * La première est que les textes des appels à l'action existent en cinq langues. Les
 * effacer, ce serait réinventer plus tard une formulation luxembourgeoise et une
 * formulation portugaise qui attendent déjà leur relecture — une deuxième fois, et sans
 * nécessité.
 *
 * La seconde est qu'un lien qu'on retire à la main revient à la main. Cette ligne à `true`,
 * et tout réapparaît d'un coup, aux mêmes endroits, dans les mêmes mots. Les deux états
 * sont testés (`src/tests/`) : il n'existe pas d'état intermédiaire où la moitié des liens
 * serait revenue.
 *
 * Le `<noscript>` était la seule chose que cet interrupteur ne couvrait pas, faute d'être
 * du code : un test tenait l'invariant à sa place. Il est engendré depuis le contenu
 * depuis qu'il a fallu le servir dans les cinq langues (`blocNoscript`), donc
 * `APP_PUBLIEE` y décide comme partout ailleurs — et le test vérifie les cinq.
 *
 * Ouverte : l'application est publiée sur `app.schoulbus.lu`. Elle avait déjà été ouverte
 * un jour puis refermée le lendemain, l'application n'étant pas prête — c'est exactement
 * l'usage prévu, et la raison pour laquelle c'est un interrupteur, pas une suppression.
 */
export const APP_PUBLIEE = true

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
 * L'adresse à laquelle on écrit à l'éditeur.
 *
 * Elle est PUBLIÉE EN CLAIR sur la page de contact, et c'est délibéré : c'est ce qui fait
 * que la page sert sans JavaScript, sans formulaire, et le jour où le relais d'envoi tombe.
 * Une adresse masquée par un script est une adresse qu'un lecteur d'écran annonce mal et
 * qu'un parent ne peut pas recopier à la main.
 *
 * Le domaine est celui du site : elle ne peut pas être prise pour une adresse communale.
 */
export const ADRESSE_CONTACT = 'admin@schoulbus.lu'

/**
 * Origine publique de la vitrine, posée à la construction (voir `vite.config.ts`).
 * Sert aux métadonnées de partage, qui exigent des URL absolues.
 */
declare const __ORIGINE__: string
export const ORIGINE = typeof __ORIGINE__ === 'string' ? __ORIGINE__ : 'https://www.schoulbus.lu'

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
 * l'a pas relue. Le jour où cette ligne est remplie, les cinq adresses apparaissent — une
 * par langue.
 */
export const ADRESSE_EDITEUR = '23, Biekerecherwee, L-8543 Levelange'

/**
 * Le nom de l'éditeur, à l'état civil complet.
 *
 * Les crédits de l'application disent `Alex` ; une mention légale est le seul endroit du
 * site où la forme longue compte, parce que c'est elle qui identifie une personne devant
 * un tiers. Les deux dépôts divergent donc sciemment sur ce point.
 */
export const NOM_EDITEUR = 'Alexandre Baskewitsch'

/**
 * Le téléphone de l'éditeur.
 *
 * Le droit luxembourgeois demande un moyen de contact DIRECT, et une adresse postale n'en
 * est pas un : elle identifie, elle ne joint pas. Écrit en format international, parce
 * qu'une mention légale est lue depuis l'étranger aussi souvent que depuis la commune.
 */
export const TELEPHONE_EDITEUR = '+352 621 198 449'

/** La même chose pour un `href`, qui n'admet pas d'espaces. */
export function telephoneAppelable(): string {
  return TELEPHONE_EDITEUR.replace(/\s/g, '')
}

/**
 * L'hébergeur, nommé.
 *
 * `mentions.hebergeurCorps` disait « un serveur loué par l'éditeur » sans dire par qui il
 * est loué — c'est-à-dire qu'elle omettait précisément ce que la rubrique existe pour
 * porter. Le site tourne sur un serveur privé virtuel chez OVH ; c'est l'identité et le
 * pays de cette société-là que la mention doit nommer.
 *
 * Une adresse postale ne se traduit pas : elle est interpolée telle quelle dans les cinq
 * langues, comme `ADRESSE_EDITEUR`.
 */
export const HEBERGEUR = 'OVH SAS, 2 rue Kellermann, 59100 Roubaix, France'

/** Les mentions légales sont-elles complètes, et donc publiables ? */
export function mentionsPretes(): boolean {
  return !ADRESSE_EDITEUR.includes('À-COMPLÉTER')
}
