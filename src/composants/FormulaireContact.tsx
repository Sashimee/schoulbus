/*
 * Le formulaire de contact.
 *
 * Il n'envoie rien, et c'est le fait qui gouverne tout le fichier. À la validation, il
 * assemble une adresse `mailto:` (voir `formulaire/courriel.ts`) et laisse le logiciel de
 * courrier de la personne l'ouvrir. La page ne joint donc aucun serveur, la ligne du pied
 * de page qui l'affirme reste vraie, et la politique de sécurité posée dans
 * `vite.config.ts` n'a pas eu à être desserrée d'un caractère.
 *
 * Ce que cela impose, en retour :
 *
 *  - `preventDefault()` est OBLIGATOIRE, pas une commodité. La politique porte
 *    `form-action 'none'` : une soumission qui atteindrait le navigateur serait bloquée,
 *    et elle le serait en silence.
 *  - Sans JavaScript, ce formulaire ne fait rien. D'où l'adresse en clair juste en
 *    dessous, qui est le vrai chemin de secours et non une décoration.
 *
 * `noValidate` : les bulles natives du navigateur sont rédigées dans la langue de SON
 * interface, pas dans celle de la page. Sur un site trilingue, laisser le navigateur
 * parler afficherait un message français à qui lit la page en luxembourgeois. Les
 * attributs `required` restent, eux : ils portent la sémantique pour les lecteurs
 * d'écran, et `noValidate` ne neutralise que l'affichage.
 */
import { useId, useState, type FormEvent } from 'react'
import { ADRESSE_CONTACT, URL_SOURCE_OFFICIELLE } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'
import { lienCourriel, lienTropLong } from '../formulaire/courriel.ts'
import {
  MESSAGE_MAX,
  NOM_MAX,
  premierFautif,
  valider,
  type Erreurs,
} from '../formulaire/validation.ts'
import type { CleCategorie } from '../contenu/type.ts'
import { Icone } from './Icones.tsx'

