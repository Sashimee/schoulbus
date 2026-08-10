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
RUN npm ci

COPY . .

# L'origine publique entre dans les métadonnées de partage, qui exigent des URL absolues ;
# elle doit donc être connue à la construction et non au démarrage.
ARG URL_PUBLIQUE=https://schoulbus.lu
ARG BASE_PATH=/
# La date du dernier changement de contenu, pour `lastmod` du plan du site. Le dépôt Git
# n'est pas copié ici — sans cette valeur, `prerendu.mjs` omet la balise plutôt que
# d'inscrire la date de construction, qui ne voudrait rien dire (voir son commentaire).
ARG DATE_CONTENU

ENV URL_PUBLIQUE=$URL_PUBLIQUE \
    BASE_PATH=$BASE_PATH \
    DATE_CONTENU=$DATE_CONTENU

# `verifier` avant `build` : types, lint, tests, contrastes et dérive des jetons. Une
# image ne doit pas pouvoir être publiée si l'un d'eux tombe.
RUN npm run verifier && npm run build

# Précompression. Le contenu est statique et ne changera plus : le comprimer une fois ici
# donne un meilleur taux que ce que nginx obtiendrait à la volée, et ne coûte rien à
# chaque visite. Niveau 9 pour gzip, 11 pour brotli — on a tout le temps.
RUN apk add --no-cache brotli && \
    find dist -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' \) \
      -exec gzip -9 -k {} \; -exec brotli -q 11 -k {} \;

# ---------------------------------------------------------------------------
# 2. Service
# ---------------------------------------------------------------------------
# `nginx:alpine` porte déjà `ngx_http_gzip_static_module`. Brotli n'y est pas : les
# fichiers `.br` sont produits quand même, et servis par le bloc `location` prévu à cet
# effet dès que l'image de base en disposera. Ils ne gênent pas en attendant.
FROM nginx:alpine AS service

COPY --from=construction /vitrine/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-entetes.conf /etc/nginx/snippets/entetes.conf

# Dokploy considère un conteneur en bonne santé ou non ; sans cette sonde, un
# déploiement cassé se déclarerait réussi.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

EXPOSE 80
