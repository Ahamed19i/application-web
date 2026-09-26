# Contenu à fournir

Emplacements marqués `TODO(Ahamed)` dans le code — aucun contenu n'a été inventé à leur place. Liste tenue à jour à chaque phase.

## Accueil style brittanychiang.com (état actuel)

- `src/components/Sidebar.tsx` : phrase courte sur ce que tu construis, sous le titre.
- `src/components/About.tsx` : 3 paragraphes — qui tu es et ce qui t'a amené à l'infrastructure ; ce que tu fais en ce moment ; ce que tu fais en dehors de l'informatique.
- `src/components/Parcours.tsx` : nom de l'établissement pour la Licence SRT (2021-2024).
- `src/components/Experience.tsx` : description concrète du stage Tunisie Télécom, et les technologies réellement utilisées (pastilles vides pour l'instant).
- `src/components/ContactPage.tsx` : phrase d'introduction sur la page /contact.

## Résolu depuis la dernière version

- **Compétences/certifications** : replacées dans un sous-bloc "Compétences" à la fin de la section À propos (pastilles), et les certifications réelles (Cisco Networking Basics, Introduction to Cybersecurity, CCNA en cours, DevOps en cours) sont maintenant des entrées de la section Parcours. Rien n'a été perdu.
- **Contact** : page dédiée `/contact` accessible via le bouton "Me contacter" de la colonne gauche (visible sur toutes les pages). Formulaire existant conservé, branché sur `/api/contact`.

## Corrections à ne pas réintroduire

- Le projet MPLS/VPN backbone a été réalisé sur **eNSP / Huawei**, pas Cisco IOS — à respecter dans le futur contenu de la page Travaux (étude de cas).
