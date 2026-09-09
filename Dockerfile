# Construction, puis service. Deux étapes, pour que l'image publiée ne porte ni Node,
# ni les 180 paquets de développement — seulement une trentaine de fichiers et nginx.

# ---------------------------------------------------------------------------
# 1. Construction
# ---------------------------------------------------------------------------
# Node 24 et non 25 : `jsdom`, dont dépendent les tests, déclare
# `^22.22.2 || ^24.15.0 || >=26`. La 25 passe en avertissant, ce qui est exactement le
# genre de détail qu'on ne veut pas découvrir dans une construction distante.
FROM node:24-alpine AS construction

WORKDIR /vitrine

# Les dépendances d'abord, seules : tant que `package-lock.json` ne bouge pas, cette
# couche est réutilisée et l'installation ne recommence pas à chaque changement de style.
COPY package.json package-lock.json ./
# Playwright ne sert qu'à engendrer les captures, et les captures sont versionnées : les
# refaire ici serait à la fois inutile et impossible (il faudrait le dépôt de
# l'application). Sans cette variable, `npm ci` téléchargerait tout de même ~150 Mo de
# Chromium dans cette couche. Même règle que les vignettes de partage.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm ci

COPY . .

# `git` pour la seule date du dernier changement de contenu (voir `DATE_CONTENU` plus bas).
# Il ne sert qu'à cette étape et ne part pas dans l'image publiée.
RUN apk add --no-cache git

# L'origine publique entre dans les métadonnées de partage, qui exigent des URL absolues ;
# elle doit donc être connue à la construction et non au démarrage.
ARG URL_PUBLIQUE=https://www.schoulbus.lu
ARG BASE_PATH=/
# La date du dernier changement de contenu, pour `lastmod` du plan du site.
#
# C'était une valeur À PENSER À POSER, et personne ne la posait : `.dockerignore` excluait
# `.git`, Dokploy ne passait pas l'argument, et `prerendu.mjs` — qui préfère aucune balise
# à une date fausse — n'écrivait donc jamais de `lastmod` en production. Un réglage dont
# l'oubli est silencieux et permanent n'est pas un réglage, c'est un défaut.
#
# Le dépôt est maintenant dans le contexte de construction et le script lit la date du
# dernier commit qui a touché le contenu, comme sur une machine de développement. Cet
# argument reste, pour construire depuis une archive sans historique.
ARG DATE_CONTENU

ENV URL_PUBLIQUE=$URL_PUBLIQUE \
    BASE_PATH=$BASE_PATH \
    DATE_CONTENU=$DATE_CONTENU

# `verifier` avant `build` : types, lint, tests, contrastes et dérive des jetons. Une
# image ne doit pas pouvoir être publiée si l'un d'eux tombe.
RUN npm run verifier && npm run build

# Précompression. Le contenu est statique et ne changera plus : le comprimer une fois ici
# donne un meilleur taux que ce que nginx obtiendrait à la volée, et ne coûte rien à
# chaque visite. Niveau 9 — on a tout le temps.
#
# GZIP SEUL. Cette étape passait aussi `brotli -q 11` sur les mêmes fichiers, pour un bloc
# `location` qui n'a jamais existé : `nginx:alpine` ne sait pas servir de `.br`, et une
# requête `Accept-Encoding: br` recevait donc 27 472 octets non comprimés là où
# `gzip_static` en rend 6 594. On payait la compression la plus lente à chaque
# construction pour des fichiers que personne ne recevait. Le jour où l'image de base
# saura les servir, c'est une ligne ici et une ligne dans `nginx.conf` — dans cet ordre.
RUN find dist -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' \) \
      -exec gzip -9 -k {} \;

# ---------------------------------------------------------------------------
# 2. Service
# ---------------------------------------------------------------------------
# `nginx:alpine` porte déjà `ngx_http_gzip_static_module`, et c'est tout ce dont ce site a
# besoin. Brotli n'y est pas — voir l'étape de précompression ci-dessus.
FROM nginx:alpine AS service

COPY --from=construction /vitrine/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-entetes.conf /etc/nginx/snippets/entetes.conf

# Dokploy considère un conteneur en bonne santé ou non ; sans cette sonde, un
# déploiement cassé se déclarerait réussi.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

EXPOSE 80
