-- Sous-titres des récits de projets.
--
-- Ajoute uniquement des lignes « ## Titre » devant certains paragraphes :
-- aucun mot du texte existant n'est modifié. Ces sous-titres alimentent le
-- sommaire « Dans ce projet » et la numérotation des sections, comme sur les
-- articles du journal.
--
-- Idempotent : un projet qui contient déjà un sous-titre n'est pas touché.
-- Supabase → SQL Editor → New query → coller ce fichier → Run.

begin;

update projects
set content =
  replace(replace(replace(replace(content,
    E'\n\nTout commence par la mise en place',
    E'\n\n## Le point de départ : la virtualisation\n\nTout commence par la mise en place'),
    E'\n\nC’est là que Docker entre en jeu.',
    E'\n\n## Docker : déployer vite, partout pareil\n\nC’est là que Docker entre en jeu.'),
    E'\n\nMais le vrai changement d’échelle',
    E'\n\n## Kubernetes : passer à l’échelle\n\nMais le vrai changement d’échelle'),
    E'\n\nCe projet m’a permis de comparer',
    E'\n\n## Docker Compose ou Kubernetes ?\n\nCe projet m’a permis de comparer')
where slug = 'de-la-machine-virtuelle-a-kubernetes-deploiement-dune-application-web-moderne'
  and strpos(content, E'\n## ') = 0;

update projects
set content =
  replace(replace(replace(replace(content,
    E'\n\nTout commence par la construction du backbone.',
    E'\n\n## Construire le backbone opérateur\n\nTout commence par la construction du backbone.'),
    E'\n\nMais le vrai défi réside',
    E'\n\n## Isoler chaque site avec les VPN\n\nMais le vrai défi réside'),
    E'\n\nPour aller encore plus loin',
    E'\n\n## Aller plus loin : eBGP, NAT et multi-AS\n\nPour aller encore plus loin'),
    E'\n\nRésultat : un réseau capable',
    E'\n\n## Le résultat\n\nRésultat : un réseau capable')
where slug = 'conception-dun-reseau-mplsvpn-multisites-simulation-dun-backbone-operateur'
  and strpos(content, E'\n## ') = 0;

update projects
set content =
  replace(replace(replace(replace(content,
    E'\n\nQuelques semaines plus tard',
    E'\n\n## Le résultat : un site en production\n\nQuelques semaines plus tard'),
    E'\n\nCar ce que j’ai construit',
    E'\n\n## Une vraie architecture web moderne\n\nCar ce que j’ai construit'),
    E'\n\nDans ce projet, rien n’est laissé au hasard.',
    E'\n\n## Les étapes du projet\n\nDans ce projet, rien n’est laissé au hasard.'),
    E'\n\nCe projet, c’est la preuve',
    E'\n\n## Ce qu’il faut retenir\n\nCe projet, c’est la preuve')
where slug = 'de-0-budget-a-un-site-en-production-deployer-une-application-web-complete-gratuitement'
  and strpos(content, E'\n## ') = 0;

-- Contrôle : chaque projet doit afficher 4 sous-titres.
select slug,
       (length(content) - length(replace(content, E'\n## ', ''))) / length(E'\n## ') as sous_titres
from projects
order by id;

commit;
