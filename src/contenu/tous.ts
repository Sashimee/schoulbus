/*
 * Les cinq dictionnaires réunis, en imports statiques.
 *
 * C'est la forme COMMODE, et elle a un coût : qui importe ce module emporte les cinq
 * langues. Deux lecteurs l'assument, parce qu'ils ne sont jamais expédiés au navigateur —
 * le pré-rendu, qui rend les cinq langues d'affilée, et les tests, qui les comparent
 * entre elles. Le navigateur, lui, passe par `src/i18n/registre.ts` et n'en reçoit qu'une.
 *
 * Ne pas importer ce fichier depuis une composante : il ramènerait les quatre autres
 * langues dans le paquet, ce que le registre existe précisément pour éviter.
 */
import type { Contenu, Langue } from './type.ts'
import { fr } from './fr.ts'
import { de } from './de.ts'
import { lb } from './lb.ts'
import { pt } from './pt.ts'
import { en } from './en.ts'

export const CONTENUS: Record<Langue, Contenu> = { fr, de, lb, pt, en }
