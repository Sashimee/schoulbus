/*
 * Les cinq langues, en ruban.
 *
 * Le ruban défile en boucle par translation d'une piste dupliquée — la moitié sort par
 * la gauche pendant que sa copie entre par la droite, et le raccord est invisible parce
 * que les deux moitiés sont identiques. C'est une animation `transform` pure, à coût
 * constant, et le survol l'arrête pour qui veut lire.
 *
 * Le contenu est dupliqué dans le DOM : la deuxième copie porte `aria-hidden`, sinon un
 * lecteur d'écran énoncerait dix titres pour cinq langues.
 */
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

export function Langues() {
  const contenu = useContenu()
  const mots = contenu.langues.mots

  const piste = (cache: boolean) => (
    <div className="ruban__piste" aria-hidden={cache || undefined}>
      {mots.map((m) => (
        <span key={m.code} className="ruban__mot">
          <span className="ruban__code">{m.code}</span>
          {/* `lang` sur chaque titre : c'est lui qui fait prononcer correctement. */}
          <span lang={m.code}>{m.texte}</span>
        </span>
      ))}
    </div>
  )

  return (
    <section className="section section--serree">
      <div className="bande">
        <Revele className="entete-section">
          <span className="etiquette">{contenu.langues.etiquette}</span>
          <h2>{contenu.langues.titre}</h2>
          <p className="chapeau">{contenu.langues.chapeau}</p>
        </Revele>
      </div>

      {/* Le ruban déborde la bande : c'est ce débordement qui fait qu'il traverse. */}
      <div className="ruban">
        {piste(false)}
        {piste(true)}
      </div>
    </section>
  )
}
