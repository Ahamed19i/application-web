import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Experience as ExperienceEntry, experienceHasStory, experienceOrganization } from '../types';

/**
 * Repli utilisé tant que la migration 003 n'a pas été exécutée : c'est
 * exactement l'entrée affichée jusqu'ici, pour que la section ne disparaisse
 * jamais. Dès que la table existe, la base fait autorité.
 */
const FALLBACK_ENTRIES: ExperienceEntry[] = [
  {
    slug: 'stage-administrateur-systemes-reseaux-tunisie-telecom',
    sort_order: 1,
    period_label: '2024',
    role: 'Stage Administrateur Systèmes & Réseaux',
    organization: 'Tunisie Télécom',
    type: 'Stage',
    location: 'Tunis, Tunisie',
    // Récit, réalisations et technologies fournis par Ahamed plus tard : tant
    // qu'ils n'existent pas, rien n'est affiché (voir CONTENU_A_FOURNIR.md).
  },
];

const ROW_CLASS =
  'group grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-6 py-5 -mx-4 px-4 rounded-xl transition-colors duration-200 hover:bg-bg-secondary focus-visible:bg-bg-secondary focus-visible:outline-none';

const EntryBody: React.FC<{ entry: ExperienceEntry; clickable: boolean }> = ({ entry, clickable }) => {
  const org = experienceOrganization(entry);
  const place = [entry.location, entry.remote ? 'à distance' : null].filter(Boolean).join(' · ');
  const technologies = entry.technologies ?? [];

  return (
    <>
      <p className="text-[12px] font-bold uppercase tracking-wider text-text-muted pt-1 leading-snug">
        {entry.period_label}
      </p>
      <div>
        <h3 className="text-[16px] font-semibold text-text-primary leading-snug flex items-start gap-1.5">
          <span className="group-hover:text-accent-primary transition-colors">
            {[entry.role, org].filter(Boolean).join(' · ')}
          </span>
          {clickable && (
            <ArrowUpRight
              size={14}
              className="text-text-muted group-hover:text-accent-primary transition-all shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </h3>
        {place && <p className="text-[14px] text-text-secondary mt-1">{place}</p>}
        {entry.summary && (
          <p className="text-[14px] sm:text-[15px] text-text-secondary mt-2 leading-relaxed">
            {entry.summary}
          </p>
        )}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {technologies.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[11px] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const Experience: React.FC = () => {
  const [entries, setEntries] = useState<ExperienceEntry[]>(FALLBACK_ENTRIES);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/experiences')
      .then(res => (res.ok ? res.json() : []))
      .then((data: ExperienceEntry[]) => {
        if (Array.isArray(data) && data.length > 0) setEntries(data);
      })
      .catch(() => { /* on garde le repli */ });
  }, []);

  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="experience-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">Expérience</h2>
      </div>
      <h2 className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        Expérience
      </h2>

      <ul onMouseLeave={() => setHovered(null)}>
        {entries.map(entry => {
          const clickable = experienceHasStory(entry);
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
                <Link to={`/experience/${entry.slug}`} className={ROW_CLASS}>
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

      <a
        href="/images/cv-ahamed-hassani.pdf"
        download
        className="inline-flex items-center gap-2 mt-2 text-[14px] font-semibold text-text-primary hover:text-accent-primary transition-colors"
      >
        Voir le CV complet ↗
      </a>
    </section>
  );
};
