/*
 * La confidentialité.
 *
 * C'est le premier principe du projet, et donc la section qui a le droit d'être la plus
 * affirmative de la page. Elle reste néanmoins vérifiable : chaque point décrit un
 * mécanisme précis — le stockage local, le jeu d'adresses embarqué, le fragment d'URL —
 * et non une intention. Le code est public, tout cela se relit.
 */
import { Icone, type NomIcone } from '../composants/Icones.tsx'
import { SchemaConfidentialite } from '../composants/SchemaConfidentialite.tsx'
import { useContenu } from '../i18n/contexte.ts'
import { Revele } from '../mouvement/Revele.tsx'

const ICONES: NomIcone[] = ['cadenas', 'loupe', 'diese']

export function Confidentialite() {
  const contenu = useContenu()

  return (
    <section className="section" id="confidentialite">
      <div className="bande">
        <Revele className="entete-section">
          <span className="etiquette etiquette--accent">{contenu.confidentialite.etiquette}</span>
          <h2>{contenu.confidentialite.titre}</h2>
          <p className="chapeau">{contenu.confidentialite.chapeau}</p>
        </Revele>

        <div className="confid__grille">
          <Revele geste="glisse">
            <SchemaConfidentialite legende={contenu.confidentialite.legendeSchema} />
          </Revele>

          <ul className="confid__liste">
            {contenu.confidentialite.points.map((p, i) => (
              <Revele key={p.titre} as="li" rang={i} className="confid__point">
                <span className="puce">
                  <Icone nom={ICONES[i] ?? 'cadenas'} />
                </span>
                <div>
                  <h3>{p.titre}</h3>
                  <p>{p.texte}</p>
                </div>
              </Revele>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
