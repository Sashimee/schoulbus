/*
 * Le jeu de fonctionnalités de `motion`, isolé pour pouvoir être chargé à part.
 *
 * `LazyMotion` sait recevoir une fonction qui rendra les fonctionnalités plus tard. Encore
 * faut-il qu'elles vivent dans un module que le compilateur puisse détacher : écrit
 * `import('motion/react')`, l'import dynamique retombe sur le module que six sections
 * importent déjà en tête de fichier, et rien n'est détaché du tout.
 *
 * Ce fichier n'existe donc que pour porter un seul export, et pour donner à l'import
 * dynamique une cible qui lui appartienne.
 */
export { domAnimation as default } from 'motion/react'
