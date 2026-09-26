import React, { useState } from 'react';

const ENTRIES = [
  {
    period: '2024 — Aujourd\'hui',
    title: 'Master 2 SRT',
    org: 'AFI-L\'UE, Dakar',
  },
  {
    period: '2024',
    title: 'Stage Administrateur Systèmes & Réseaux',
    org: 'Tunisie Télécom, Tunis',
  },
  {
    period: '2021 — 2024',
    title: 'Licence SRT',
    // TODO(Ahamed): nom de l'établissement
    org: 'TODO(Ahamed) : établissement',
  },
];

export const Parcours: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="parcours" aria-labelledby="parcours-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="parcours-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">Parcours</h2>
      </div>
      <h2 id="parcours-heading" className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        Parcours
      </h2>

      <ol onMouseLeave={() => setHovered(null)}>
        {ENTRIES.map((entry, i) => (
          <li
            key={i}
            onMouseEnter={() => setHovered(i)}
            className="transition-opacity duration-300"
            style={{ opacity: hovered === null || hovered === i ? 1 : 0.5 }}
          >
            <div className="group grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-6 py-5 -mx-4 px-4 rounded-lg transition-colors duration-200 hover:bg-bg-secondary">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-text-muted pt-0.5">
                {entry.period}
              </p>
              <div>
                <h3 className="text-[16px] font-semibold text-text-primary">
                  {entry.title}
                </h3>
                <p className="text-[14px] text-text-secondary mt-0.5">{entry.org}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <a
        href="/images/cv-ahamed-hassani.pdf"
        download
        className="inline-flex items-center gap-2 mt-4 text-[14px] font-semibold text-text-primary hover:text-accent-primary transition-colors"
      >
        Voir le CV complet ↗
      </a>
    </section>
  );
};
