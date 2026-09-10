/*
 * La page de contact.
 *
 * Nue, comme les mentions légales et l'indépendance : ni fond animé, ni rideau, ni
 * défilement détourné. On n'y vient que pour trouver une adresse, et elle doit s'afficher
 * tout de suite.
 *
 * L'ADRESSE EST ÉCRITE EN CLAIR, et c'est la seule décision de forme qui compte ici.
 * Elle est lisible sans JavaScript, recopiable à la main, annonçable par un lecteur
 * d'écran, et elle reste vraie le jour où un formulaire viendra s'ajouter au-dessous et
 * tombera en panne. Le lien `mailto:` n'est qu'une commodité posée par-dessus : il n'appelle
 * aucun serveur, et c'est ce qui laisse intacte la promesse de `pied.viePrivee`.
 */
import { LogoBus } from '../composants/LogoBus.tsx'
import { ChoixLangue, ChoixTheme } from '../composants/Selecteurs.tsx'
import { ADRESSE_CONTACT } from '../config.ts'
import { useContenu, useLangue, cheminLangue } from '../i18n/contexte.ts'

/** Un paragraphe par ligne : les corps de texte portent des retours à la ligne signifiants. */
function Corps({ texte }: { texte: string }) {
  return (
    <>
      {texte.split('\n').map((ligne) => (
        <p key={ligne} className="texte-doux">
          {ligne}
        </p>
      ))}
    </>
  )
}

export function Contact() {
  const contenu = useContenu()
  const { langue } = useLangue()
  const accueil = cheminLangue(langue)

  return (
    <>
      <a className="saut-contenu" href="#contenu">
        {contenu.general.sautContenu}
      </a>

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

          <section className="pile pile--2">
            <h2>{contenu.contact.adresseTitre}</h2>
            <p className="texte-doux">{contenu.contact.adresseIntro}</p>
            <p className="contact__adresse">
              <a href={`mailto:${ADRESSE_CONTACT}`}>{ADRESSE_CONTACT}</a>
            </p>
            <p className="texte-doux">{contenu.contact.adresseNote}</p>
          </section>

          <section className="pile pile--2">
            <h2>{contenu.contact.utileTitre}</h2>
            <Corps texte={contenu.contact.utileCorps} />
          </section>

          <section className="pile pile--2">
            <h2>{contenu.contact.limitesTitre}</h2>
            <Corps texte={contenu.contact.limitesCorps} />
          </section>

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
