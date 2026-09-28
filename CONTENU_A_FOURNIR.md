# Contenu à fournir

Règle en vigueur : **aucun texte de remplissage ne s'affiche sur le site.**
Quand une donnée manque, l'élément concerné n'est simplement pas rendu, et le
manque est noté ici. Aucun contenu n'est inventé.

## À faire en premier : exécuter les migrations

Dans Supabase → SQL Editor → New query → Run, dans cet ordre :

1. `migrations/002_timeline.sql` — table des étapes du parcours, galerie,
   règles d'accès, bucket de photos, et tes 3 étapes actuelles.
2. `migrations/003_experiences.sql` — table des expériences, leur galerie,
   règles d'accès, et le stage Tunisie Télécom déjà affiché. Elle réutilise le
   bucket `parcours` créé par la 002.

Les deux sont idempotentes : les relancer ne casse rien. Tant qu'elles ne sont
pas exécutées, les sections Parcours et Expérience de l'accueil continuent de
fonctionner (elles retombent sur les mêmes données en dur), mais les écrans
d'admin correspondants sont vides et rien n'est cliquable.

## En attente de ta part

- **Récits et photos du parcours** — chaque étape s'affiche sans récit ni
  galerie tant que tu ne les ajoutes pas depuis l'admin. Une étape sans récit
  ni photo reste visible sur l'accueil mais n'est pas cliquable : elle ne mène
  jamais à une page vide.

- **Contenu du stage Tunisie Télécom** — après la migration 003, l'expérience
  apparaît dans l'admin « Expériences » avec période, intitulé, organisation et
  lieu. Le résumé, les technologies, le récit, les réalisations, les leçons et
  les photos restent vides tant que tu ne les remplis pas ; rien de tout cela ne
  s'affiche à vide. L'expérience ne devient cliquable que quand elle a au moins
  un récit, une réalisation, une photo ou une couverture.

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
- Les photos ne débordent plus : couverture au maximum 760 × 420 px, image dans
  un récit au maximum 380 px de haut, vignettes de galerie toutes à la même
  hauteur (218 px en desktop, 198 px en mobile). Ne pas revenir à des images en
  pleine largeur de page : le texte doit rester l'élément dominant.
- Une mission marquée **client confidentiel** n'enregistre jamais le nom du
  client, même s'il a été saisi avant de cocher la case : l'API le remplace par
  `null`. C'est le résumé, écrit à la main, qui décrit le client.
