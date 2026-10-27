#!/usr/bin/env bash
set -u
printf 'CODEVERSE PHASE 0 AUDIT\n'
for cmd in node npm git code python3; do if command -v "$cmd" >/dev/null 2>&1; then printf '%-10s ' "$cmd"; "$cmd" --version | head -1; else printf 'MISSING: %s\n' "$cmd"; fi; done
printf '\nUbuntu: '; grep PRETTY_NAME /etc/os-release || true
printf '\nDisk space:\n'; df -h .
printf '\nMemory:\n'; free -h
printf '\nGit user: '; git config --global user.name || true
printf 'Git email configured: '; if [ -n "$(git config --global user.email || true)" ]; then echo yes; else echo no; fi
printf '\nRegistry connection:\n'; npm ping || true
printf '\nMANUAL CHECK: Open Firefox about:support and review WebGL 1/2.\n2D fallback is supported.\n'
