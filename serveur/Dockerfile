# Le relais de courriel, seul.
#
# Image distincte de celle de la vitrine, et c'est délibéré : la vitrine publiée ne porte
# ni Node ni la moindre dépendance (voir son `Dockerfile`), et ce n'est pas un formulaire
# de contact qui doit la faire changer d'avis. Les deux conteneurs tournent côte à côte,
# nginx proxyfiant `/api/contact` vers celui-ci — même origine, donc rien à ouvrir dans la
# politique de sécurité du contenu.
FROM node:24-alpine

WORKDIR /relais

# Les dépendances d'abord, pour que la couche soit réutilisée tant que le verrou ne bouge
# pas. Même raison que dans le Dockerfile de la vitrine.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.mjs ./

# Ne pas tourner en root. L'image `node` porte déjà cet utilisateur.
USER node

ENV PORT=3000
EXPOSE 3000

# Le service refuse de démarrer si une variable manque ; cette sonde dit à Dokploy de ne
# pas déclarer réussi un déploiement dont le conteneur redémarre en boucle.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/sante').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "index.mjs"]
