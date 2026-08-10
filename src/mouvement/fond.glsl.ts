/*
 * Le nuage du fond, en GLSL.
 *
 * Ce qu'il dessine : le même dégradé que l'application — ancré en haut à gauche, comme
 * `--degrade` l'est à `15% 0%` — mais lentement déformé, avec deux halos qui dérivent.
 * Ce n'est pas une image plaquée par-dessus la charte, c'est la charte qui respire.
 *
 * Trois décisions valent d'être expliquées :
 *
 * 1. Bruit de valeur, pas de Perlin ni de simplex. Un fond flou n'a pas besoin de la
 *    qualité d'un simplex : à cette échelle et avec ce flou, personne ne distingue les
 *    deux, et le bruit de valeur coûte trois fois moins cher par pixel — ce qui décide
 *    de la fluidité sur un portable modeste.
 *
 * 2. Déformation du domaine (« domain warping »). Un fbm brut donne des nuages ; un fbm
 *    dont on déforme les coordonnées par un autre fbm donne ces filaments d'aurore qui
 *    s'étirent. C'est deux passes de plus, et c'est tout l'effet.
 *
 * 3. Tramage à la fin. Sans lui, un dégradé aussi peu contrasté que celui-ci se découpe
 *    en bandes visibles sur tout écran 8 bits — exactement le défaut que la maquette
 *    reprochait aux dégradés plaqués. Un bruit d'un demi-niveau, ajouté juste avant la
 *    sortie, les dissout.
 *
 * ATTENTION — AUCUN ACCENT GRAVE DANS LE CODE NI DANS LES COMMENTAIRES CI-DESSOUS.
 * Le GLSL vit dans un littéral de gabarit : un accent grave, même au milieu d'une phrase
 * en français, le referme. L'erreur qui en résulte est un « Cannot assign to this
 * expression » à la première ligne du fichier, qui ne dit rien de sa vraie cause.
 */

export const SOMMET = /* glsl */ `#version 300 es
/*
 * Aucun tampon de géométrie : trois sommets déduits de leur propre indice couvrent
 * l'écran. Un triangle unique plutôt qu'un quadrilatère — la diagonale d'un quad fait
 * calculer deux fois les pixels qui la longent.
 */
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

export const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_temps;
uniform vec2  u_pointeur;   // -1..1, déjà lissé côté JavaScript
uniform vec3  u_c0;         // arrêt clair du dégradé (coin haut-gauche)
uniform vec3  u_c1;         // arrêt médian
uniform vec3  u_c2;         // arrêt sombre (coin bas-droit)
uniform vec3  u_accent;
uniform float u_intensiteAccent;

out vec4 couleur;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float bruit(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Lissage cubique : sans lui, les carrés de la grille se voient.
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float somme = 0.0;
  float amplitude = 0.5;
  // Quatre octaves. La cinquième n'ajoute que du grain, que le tramage recouvre ensuite.
  for (int i = 0; i < 4; i++) {
    somme += amplitude * bruit(p);
    p *= 2.03;          // pas exactement 2 : évite que les octaves s'alignent
    amplitude *= 0.5;
  }
  return somme;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  // Corrigé du rapport d'écran, sinon les filaments s'écrasent en format paysage.
  vec2 p = uv * vec2(u_resolution.x / u_resolution.y, 1.0);

  float t = u_temps * 0.012;

  // Déformation du domaine : q déplace r, r décide de la couleur.
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(
    fbm(p + 2.4 * q + vec2(1.7, 9.2) + 0.35 * t),
    fbm(p + 2.4 * q + vec2(8.3, 2.8) - 0.28 * t)
  );
  float n = fbm(p + 2.0 * r);

  /*
   * L'ancrage du dégradé. L'application place le sien à 15% 0% ; le pointeur ne fait
   * que le déplacer de quelques pour cent — assez pour que la page réagisse à la main,
   * trop peu pour qu'on puisse « pousser » le fond.
   */
  vec2 ancre = vec2(0.15, 0.0) + u_pointeur * 0.04;

  /*
   * La distance est divisée par l'étendue du dégradé CSS — 120% en largeur, 80% en
   * hauteur — pour que d = 1 tombe exactement là où le radial-gradient atteint son
   * dernier arrêt. Sans cette division, la chute était bien plus rapide qu'en CSS et le
   * nuage rendait une page presque noire là où la charte donne un bleu nuit.
   */
  vec2 rel = (uv - ancre) / vec2(1.2, 0.8);
  float d = length(rel);

  // Le dégradé de base — mêmes arrêts que --degrade : 0 %, 45 %, 100 %.
  vec3 base = mix(u_c0, u_c1, smoothstep(0.0, 0.45, d));
  base = mix(base, u_c2, smoothstep(0.45, 1.0, d));
  base = mix(base, mix(u_c1, u_c0, n), 0.3 * (1.0 - smoothstep(0.0, 0.9, d)));

  /*
   * Les deux halos d'accent. Ils reprennent la position des deux radial-gradient que
   * la règle .fond pose en CSS — 88% 2% et -8% 64% — pour que le repli sans WebGL et le
   * nuage animé montrent la même composition, seulement figée d'un côté.
   */
  float halo1 = smoothstep(0.62, 0.0, distance(uv, vec2(0.88, 0.02) + u_pointeur * 0.02));
  float halo2 = smoothstep(0.58, 0.0, distance(uv, vec2(-0.08, 0.64) - u_pointeur * 0.02));
  float halo = (halo1 + halo2 * 0.8) * (0.55 + 0.45 * n);
  base += u_accent * halo * u_intensiteAccent;

  /*
   * Tramage. Un bruit ordonné sur un demi-niveau de quantification, ajouté en dernier :
   * il casse les bandes sans que le grain devienne perceptible.
   */
  float trame = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  couleur = vec4(base + trame, 1.0);
}
`