export function FormulaireContact() {
  const contenu = useContenu()
  const c = contenu.contact

  /*
   * Les identifiants viennent de `useId` : stable entre le pré-rendu et l'hydratation,
   * et sans collision le jour où deux formulaires cohabiteraient sur une même page.
   */
  const id = useId()
  const idNom = `${id}-nom`
  const idCourriel = `${id}-courriel`
  const idMessage = `${id}-message`

  /*
   * Tous les états de départ sont des constantes. C'est la contrainte du pré-rendu : ce
   * qui est rendu au serveur doit être exactement ce que le navigateur rend en
   * s'hydratant, et une valeur tirée de `window` ou d'un stockage ferait diverger les deux.
   */
  const [categorie, setCategorie] = useState<CleCategorie>(c.categories[0].cle)
  const [nom, setNom] = useState('')
  const [courriel, setCourriel] = useState('')
  const [message, setMessage] = useState('')
  const [erreurs, setErreurs] = useState<Erreurs>({})
  const [ouvert, setOuvert] = useState(false)

  function envoyer(evenement: FormEvent<HTMLFormElement>) {
    // Voir l'en-tête : sans ceci, la politique bloque la soumission sans rien dire.
    evenement.preventDefault()

    const champs = { categorie, nom, courriel, message }
    const trouvees = valider(champs)
    setErreurs(trouvees)

    const fautif = premierFautif(trouvees)
    if (fautif) {
      /*
       * Le curseur va au premier champ à reprendre. Sans ce geste, la personne qui
       * navigue au clavier reste sur le bouton, et les messages qui viennent d'être
       * annoncés se trouvent au-dessus d'elle, hors du chemin de tabulation qu'elle suit.
       */
      const cible = { nom: idNom, courriel: idCourriel, message: idMessage }[fautif]
      document.getElementById(cible)?.focus()
      return
    }

    const etiquetteCategorie = c.categories.find((x) => x.cle === categorie)?.texte ?? ''
    const lien = lienCourriel(
      champs,
      {
        prefixe: c.sujetPrefixe,
        categorie: etiquetteCategorie,
        nom: c.nomEtiquette,
        courriel: c.courrielEtiquette,
      },
      ADRESSE_CONTACT,
    )

    /*
     * La seconde garde de longueur, celle que le plafond en caractères ne peut pas
     * assurer : un message d'accents pèse six fois son compte une fois encodé (voir
     * `LONGUEUR_MAX_LIEN`). Mieux vaut refuser ici, en le disant, que laisser partir un
     * message dont la fin serait coupée en chemin sans que personne ne le voie.
     */
    if (lienTropLong(lien)) {
      setErreurs({ message: 'tropLong' })
      document.getElementById(idMessage)?.focus()
      return
    }

    window.location.href = lien

    /*
     * Un `mailto:` ne quitte pas la page : sur un appareil sans logiciel de courrier
     * associé, il ne se passe RIEN de visible. Sans ce message, le bouton paraîtrait mort
     * et la page cassée — c'est la raison d'être de cet état, et non une confirmation de
     * politesse.
     */
    setOuvert(true)
  }

  const restants = MESSAGE_MAX - message.length

  return (
    <form className="formulaire" onSubmit={envoyer} noValidate>
      {Object.keys(erreurs).length > 0 && (
        <p className="formulaire__resume" role="alert">
          {c.erreurResume}
        </p>
      )}

      {/*
       * Des boutons radio, et non le motif `.segments` des sélecteurs de langue : ceux-là
       * sont des `<button aria-pressed>`, ce qui décrit une bascule d'interface et non un
       * champ à choix unique. Un `<select>` aurait tenu moins de place, mais les quatre
       * intitulés doivent se LIRE : ce sont eux qui disent ce pour quoi la page existe —
       * se renseigner sur une application qui n'est pas encore ouverte —, et l'un d'eux
       * annonce que les questions d'horaire trouvent ici une réponse, pas un guichet.
       */}
      <fieldset className="champ champ--groupe">
        <legend className="champ__etiquette">{c.categorieLegende}</legend>
        <div className="champ__choix">
          {c.categories.map((option) => (
            <label key={option.cle} className="choix">
              <input
                type="radio"
                name={`${id}-categorie`}
                value={option.cle}
                checked={categorie === option.cle}
                onChange={() => setCategorie(option.cle)}
              />
              <span>{option.texte}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/*
       * Le renvoi vers la commune. Il paraît AVANT les champs, tant qu'il peut encore
       * éviter d'écrire au mauvais endroit : qui cherche l'heure d'un bus est tombé sur un
       * site qui n'est pas celui de la commune, et qui n'a pour l'instant aucun horaire à
       * montrer puisque l'application n'est pas ouverte.
       */}
      {categorie === 'horaire' && (
        <p className="formulaire__renvoi">
          {c.renvoiCommune}{' '}
          <a href={URL_SOURCE_OFFICIELLE} target="_blank" rel="noopener noreferrer">
            {contenu.independance.lien}
            <Icone nom="externe" className="lien__icone" />
          </a>
        </p>
      )}

      <div className="champ" data-invalide={erreurs.nom ? 'oui' : undefined}>
        <label className="champ__etiquette" htmlFor={idNom}>
          {c.nomEtiquette}
        </label>
        <input
          id={idNom}
          className="champ__saisie"
          type="text"
          name="nom"
          value={nom}
          maxLength={NOM_MAX}
          autoComplete="name"
          required
          aria-invalid={erreurs.nom ? true : undefined}
          aria-describedby={erreurs.nom ? `${idNom}-erreur` : undefined}
          onChange={(e) => setNom(e.target.value)}
        />
        {erreurs.nom && (
          <p className="champ__erreur" id={`${idNom}-erreur`}>
            {c.erreurs[erreurs.nom]}
          </p>
        )}
      </div>

      <div className="champ" data-invalide={erreurs.courriel ? 'oui' : undefined}>
        <label className="champ__etiquette" htmlFor={idCourriel}>
          {c.courrielEtiquette}
        </label>
        <input
          id={idCourriel}
          className="champ__saisie"
          type="email"
          name="courriel"
          value={courriel}
          autoComplete="email"
          required
          aria-invalid={erreurs.courriel ? true : undefined}
          aria-describedby={
            erreurs.courriel ? `${idCourriel}-aide ${idCourriel}-erreur` : `${idCourriel}-aide`
          }
          onChange={(e) => setCourriel(e.target.value)}
        />
        <p className="champ__aide" id={`${idCourriel}-aide`}>
          {c.courrielAide}
        </p>
        {erreurs.courriel && (
          <p className="champ__erreur" id={`${idCourriel}-erreur`}>
            {c.erreurs[erreurs.courriel]}
          </p>
        )}
      </div>

      <div className="champ" data-invalide={erreurs.message ? 'oui' : undefined}>
        <label className="champ__etiquette" htmlFor={idMessage}>
          {c.messageEtiquette}
        </label>
        <textarea
          id={idMessage}
          className="champ__saisie champ__saisie--long"
          name="message"
          rows={6}
          value={message}
          maxLength={MESSAGE_MAX}
          required
          aria-invalid={erreurs.message ? true : undefined}
          aria-describedby={
            erreurs.message ? `${idMessage}-aide ${idMessage}-erreur` : `${idMessage}-aide`
          }
          onChange={(e) => setMessage(e.target.value)}
        />
        <p className="champ__aide" id={`${idMessage}-aide`}>
          {c.messageAide}
          {/*
           * Le compte se voit venir. La limite n'est pas une idée de la bonne longueur
           * d'un message : au-delà, l'adresse `mailto:` est tronquée par le système, et le
           * message partirait amputé sans que personne ne le voie (voir `MESSAGE_MAX`).
           * `aria-live` l'annonce sans voler le curseur pendant la frappe.
           */}{' '}
          <span aria-live="polite">{c.compteur.replace('{n}', String(restants))}</span>
        </p>
        {erreurs.message && (
          <p className="champ__erreur" id={`${idMessage}-erreur`}>
            {c.erreurs[erreurs.message]}
          </p>
        )}
      </div>

      {/*
       * Un vrai `<button>`, et non le composant `Bouton` : celui-ci ne rend que des `<a>`,
       * délibérément (voir son en-tête). Un lien annonce un départ ; ici, l'action a lieu
       * dans la page. Seules les classes sont reprises, comme le fait déjà la page
       * « Indépendance » pour son bouton de retour.
       */}
      <div className="rangee">
        <button type="submit" className="bouton bouton--primaire">
          {c.envoyer}
        </button>
      </div>

      {ouvert && (
        <div className="formulaire__etat" role="status">
          <strong>{c.ouvertTitre}</strong>
          <p className="texte-doux">{c.ouvertTexte}</p>
        </div>
      )}
    </form>
  )
}
