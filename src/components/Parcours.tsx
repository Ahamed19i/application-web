import React, { useState } from 'react';

interface Entry {
  period: string;
  title: string;
  org: string;
  place: string;
  description?: string;
}

const ENTRIES: Entry[] = [
  {
    period: '2024 — Aujourd\'hui',
    title: 'Master 2 Systèmes, Réseaux et Télécommunications',
    org: 'Université de l\'Entreprise (AFI-L\'UE)',
    place: 'Dakar, Sénégal',
    description: "Mémoire sur la conception d'une infrastructure hybride résiliente, pensée pour la haute disponibilité des données.",
  },
  {
    period: '2021 — 2024',
    title: 'Licence en Génie Logiciel et Systèmes d\'Information',
    org: 'Université Centrale de Tunis',
    place: 'Tunis, Tunisie',
    description: "Là où j'ai découvert l'informatique.",
  },
  {
    period: '2019',
    title: 'Baccalauréat scientifique, série D',
    org: 'GS Avenir',
    place: 'Moroni, Comores',
  },
];

export const Parcours: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="parcours" aria-labelledby="parcours-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="parcours-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">Parcours</h2>
      </div>
      <h2 className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        Parcours
      </h2>

      <ul onMouseLeave={() => setHovered(null)}>
        {ENTRIES.map((entry, i) => (
          <li
            key={i}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            className="transition-opacity duration-300"
            style={{ opacity: hovered === null || hovered === i ? 1 : 0.5 }}
          >
            <div
              tabIndex={0}
              className="group grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-6 py-5 -mx-4 px-4 rounded-xl transition-colors duration-200 hover:bg-bg-secondary focus-visible:bg-bg-secondary focus-visible:outline-none"
            >
              <p className="text-[12px] font-bold uppercase tracking-wider text-text-muted pt-1 leading-snug">
                {entry.period}
              </p>
              <div>
                <h3 className="text-[16px] font-semibold text-text-primary leading-snug group-hover:text-accent-primary transition-colors">
                  {entry.title}
                </h3>
                <p className="text-[14px] text-text-secondary mt-1">
                  {entry.org} — {entry.place}
                </p>
                {entry.description && (
                  <p className="text-[14px] sm:text-[15px] text-text-secondary mt-2 leading-relaxed">
                    {entry.description}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
