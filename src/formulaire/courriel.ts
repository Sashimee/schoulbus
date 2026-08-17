/*
 * L'assemblage de l'adresse `mailto:`.
 *
 * C'est tout ce que le formulaire « envoie » : rien. Il compose une adresse et laisse le
 * logiciel de courrier de la personne l'ouvrir. La page ne joint donc aucun serveur, et
 * la ligne du pied de page qui l'affirme reste vraie — c'est la raison pour laquelle
 * cette forme a été retenue plutôt qu'un formulaire qui poste quelque part.
 *
 * Deux conséquences, qui expliquent le reste du fichier :
 *
 *  - Un `mailto:` ne peut pas fixer l'expéditeur. Le nom et l'adresse de qui écrit
 *    entrent donc dans le CORPS. (Le paramètre `reply-to` existe dans la spécification ;
 *    la plupart des logiciels l'ignorent, et écrire dessus serait miser sur une réponse
 *    qui n'arriverait pas.)
 *  - La longueur est bornée par le système d'exploitation, pas par nous. Voir
 *    `MESSAGE_MAX` dans `validation.ts` : le cas redouté n'est pas l'échec, c'est le
 *    message tronqué qui part quand même.
 */
import type { Champs } from './validation.ts'

/*
 * Les sauts de ligne du corps.
 *
 * `\r\n` et non `\n` : `encodeURIComponent` les rend en `%0D%0A`, la seule paire que tous
 * les logiciels de courrier interprètent. Un `%0A` seul se recopie tel quel dans certains
 * d'entre eux, et le message arrive en un seul paragraphe collé.
 */
const SAUT = '\r\n'

/*
 * La longueur au-delà de laquelle l'adresse assemblée n'est plus sûre.
 *
 * Environ deux mille caractères : c'est la limite historique de la couche qui remet un
 * `mailto:` au logiciel de courrier sous Windows, et elle tronque SANS RIEN DIRE. Cent
 * caractères de marge sous le chiffre rond, parce qu'il est cité de mémoire partout et
 * mesuré nulle part.
 *
 * Pourquoi cette garde EN PLUS du plafond en caractères de `validation.ts` : les deux ne
 * mesurent pas la même chose. Le plafond compte des caractères tapés ; le système, lui,
 * compte des caractères ENCODÉS, et un « é » en vaut six une fois passé par
 * `encodeURIComponent`. Un message d'accents pur passerait donc le plafond et dépasserait
 * quand même — c'est le cas que cette garde attrape, et c'est le seul moyen de promettre
 * que rien ne part amputé.
 */
export const LONGUEUR_MAX_LIEN = 1900

/** L'adresse assemblée risque-t-elle d'être tronquée en chemin ? */
export function lienTropLong(lien: string): boolean {
  return lien.length > LONGUEUR_MAX_LIEN
}

type Etiquettes = {
  /** Ce qui précède la catégorie dans l'objet, pour que la boîte puisse trier. */
  prefixe: string
  /** Le libellé traduit de la catégorie choisie. */
  categorie: string
  nom: string
  courriel: string
}

/**
 * Assemble l'adresse que le bouton d'envoi ouvre.
 *
 * L'objet porte la catégorie plutôt que les premiers mots du message : c'est ce qui rend
 * la boîte de réception triable sans la lire.
 */
export function lienCourriel(champs: Champs, etiquettes: Etiquettes, adresse: string): string {
  const sujet = `${etiquettes.prefixe} ${etiquettes.categorie}`

  /*
   * Un champ vide n'écrit pas sa ligne. Le formulaire ne laisse pas passer de vide, mais
   * cette fonction est publique et se teste seule : un corps s'ouvrant sur « Nom : »
   * suivi de rien serait moins lisible qu'un corps qui n'en parle pas.
   */
  const entete = [
    [etiquettes.nom, champs.nom.trim()],
    [etiquettes.courriel, champs.courriel.trim()],
  ]
    .filter(([, valeur]) => valeur !== '')
    .map(([etiquette, valeur]) => `${etiquette} : ${valeur}`)
    .join(SAUT)

  // Une ligne vide sépare l'en-tête du message ; `filter` évite qu'elle subsiste seule
  // quand l'un des deux blocs manque.
  const corps = [entete, champs.message.trim()].filter((bloc) => bloc !== '').join(SAUT + SAUT)

  return `mailto:${adresse}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`
}
