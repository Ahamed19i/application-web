# Contenu à fournir

Règle en vigueur : **aucun texte de remplissage ne s'affiche sur le site.**
Quand une donnée manque, l'élément concerné n'est simplement pas rendu, et le
manque est noté ici. Aucun contenu n'est inventé.

## À faire en premier : exécuter la migration du parcours

`migrations/002_timeline.sql` crée la table des étapes, la galerie, les règles
d'accès et le bucket de photos, et y insère tes 3 étapes actuelles. Tant qu'elle
n'est pas exécutée, la section Parcours de l'accueil continue de fonctionner
(elle retombe sur les mêmes données en dur), mais l'admin « Parcours » sera vide
et aucune étape ne sera cliquable.

## En attente de ta part

- **Récits et photos du parcours** — chaque étape s'affiche sans récit ni
  galerie tant que tu ne les ajoutes pas depuis l'admin. Une étape sans récit
  ni photo reste visible sur l'accueil mais n'est pas cliquable : elle ne mène
  jamais à une page vide.

- **Description du stage Tunisie Télécom** (`src/components/Experience.tsx`) —
  l'entrée s'affiche avec période, intitulé, organisation et lieu ; la
  description et les pastilles de technologies restent masquées tant que tu ne
  les fournis pas. Elles s'afficheront automatiquement dès que les champs
  `description` et `stack` de l'entrée seront remplis.

- **Année des projets** — la table Supabase `projects` n'a aucune colonne de
  date, contrairement à `posts`. La colonne « Année » de l'archive `/travaux` et
  la ligne « Année » des pages projet sont donc masquées. La migration
  `migrations/001_projects_add_year.sql` ajoute le champ : exécute-la dans
  Supabase (SQL Editor), puis renseigne l'année de chaque projet depuis l'admin.
  L'affichage s'active tout seul.

- **Catégories de projets à homogénéiser** — la base contient `DevOps/Cloud` et
  `Cloud/DevOps`, deux libellés pour la même chose. À corriger depuis l'admin
  (je ne modifie pas tes données).

## Contenus fournis et intégrés

- Phrase de présentation, texte complet de la section À propos (5 paragraphes),
  parcours (Master 2 AFI-L'UE, Licence Génie Logiciel Tunis, Baccalauréat GS
  Avenir), expérience (stage Tunisie Télécom), certifications.

## Corrections à ne pas réintroduire

- Le projet MPLS/VPN a été réalisé sur **eNSP (Huawei)**, jamais « Cisco IOS ».
- L'ancienne entrée de parcours « Licence SRT » était fausse : c'est une
  **Licence en Génie Logiciel et Systèmes d'Information**.
- Le nom affiché dans la colonne de gauche est **Ahamed Hassani** (sur une
  ligne). Le nom complet **Ahamed Hassani Mhoma** reste dans le titre de
  l'onglet, les métadonnées SEO et le pied de page.
