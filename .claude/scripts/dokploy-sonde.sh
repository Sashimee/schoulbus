#!/usr/bin/env bash
#
# Sonde Dokploy — LECTURE SEULE.
#
# Elle existe pour une raison précise : le jour où le site ne répond plus, la question est
# « où sont les domaines, et sur quelle branche construit le service », et y répondre à la
# main demande de retrouver quatre identifiants opaques. Ils sont ici.
#
# ELLE N'IMPRIME NI LE JETON NI AUCUNE VALEUR D'ENVIRONNEMENT — seulement les NOMS des
# variables posées. Le jeton est lu dans un fichier hors du dépôt, jamais passé en argument :
# un argument se retrouve dans l'historique du shell et dans `ps`.
#
# Elle n'écrit rien et n'appelle aucun point d'entrée qui modifie quoi que ce soit.
set -uo pipefail

JETON_FICHIER="${DOKPLOY_JETON:-$HOME/.config/dokploy/seil.token}"
BASE="${DOKPLOY_BASE:-https://dok.seil.pro}"
COMPOSE='acBUIALG8_vIB9wUDO-_L'
# L'ancienne vitrine, gardée en filet après la bascule du 14 septembre 2026.
ANCIENNE='-UfP8R3W-xx7o9U-usoPi'

[ -r "$JETON_FICHIER" ] || { echo "Jeton introuvable : $JETON_FICHIER"; exit 1; }
T=$(tr -d '\r\n' < "$JETON_FICHIER")

lire() { curl -s -m 20 -H "x-api-key: $T" "$BASE$1"; }

service=$(lire "/api/compose.one?composeId=$COMPOSE")

echo "== Le service, sa branche, ses variables (NOMS seulement) =="
printf '%s' "$service" | python3 -c '
import json, sys
d = json.load(sys.stdin)
for cle in ("name", "appName", "branch", "repository", "composeStatus", "autoDeploy"):
    print("  %-14s %s" % (cle, d.get(cle)))
noms = [l.split("=")[0] for l in (d.get("env") or "").splitlines() if "=" in l]
print("  %-14s %d posées : %s" % ("variables", len(noms), ", ".join(noms)))
' || echo "  (réponse illisible)"

appName=$(printf '%s' "$service" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("appName",""))' 2>/dev/null)

echo
echo "== Les conteneurs =="
lire "/api/docker.getContainersByAppNameMatch?appName=$appName" | python3 -c '
import json, sys
for c in json.load(sys.stdin):
    print("  %s  %s  |  %s" % (c.get("name"), c.get("state"), c.get("status")))
' || echo "  (réponse illisible)"

echo
echo "== Les domaines, et QUI les porte =="
for paire in "le compose:domain.byComposeId?composeId=$COMPOSE" \
             "l ancienne application:domain.byApplicationId?applicationId=$ANCIENNE"; do
  echo "  ${paire%%:*}"
  lire "/api/${paire#*:}" | python3 -c '
import json, sys
d = json.load(sys.stdin)
if not d:
    print("      aucun")
for x in d:
    print("      %s  service=%s  port=%s  https=%s  middlewares=%s"
          % (x.get("host"), x.get("serviceName"), x.get("port"), x.get("https"),
             x.get("middlewares")))
' || echo "      (réponse illisible)"
done

echo
echo "== Les cinq derniers déploiements =="
lire "/api/deployment.allByCompose?composeId=$COMPOSE" | python3 -c '
import json, sys
for x in json.load(sys.stdin)[:5]:
    print("  %s  %-9s %s" % (x.get("createdAt"), x.get("status"),
                             (x.get("description") or "")[:60]))
' || echo "  (réponse illisible)"
