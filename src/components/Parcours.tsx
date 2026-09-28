import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { TimelineEntry, timelineHasStory } from '../types';

/**
 * Repli utilisé tant que la migration 002 n'a pas été exécutée : ce sont
 * exactement les données affichées jusqu'ici, pour que la section ne
 * disparaisse jamais. Dès que la table existe, la base fait autorité.
 */
const FALLBACK_ENTRIES: TimelineEntry[] = [
  {
    slug: 'master-2-srt-afi-lue',
    period_label: '2024 — Aujourd\'hui',
    sort_order: 1,
    title: 'Master 2 Systèmes, Réseaux et Télécommunications',
    institution: 'Université de l\'Entreprise (AFI-L\'UE)',
    city: 'Dakar',
    country: 'Sénégal',
    summary: "Mémoire sur la conception d'une infrastructure hybride résiliente, pensée pour la haute disponibilité des données.",
  },
  {
    slug: 'licence-genie-logiciel-tunis',
    period_label: '2021 — 2024',
    sort_order: 2,
    title: 'Licence en Génie Logiciel et Systèmes d\'Information',
    institution: 'Université Centrale de Tunis',
    city: 'Tunis',
    country: 'Tunisie',
    summary: "Là où j'ai découvert l'informatique.",
  },
  {
    slug: 'baccalaureat-gs-avenir',
    period_label: '2019',
    sort_order: 3,
    title: 'Baccalauréat scientifique, série D',
    institution: 'GS Avenir',
    city: 'Moroni',
    country: 'Comores',
  },
];

const ROW_CLASS =
  'group grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-6 py-5 -mx-4 px-4 rounded-xl transition-colors duration-200 hover:bg-bg-secondary focus-visible:bg-bg-secondary focus-visible:outline-none';

const EntryBody: React.FC<{ entry: TimelineEntry; clickable: boolean }> = ({ entry, clickable }) => {
  const place = [entry.city, entry.country].filter(Boolean).join(', ');
  return (
    <>
      <p className="text-[12px] font-bold uppercase tracking-wider text-text-muted pt-1 leading-snug">
        {entry.period_label}
      </p>
      <div>
        <h3 className="text-[16px] font-semibold text-text-primary leading-snug flex items-start gap-1.5">
          <span className="group-hover:text-accent-primary transition-colors">{entry.title}</span>
          {clickable && (
            <ArrowUpRight
              size={14}
              className="text-text-muted group-hover:text-accent-primary transition-all shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </h3>
        {(entry.institution || place) && (
          <p className="text-[14px] text-text-secondary mt-1">
            {[entry.institution, place].filter(Boolean).join(' — ')}
          </p>
        )}
        {entry.summary && (
          <p className="text-[14px] sm:text-[15px] text-text-secondary mt-2 leading-relaxed">
            {entry.summary}
          </p>
        )}
      </div>
    </>
  );
};

export const Parcours: React.FC = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>(FALLBACK_ENTRIES);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => (res.ok ? res.json() : []))
      .then((data: TimelineEntry[]) => {
        if (Array.isArray(data) && data.length > 0) setEntries(data);
      })
      .catch(() => { /* on garde le repli */ });
  }, []);

  return (
    <section id="parcours" aria-labelledby="parcours-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="parcours-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">Parcours</h2>
      </div>
      <h2 className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        Parcours
      </h2>

      <ul onMouseLeave={() => setHovered(null)}>
        {entries.map(entry => {
          const clickable = timelineHasStory(entry);
          return (
            <li
              key={entry.slug}
              onMouseEnter={() => setHovered(entry.slug)}
              onFocus={() => setHovered(entry.slug)}
              onBlur={() => setHovered(null)}
              className="transition-opacity duration-300"
              style={{ opacity: hovered === null || hovered === entry.slug ? 1 : 0.5 }}
            >
              {clickable ? (
                <Link to={`/parcours/${entry.slug}`} className={ROW_CLASS}>
                  <EntryBody entry={entry} clickable />
                </Link>
              ) : (
                <div tabIndex={0} className={ROW_CLASS}>
                  <EntryBody entry={entry} clickable={false} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
