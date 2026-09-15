/*
 * Le formulaire de contact.
 *
 * C'EST LA SEULE CHOSE DE TOUT LE SITE QUI SORTE DE L'APPAREIL DU VISITEUR, et cela
 * gouverne sa forme :
 *
 * - L'adresse en clair est AU-DESSUS, dans `Contact.tsx`, et elle ne dépend pas de lui.
 *   Ce formulaire est une commodité posée par-dessus ; quand il tombe, la page sert
 *   encore. C'est pour cela que le message d'échec renvoie à l'adresse plutôt que de
 *   proposer de réessayer.
 * - `fetch` et non une soumission native. La politique de sécurité du contenu garde
 *   `form-action 'none'`, ce qui interdit à ce formulaire de NAVIGUER : si JavaScript
 *   échoue, il ne part pas du tout — au lieu de partir n'importe où. C'est le bon
 *   comportement, et c'est pourquoi la politique n'a pas eu à être rouverte.
 * - L'envoi est TOUJOURS déclenché par le visiteur. Rien ne part au chargement, rien ne
 *   part à la frappe. C'est ce qui rend vraie la phrase du pied de page.
 *
 * Le leurre : un champ que le CSS cache à l'œil et que rien ne cache au lecteur d'écran.
 * `aria-hidden` serait une faute ici — une personne aveugle le remplirait sans savoir
 * qu'il la fera refuser. Il porte donc une étiquette qui dit de le laisser vide, et il
 * sort de l'ordre de tabulation.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ADRESSE_CONTACT } from '../config.ts'
import { useContenu } from '../i18n/contexte.ts'

type Etat = 'repos' | 'envoi' | 'envoye' | 'erreur'

/** Ce que le service peut refuser, et la clé de contenu qui le dit au visiteur. */
const MESSAGES_DE_REFUS = {
  vide: 'erreurVide',
  tropLong: 'erreurTropLong',
  tropDeLiens: 'erreurTropDeLiens',
  tropVite: 'erreurTropVite',
  'trop-souvent': 'erreurTropSouvent',
} as const

export function FormulaireContact() {
  const contenu = useContenu()
  const [etat, setEtat] = useState<Etat>('repos')
  const [erreur, setErreur] = useState<string>('')

  /*
   * L'instant où le formulaire est apparu. Le service refuse ce qui part en moins de trois
   * secondes — un robot qui poste sans ouvrir la page n'a rien à envoyer ici. La mesure
   * est faite par le navigateur, donc falsifiable, et c'est écrit dans `validation.mjs`
   * plutôt que passée sous silence, parce qu'une protection dont on surestime la portée est pire qu'aucune.
   */
  const apparu = useRef(0)
  useEffect(() => {
    apparu.current = Date.now()
  }, [])

  async function envoyer(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (etat === 'envoi') return

    const champs = new FormData(evenement.currentTarget)
    setEtat('envoi')
    setErreur('')

    try {
      const reponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sujet: champs.get('sujet'),
          message: champs.get('message'),
          reponse: champs.get('reponse'),
          site: champs.get('site'),
          duree: Date.now() - apparu.current,
        }),
      })

      if (reponse.ok) {
        setEtat('envoye')
        return
      }

      const charge = (await reponse.json().catch(() => ({}))) as { erreur?: string }
      const cle = MESSAGES_DE_REFUS[charge.erreur as keyof typeof MESSAGES_DE_REFUS]
      // Le leurre et les motifs inconnus tombent sur le message générique : un robot n'a
      // rien à apprendre de ses erreurs, et un visiteur n'a que faire d'un code interne.
      setErreur(cle ? contenu.contact[cle] : contenu.contact.erreurEnvoi)
      setEtat('erreur')
    } catch {
      setErreur(contenu.contact.erreurEnvoi)
      setEtat('erreur')
    }
  }

  if (etat === 'envoye') {
    return (
      <p className="formulaire__etat formulaire__etat--reussi" role="status">
        {contenu.contact.envoiReussi}
      </p>
    )
  }

  return (
    <form className="formulaire" onSubmit={envoyer} noValidate>
      <p className="texte-doux">{contenu.contact.formulaireNote}</p>

      <div className="champ">
        <label className="champ__etiquette" htmlFor="contact-sujet">
          {contenu.contact.sujetEtiquette}
        </label>
        <input
          className="champ__saisie"
          id="contact-sujet"
          name="sujet"
          type="text"
          maxLength={120}
          required
          autoComplete="off"
        />
      </div>

      <div className="champ">
        <label className="champ__etiquette" htmlFor="contact-message">
          {contenu.contact.messageEtiquette}
        </label>
        <textarea
          className="champ__saisie champ__saisie--long"
          id="contact-message"
          name="message"
          rows={7}
          maxLength={4000}
          required
        />
      </div>

      <div className="champ">
        <label className="champ__etiquette" htmlFor="contact-reponse">
          {contenu.contact.reponseEtiquette}
        </label>
        <input
          className="champ__saisie"
          id="contact-reponse"
          name="reponse"
          type="email"
          maxLength={254}
          autoComplete="email"
          aria-describedby="contact-reponse-aide"
        />
        <p className="champ__aide" id="contact-reponse-aide">
          {contenu.contact.reponseAide}
        </p>
      </div>

      {/* Le leurre. Caché à l'œil par le CSS, nommé pour qui écoute la page. */}
      <div className="formulaire__leurre">
        <label className="champ__etiquette" htmlFor="contact-site">
          {contenu.contact.leurreEtiquette}
        </label>
        <input id="contact-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="rangee">
        <button className="bouton bouton--primaire" type="submit" disabled={etat === 'envoi'}>
          {etat === 'envoi' ? contenu.contact.envoiEnCours : contenu.contact.envoyer}
        </button>
      </div>

      {/*
       * Le refus est annoncé, pas seulement affiché : `role="alert"` le fait lire tout de
       * suite. L'adresse en clair reste au-dessus, et le message y renvoie — c'est la
       * sortie de secours, et elle ne dépend d'aucun service.
       */}
      {etat === 'erreur' && (
        <p className="formulaire__etat formulaire__etat--erreur" role="alert">
          {erreur}{' '}
          <a href={`mailto:${ADRESSE_CONTACT}`}>{ADRESSE_CONTACT}</a>
        </p>
      )}
    </form>
  )
}
