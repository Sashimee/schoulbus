/*
 * La validation du formulaire de contact.
 *
 * Écrite à la main, sans bibliothèque. Ce n'est pas une économie de dépendance pour
 * l'économie : les règles tiennent en quatre lignes chacune, et une bibliothèque de
 * schémas pèserait plus lourd que la page qu'elle validerait — sur un site dont tout
 * l'argumentaire est qu'il ne charge rien.
 *
 * Le point qui gouverne le fichier : ces fonctions rendent des CODES, jamais des phrases.
 * Les phrases vivent dans `contenu/{fr,de,lb}.ts`, comme tout ce qui se lit sur ce site.
 * Une validation qui rendrait « Ce champ est obligatoire » serait le seul endroit du
 * projet où un texte visible naîtrait hors du contenu — et il ne serait français que par
 * hasard.
 */
import type { CleCategorie } from '../contenu/type.ts'

export type Champs = {
  categorie: CleCategorie
  nom: string
  courriel: string
  message: string
}

export type CodeErreur = 'requis' | 'courrielInvalide' | 'tropCourt' | 'tropLong'

/** Les champs fautifs, et pourquoi. Vide quand tout passe. */
export type Erreurs = Partial<Record<'nom' | 'courriel' | 'message', CodeErreur>>

/** L'ordre dans lequel les champs sont posés à l'écran, donc celui du premier fautif. */
export const CHAMPS_ORDONNES = ['nom', 'courriel', 'message'] as const

export const NOM_MAX = 80
export const MESSAGE_MIN = 10

/*
 * La longueur maximale du message, EN CARACTÈRES TAPÉS.
 *
 * Elle ne vient pas d'une idée de la bonne longueur d'un courriel, mais de `mailto:` :
 * l'adresse assemblée passe par le système, et au-delà d'environ deux mille caractères
 * elle est tronquée — silencieusement. Le message partirait amputé sans que personne ne
 * le voie.
 *
 * Huit cents caractères, et le chiffre est MESURÉ, pas choisi : au pire cas réel — les
 * intitulés les plus longs des trois langues, un nom au maximum, une adresse longue et un
 * texte français ordinaire —, l'adresse assemblée pèse 1622 caractères. Mille en
 * donnaient 1936, c'est-à-dire sous la limite mais sans marge, et une marge nulle est ce
 * qui casse le jour où un intitulé s'allonge d'un mot. Un test tient les deux bouts.
 *
 * Ce plafond NE SUFFIT PAS À LUI SEUL, et il faut le savoir : le système compte des
 * caractères ENCODÉS, où un « é » en vaut six. Huit cents accents feraient donc près de
 * cinq mille caractères tout en respectant ce plafond. C'est `LONGUEUR_MAX_LIEN`, dans
 * `courriel.ts`, qui attrape ce cas-là.
 *
 * Deux gardes, donc, et deux rôles : celle-ci se voit venir — `maxLength` sur le champ et
 * un compte affiché ; l'autre ne se déclenche qu'à l'envoi, pour ce que celle-ci ne peut
 * pas prévoir.
 */
export const MESSAGE_MAX = 800

/*
 * La forme d'une adresse électronique, délibérément permissive.
 *
 * « quelque chose, une arobase, quelque chose, un point, deux lettres au moins » — et
 * rien de plus. Une expression plus stricte refuserait des adresses parfaitement valides
 * (les sous-domaines, les signes plus, les nouvelles extensions), et un refus est ici le
 * pire résultat possible : la personne n'a aucun moyen de prouver qu'elle a raison, et
 * elle s'en va. La seule vérification qui vaille est de savoir si la réponse arrive, et
 * aucune expression régulière ne la fait.
 */
const FORME_COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Vérifie les champs, et rend les fautes trouvées. */
export function valider(champs: Champs): Erreurs {
  const erreurs: Erreurs = {}

  const nom = champs.nom.trim()
  if (nom === '') erreurs.nom = 'requis'
  else if (nom.length > NOM_MAX) erreurs.nom = 'tropLong'

  const courriel = champs.courriel.trim()
  if (courriel === '') erreurs.courriel = 'requis'
  else if (!FORME_COURRIEL.test(courriel)) erreurs.courriel = 'courrielInvalide'

  const message = champs.message.trim()
  if (message === '') erreurs.message = 'requis'
  else if (message.length < MESSAGE_MIN) erreurs.message = 'tropCourt'
  else if (message.length > MESSAGE_MAX) erreurs.message = 'tropLong'

  return erreurs
}

/** Le premier champ fautif dans l'ordre de l'écran, pour y porter le curseur. */
export function premierFautif(erreurs: Erreurs): keyof Erreurs | undefined {
  return CHAMPS_ORDONNES.find((champ) => erreurs[champ] !== undefined)
}
