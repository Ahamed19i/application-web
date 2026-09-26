import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const ENTRIES = [
  {
    period: '2024',
    title: 'Stage Administrateur Systèmes & Réseaux',
    org: 'Tunisie Télécom, Tunis',
    // TODO(Ahamed): description concrète de ce que tu as fait pendant ce stage.
    description: 'TODO(Ahamed) : description du stage.',
    // TODO(Ahamed): technologies réellement utilisées pendant ce stage.
    stack: [] as string[],
  },
];

export const Experience: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="experience-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">Expérience</h2>
      </div>
      <h2 className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        Expérience
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
            <div tabIndex={0} className="group grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-6 py-5 -mx-4 px-4 rounded-xl transition-colors duration-200 hover:bg-bg-secondary focus-visible:bg-bg-secondary focus-visible:outline-none">
              <p className="text-[12px] font-bold uppercase tracking-wider text-text-muted pt-0.5">
                {entry.period}
              </p>
              <div>
                <h3 className="text-[16px] font-semibold text-text-primary flex items-center gap-1.5">
                  <span className="group-hover:text-accent-primary transition-colors">{entry.title} · {entry.org}</span>
                  <ArrowUpRight size={14} className="text-text-muted group-hover:text-accent-primary transition-colors shrink-0" />
                </h3>
                <p className="text-[14px] sm:text-[15px] text-text-secondary mt-1.5 leading-relaxed">{entry.description}</p>
                {entry.stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.stack.map((s, si) => (
                      <span key={si} className="px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
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
