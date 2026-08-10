/*
 * L'application, rejouée à l'intérieur de la maquette.
 *
 * Quatre écrans, un par temps du récit. Ils ne sont pas des captures : ce sont des
 * reconstructions, aux mêmes jetons et aux mêmes formes que l'application réelle. Une
 * capture aurait vieilli au premier déploiement et se serait affichée floue sur écran
 * dense ; ceci suit la charte automatiquement, thème clair compris.
 *
 * Rien ici n'invente une capacité que l'application n'a pas. Les heures viennent d'une
 * journée plausible du plan officiel, l'arrêt existe (`arrets.json`), et aucun écran ne
 * montre de position de bus en direct — l'application ne sait pas où est le bus.
 */
import { CHIFFRES } from '../contenu/chiffres.ts'
import { ECRANS } from '../contenu/ecrans.ts'
import { useLangue } from '../i18n/contexte.ts'
import { Icone } from './Icones.tsx'

function Rail({ actif }: { actif: 'accueil' | 'enfants' | 'plan' | 'reglages' }) {
  const { langue } = useLangue()
  const t = ECRANS[langue].rail

  const entrees = [
    { cle: 'accueil', icone: 'accueil', texte: t.accueil },
    { cle: 'enfants', icone: 'enfants', texte: t.enfants },
    { cle: 'plan', icone: 'plan', texte: t.plan },
    { cle: 'reglages', icone: 'reglages', texte: t.reglages },
  ] as const

  return (
    <div className="ecran__rail">
      {entrees.map((e) => (
        <div key={e.cle} className="ecran__rail-item" data-actif={e.cle === actif ? 'oui' : 'non'}>
          <Icone nom={e.icone} />
          <span>{e.texte}</span>
        </div>
      ))}
    </div>
  )
}

