# Prompt à donner au Claude de `../bus-scolaire-beckerich`

> Contexte : ce fichier vit dans le dépôt de la VITRINE, mais le travail qu'il décrit se
> fait dans le dépôt de l'APPLICATION. Ouvrir une session Claude Code dans
> `bus-scolaire-beckerich` et coller le texte ci-dessous.
>
> Pourquoi il existe : la vitrine est devenue plus précise que l'application qu'elle
> décrit. C'est l'inverse du défaut habituel, mais c'est un écart, et il se répare là-bas.

---

La page « Limites » de cette application ne nomme pas une donnée qui sort bel et bien de
l'appareil, et il faut qu'elle la nomme.

**Le fait.** Quand un parent écrit ses trajets dans Google Agenda, l'application envoie le
**prénom de l'enfant** chez Google, dans le titre de l'événement. Trois points à
revérifier avant d'écrire quoi que ce soit — ne me crois pas sur parole, les numéros de
ligne ont pu bouger :

- `src/lib/agenda/evenements.ts` — le titre d'événement est construit comme
  `` `${prenom} — ${libelleTrajet}` `` (cherche le gabarit, pas la ligne).
- `src/lib/agenda/google.ts` — ce titre part en `summary`, l'arrêt part en `location`.
- Le paquet servi par `app.schoulbus.lu` porte un identifiant client Google réel :
  **l'intégration est active en production**, ce n'est pas du code dormant.

**Ce que la page dit aujourd'hui.** Dans `src/i18n/fr.json`, la limite
`limites.donneesCorps` énumère avec soin ce qui sort : le compteur de visites, le fragment
du lien de partage, l'identifiant d'appareil des notifications, les tuiles OpenStreetMap et
la zone qu'elles révèlent. Elle finit par « mais ni votre adresse, ni les prénoms ». Cette
dernière proposition est **fausse dès qu'un parent se connecte à Google Agenda**, et elle
est fausse dans les cinq langues.

**Ce qu'il faut faire.**

1. Vérifier les trois points ci-dessus dans le code, et **mesurer l'étendue réelle** : le
   prénom part-il aussi par le fichier `.ics` ? par le lien « Agenda : Google, Apple,
   Outlook » ? Un `.ics` téléchargé ne sort pas de l'appareil, mais un lien qui le fait
   générer ailleurs, oui. Établis la liste exacte avant de rédiger.
2. Corriger `limites.donneesCorps` dans **les cinq langues** (`src/i18n/{fr,de,lb,pt,en}.json`)
   pour que l'export vers Google Agenda y figure nommément : ce qui part (le prénom, le
   libellé du trajet, l'arrêt, les horaires), chez qui (Google), et **à quel moment** — à
   savoir seulement si le parent connecte son compte, ce qui est une action volontaire.
   C'est cette dernière précision qui rend la phrase exacte sans l'affoler.
3. Ne pas se contenter d'ôter « ni les prénoms ». Retirer une affirmation fausse la rend
   muette, pas honnête : la page ÉNUMÈRE ce qui sort, donc l'omission se lirait comme une
   négation.
4. Vérifier si la même promesse est reprise ailleurs — écran d'accueil, page
   « Indépendance », `meta description`, texte de consentement de la connexion Google. Une
   phrase corrigée en un seul endroit laisse la version fausse en circulation.

**Le registre.** Celui du reste de la page : énoncer la situation, puis ce que le logiciel
en fait. Pas de mise en garde dramatisée — c'est une fonction que le parent a demandée,
pas une fuite. Et pas de litote non plus.

**Ce qui dépend de ce travail, ailleurs.** La vitrine `schoulbus.lu` affiche « 0 » donnée
de famille qui part sans qu'on le demande, et la note qui CADRE ce zéro nomme déjà les
trois choses qui sortent, dont ce prénom. Le zéro est donc vrai côté vitrine. Quand tu
auras corrigé ici, dis-le : la vitrine cite la page « Limites » de l'application comme
source, et les deux doivent raconter la même chose.

**Le chemin.** Le flux de branches de ce dépôt s'applique — branche par sujet depuis
`dev`, la porte de vérification du projet avant de proposer, pas de commit sur `dev` ni
sur `main`. Les cinq langues bougent ensemble ou pas du tout.
