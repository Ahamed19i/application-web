# Contenu à fournir

Emplacements marqués `TODO(Ahamed)` dans le code — aucun contenu n'a été inventé à leur place. Liste tenue à jour à chaque phase.

## Phase 2 — système de design

- `src/components/Hero.tsx` (ligne ~93) : phrase de positionnement personnelle sur la page d'accueil. La description factuelle existante (AFI-Université, Tunisie Télécom, virtualisation) a été conservée ; c'est la phrase d'accroche elle-même qui manque.
- `src/components/About.tsx` (ligne ~62) : ta description de ta démarche/philosophie de travail — la phrase générique "automatiser ce qui peut l'être, sécuriser ce qui doit l'être" a été retirée.
- `src/components/Footer.tsx` (ligne ~24) : accroche courte pour le pied de page — la phrase "passionné par l'automatisation, le Cloud et la sécurité des infrastructures" a été retirée.
- `src/components/Contact.tsx` (ligne ~53) : la mention "Réponse garantie en moins de 24h" a été retirée — à ne remettre que si c'est un engagement réel.

*(Section Phase 2 obsolète : `Hero.tsx` a été supprimé lors du changement de direction visuelle vers le style brittanychiang.com — voir plus bas.)*

## Direction finale — accueil style brittanychiang.com

- `src/components/Sidebar.tsx` : phrase courte sur ce que tu construis (remplace le TODO précédent de l'ancien Hero).
- `src/components/About.tsx` : 3 paragraphes — qui tu es et ce qui t'a amené à l'infrastructure ; ce que tu fais en ce moment ; ce que tu fais en dehors de l'informatique.
- `src/components/Parcours.tsx` : nom de l'établissement pour la Licence SRT (2021-2024). Descriptions et technologies de chaque entrée du parcours également en attente (aucune n'a été inventée).
- Contact : la section Contact (formulaire) n'apparaît plus sur le nouvel accueil (voir note ci-dessous) — le formulaire et la route `/api/contact` restent fonctionnels et inchangés, juste sans point d'entrée visible pour l'instant.

## Décision à confirmer avec toi

- L'ancien accueil affichait aussi une liste de **compétences** (Systèmes/Réseaux/Cloud) et des **certifications** (Cisco Networking Basics, CCNA en cours, etc.) — du contenu réel, pas inventé. La nouvelle direction (calquée sur brittanychiang.com) ne prévoit pas cette section sur l'accueil. Je ne l'ai pas replacée ailleurs pour l'instant : dis-moi si tu veux la garder quelque part (à propos ? une page dédiée ?) ou si tu acceptes qu'elle disparaisse du site public pour l'instant.

## Corrections à ne pas réintroduire

- Le projet MPLS/VPN backbone a été réalisé sur **eNSP / Huawei**, pas Cisco IOS — à respecter dans le futur contenu de la page Travaux (étude de cas).
