-- Migration 001 — ajoute une année aux projets
--
-- Contexte : la table `projects` n'a aucune colonne de date (contrairement à
-- `posts` qui a `created_at`). L'archive /travaux et les pages de détail
-- affichent donc l'année seulement si cette colonne existe et est remplie.
--
-- À exécuter dans Supabase : Dashboard → SQL Editor → New query → Run.
-- Sans risque : la colonne est nullable, rien n'est écrasé.

alter table public.projects
  add column if not exists year smallint;

comment on column public.projects.year is
  'Année de réalisation du projet, affichée dans l''archive et la page de détail.';

-- Rappel RLS : la lecture publique des projets publiés et l'écriture réservée
-- à l'admin restent régies par les policies existantes sur cette table ; ajouter
-- une colonne ne les modifie pas.

-- Ensuite, renseigner l'année de chaque projet depuis l'admin, ou ici :
-- update public.projects set year = 2024 where slug = '...';
