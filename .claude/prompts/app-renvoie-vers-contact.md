# Prompt à donner au Claude de `../bus-scolaire-beckerich`

> À utiliser **après** que la page de contact de la vitrine est en ligne, pas avant : le
> lien doit exister le jour où l'application le pose. Vérifier d'abord que
> `https://www.schoulbus.lu/contact/` répond.

---

L'application n'offre aucun moyen d'écrire à qui la fait. La vitrine `schoulbus.lu` en a
un désormais, et l'application doit y renvoyer plutôt que d'en construire un second.

**La règle, et elle passe avant la commodité : un seul formulaire de contact pour les deux
dépôts.** Deux formulaires, ce sont deux adresses de destination, deux protections
anti-spam à maintenir, et deux endroits où une personne peut écrire sans que l'autre le
sache. C'est exactement la duplication qui a produit les trois erreurs des maquettes
redessinées, en son temps.

**Ce qu'il faut faire.**

1. Ajouter une entrée « Contact » — libellé dans les cinq langues, via les dictionnaires
   `src/i18n/*.json`, jamais en dur — là où l'application place déjà ses pages
   d'information (crédits, limites, indépendance). Suis le motif existant : ne pas inventer
   un emplacement.
2. Elle mène à la page de la vitrine, **dans la langue de l'application** :
   `https://www.schoulbus.lu/contact/` pour le français, puis
   `/de/contact/`, `/lb/contact/`, `/pt/contact/`, `/en/contact/`. La règle est celle de la
   vitrine : le français est à la racine, les autres langues sous leur segment. Construire
   l'adresse depuis la langue courante, en un seul endroit du code — pas cinq liens
   recopiés.
3. Lien externe, donc les attributs qui vont avec (`rel`, cible), selon ce que
   l'application fait déjà de ses autres liens sortants. Recopie son motif.

**Le point à trancher, et il est réel : l'application fonctionne hors ligne.** Un lien vers
un site distant échoue sans réseau, silencieusement, et l'application est précisément
conçue pour marcher dans un couloir d'école sans signal. Deux options, à toi de choisir en
regardant le code :

- **Poser à côté du lien l'adresse `admin@schoulbus.lu` en clair.** Elle reste lisible et
  copiable hors ligne, et c'est déjà ce que la vitrine fait sous son formulaire pour la
  même raison. **C'est l'option recommandée** : une ligne de texte, aucune dépendance.
- Détecter l'absence de réseau et afficher l'adresse à la place du lien. Plus juste en
  apparence, mais cela ajoute un état à tenir et à tester pour un gain mince.

**Si, et seulement si**, le renvoi vers la vitrine se révèle impraticable — dis pourquoi
avant d'y renoncer — alors l'application crée sa propre page, avec les MÊMES contraintes
que celle de la vitrine :

- destination `admin@schoulbus.lu`, expéditeur une adresse `@schoulbus.lu` ;
- protection anti-spam **sans service tiers** : leurre invisible, délai minimal de
  remplissage, plafonds de taille, limitation de débit côté serveur. Pas de captcha
  hébergé ailleurs — cela ferait entrer un tiers dans une application qui n'en a aucun ;
- aucun cookie, aucune mesure ;
- l'adresse en clair AVANT le formulaire, pour que la page serve même sans JavaScript ;
- ce que le message emporte, et combien de temps il est gardé, écrit sur la page même.

**Le chemin.** Branche par sujet depuis `dev`, la porte de vérification du projet avant de
proposer, pas de commit sur `dev` ni sur `main`. Les cinq langues bougent ensemble.

**À me redire quand c'est fait** : le libellé retenu dans les cinq langues, et l'endroit
exact où l'entrée a été posée. La vitrine décrit l'application ; si elle doit mentionner
que l'on peut écrire depuis l'application, il faut savoir où cela se trouve.
