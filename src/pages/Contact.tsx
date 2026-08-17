/*
 * La page de contact.
 *
 * Nue, comme les mentions légales et l'indépendance : ni fond animé, ni rideau, ni
 * défilement détourné. On n'y vient pas pour lire, on y vient pour écrire.
 *
 * L'ORDRE DES BLOCS EST LE PROPOS DE LA PAGE, et il n'est pas celui qu'on attendrait :
 * l'adresse en clair vient AVANT le formulaire. Le formulaire a besoin de JavaScript pour
 * assembler son `mailto:` — sans script, il est inerte. L'adresse, elle, marche toujours.
 * Mettre le formulaire en premier ferait de la page un cul-de-sac pour qui n'exécute pas
 * de script, sur un site qui pré-rend justement tout son HTML pour n'exclure personne.
 *
 * Ce que cette page ne fait pas, et qui explique qu'elle existe sous cette forme : elle
 * n'envoie rien. Voir `composants/FormulaireContact.tsx`.
 */
import { FormulaireContact } from '../composants/FormulaireContact.tsx'
import { Icone } from '../composants/Icones.tsx'
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { ADRESSE_CONTACT } from '../config.ts'
import { useContenu, useLangue, cheminLangue } from '../i18n/contexte.ts'

export function Contact() {
  const contenu = useContenu()
  const { langue } = useLangue()
  const accueil = cheminLangue(langue)

  return (
    <>
      <a className="saut-contenu" href="#contenu">
        {contenu.general.sautContenu}
      </a>

      <div className="fond" aria-hidden="true" />

      <main id="contenu" className="section">
        <div className="bande bande--texte pile pile--6">
          {/* Le retour se fait par la marque, comme partout ailleurs sur le site. */}
          <a className="marque" href={accueil}>
            <LogoBus className="marque__logo" />
            <span>{contenu.general.marque}</span>
          </a>

          <div className="pile pile--3">
            <h1>{contenu.contact.titre}</h1>
            <p className="chapeau">{contenu.contact.intro}</p>
          </div>

          {/*
           * L'adresse, en clair et avant tout le reste. C'est le seul chemin qui ne
           * dépend de rien — ni de JavaScript, ni d'un logiciel de courrier associé, ni
           * de la politique de sécurité. Le formulaire n'en est qu'un raccourci.
           */}
          <div className="contact-direct pile pile--2">
            <h2>{contenu.contact.directTitre}</h2>
            <p className="texte-doux">{contenu.contact.directTexte}</p>
            <p>
              <a className="contact-direct__adresse" href={`mailto:${ADRESSE_CONTACT}`}>
                <Icone nom="courrier" className="lien__icone" />
                {ADRESSE_CONTACT}
              </a>
            </p>
          </div>

          <FormulaireContact />

          {/*
           * Ce que devient un message reçu. Court, et vrai : décrire un traitement plus
           * lourd que celui qui a lieu serait ici le seul mensonge possible.
           */}
          <p className="texte-doux">{contenu.contact.note}</p>

          <div className="rangee">
            <a className="bouton bouton--discret" href={accueil}>
              {contenu.contact.retour}
            </a>
          </div>

          <div className="rangee">
            <ChoixLangue />
            <ChoixTheme />
          </div>
        </div>
      </main>
    </>
  )
}