function Entete({ titre }: { titre?: string }) {
  const { langue } = useLangue()
  const t = ECRANS[langue]
  return (
    <div className="ecran__entete">
      <span className="ecran__marque">{titre ?? t.marque}</span>
      <span className="etiquette">{CHIFFRES.anneeScolaire}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 1 · Le plan officiel — dense, juste, et pas fait pour un seul enfant
 * ------------------------------------------------------------------ */
export function EcranPlan() {
  const { langue } = useLangue()
  const t = ECRANS[langue]

  // Des heures réelles du plan, volontairement présentées en bloc : c'est justement
  // l'effet « cinq pages de tableaux » que le récit décrit à ce moment-là.
  const lignes = [
    ['06:55', 'Elvange'],
    ['07:02', 'Hovelange'],
    ['07:08', 'Levelange'],
    ['07:12', 'Huttange'],
    ['07:18', 'Noerdange'],
    ['07:24', 'Beckerich'],
    ['07:31', 'Oberpallen'],
    ['07:38', 'Schweich'],
  ]

  return (
    <div className="ecran">
      <Entete titre={t.planOfficiel} />
      <div className="ecran__corps">
        <div className="ecran__carte">
          <div className="ecran__titre">
            {t.ligne} 1 · {t.aller}
          </div>
          <div>
            {lignes.map(([heure, lieu]) => (
              <div key={lieu} className="ecran__trajet">
                <span className="ecran__trajet-heure">{heure}</span>
                <span className="ecran__trajet-lieu">{lieu}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ecran__carte">
          <div className="ecran__titre">
            {CHIFFRES.lignes} × {t.ligne} · {CHIFFRES.arrets} {t.arretsDesservis}
          </div>
        </div>
      </div>
      <Rail actif="plan" />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 2 · La configuration — une fois, puis plus jamais
 * ------------------------------------------------------------------ */
export function EcranConfigurer() {
  const { langue } = useLangue()
  const t = ECRANS[langue]

  const champs = [
    { libelle: t.adresse, valeur: '12, rue de Huttange' },
    { libelle: t.prenom, valeur: t.enfant },
    { libelle: t.cycle, valeur: '3.1' },
  ]

  return (
    <div className="ecran">
      <Entete />
      <div className="ecran__corps">
        <div className="ecran__titre">{t.etape(2, 4)}</div>
        {/* La barre de progression de l'assistant : quatre crans, deux franchis. */}
        <div className="ecran__progression">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="ecran__pas" data-franchi={i < 2 ? 'oui' : 'non'} />
          ))}
        </div>
        {champs.map((c) => (
          <div key={c.libelle} className="ecran__carte">
            <div className="ecran__titre">{c.libelle}</div>
            <div>{c.valeur}</div>
          </div>
        ))}
        <div className="ecran__carte ecran__carte--accent">
          <div className="ecran__titre">{t.arret}</div>
          <div>{t.aFied(4)}</div>
        </div>
      </div>
      <Rail actif="enfants" />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 3 · Aujourd'hui — l'écran du matin, et le seul qui compte à sept heures
 * ------------------------------------------------------------------ */
export function EcranAujourdhui({ perturbation = false }: { perturbation?: boolean }) {
  const { langue } = useLangue()
  const t = ECRANS[langue]

  return (
    <div className="ecran">
      <Entete />
      <div className="ecran__corps">
        {perturbation && (
          <div className="ecran__carte ecran__carte--alerte">
            <div className="ecran__titre">{t.perturbation}</div>
            <div>{t.perturbationTexte}</div>
          </div>
        )}

        <div className="ecran__carte ecran__carte--accent">
          <div className="ecran__titre">{t.prochainDepart}</div>
          <div className="ecran__prochain">
            <span className="ecran__heure">07:12</span>
            <span className="ecran__signal" />
            <span className="ecran__delai">{t.dans(8)}</span>
          </div>
          <div className="ecran__delai">
            {t.enfant} · {t.arret} · {t.aFied(4)}
          </div>
        </div>

        <div className="ecran__carte">
          <div className="ecran__titre">{t.retour}</div>
          <div className="ecran__trajet">
            <span className="ecran__trajet-heure">12:05</span>
            <span className="ecran__trajet-lieu">{t.ecole}</span>
          </div>
          <div className="ecran__trajet">
            <span className="ecran__trajet-heure">16:10</span>
            <span className="ecran__trajet-lieu">{t.ecole}</span>
          </div>
        </div>
      </div>
      <Rail actif="accueil" />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 4 · La semaine — ce qui suit, une fois l'heure du matin réglée
 * ------------------------------------------------------------------ */
export function EcranSemaine() {
  const { langue } = useLangue()
  const t = ECRANS[langue]

  const semaine = [
    { jour: t.jours[0], heure: '07:12' },
    { jour: t.jours[1], heure: '07:12' },
    // Mercredi : la desserte de midi change, et l'heure du matin avec elle.
    { jour: t.jours[2], heure: '07:12' },
    { jour: t.jours[3], heure: '07:12' },
    { jour: t.jours[4], heure: '07:12' },
  ]

  return (
    <div className="ecran">
      <Entete titre={t.semaineDe} />
      <div className="ecran__corps">
        <div className="ecran__carte">
          <div className="ecran__titre">{t.aller}</div>
          <div className="ecran__semaine">
            {semaine.map((j, i) => (
              <div key={j.jour} className="ecran__jour" data-aujourdhui={i === 1 ? 'oui' : 'non'}>
                <div className="ecran__jour-nom">{j.jour}</div>
                <div className="ecran__jour-heure">{j.heure}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ecran__carte">
          <div className="ecran__titre">{t.retour}</div>
          <div className="ecran__semaine">
            {[
              { jour: t.jours[0], heure: '16:10' },
              { jour: t.jours[1], heure: '16:10' },
              { jour: t.jours[2], heure: '12:05' },
              { jour: t.jours[3], heure: '16:10' },
              { jour: t.jours[4], heure: '16:10' },
            ].map((j, i) => (
              <div key={j.jour} className="ecran__jour" data-aujourdhui={i === 1 ? 'oui' : 'non'}>
                <div className="ecran__jour-nom">{j.jour}</div>
                <div className="ecran__jour-heure">{j.heure}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Rail actif="accueil" />
    </div>
  )
}
