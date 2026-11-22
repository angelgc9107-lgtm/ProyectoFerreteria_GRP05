#!/usr/bin/env bash
# Uso (desde la raíz del repo): bash poner-numero-issue.sh 170
set -e
N="$1"; F="docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md"
[[ "$N" =~ ^[0-9]+$ ]] || { echo "Pasá el número de la issue, ej: 170"; exit 1; }
sed -i "s/completar número/#$N/g; s/| \*\*Pendiente\*\* | Falta crear la issue de seguimiento de \`script.js\` \/ \`StorageUtil\` |/| **Cumplido** | Issue #$N de seguimiento de \`script.js\` \/ \`StorageUtil\` |/" "$F"
grep -n "#$N" "$F"
