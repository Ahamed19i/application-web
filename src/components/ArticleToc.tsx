import React, { useRef } from 'react';
import { Heading } from './MarkdownContent.tsx';
import { scrollToHeading, useReadingState } from './ReadingGuide.tsx';

interface ArticleTocProps {
  headings: Heading[];
  /** Section en cours, quand la page la suit déjà ; sinon le sommaire la calcule. */
  active?: string;
  label?: string;
  /** Part de l'article lue (0 à 1) et durée totale : affiche le temps restant. */
  progress?: number;
  minutes?: number;
}

export const ArticleToc: React.FC<ArticleTocProps> = ({ headings, active, label = 'Dans cet article', progress, minutes }) => {
  const noArticle = useRef<HTMLElement>(null);
  const own = useReadingState(noArticle, active === undefined ? headings : []);
  const current = active ?? own.active;

  if (headings.length < 2) return null;

  const minutesLeft = progress !== undefined && minutes ? Math.ceil(minutes * (1 - progress)) : null;

  return (
    <nav aria-label="Sommaire" className="sticky top-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-5">
        {label}
      </p>
      <ul className="space-y-1">
        {headings.map(h => {
          const isActive = current === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(h.id);
                }}
                aria-current={isActive ? 'location' : undefined}
                className={`group flex items-center gap-3 py-1.5 ${h.level === 3 ? 'pl-4' : ''}`}
              >
                <span
                  className={`h-px shrink-0 transition-all duration-300 ${
                    isActive ? 'w-8 bg-accent-primary' : 'w-4 bg-text-muted group-hover:w-8 group-hover:bg-text-primary'
                  }`}
                ></span>
                <span
                  className={`text-[12px] leading-snug transition-colors duration-300 ${
                    isActive ? 'text-accent-primary font-semibold' : 'text-text-muted group-hover:text-text-primary'
                  }`}
                >
                  {h.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {progress !== undefined && (
        <div className="mt-6 pt-5 border-t border-border">
          <div className="h-[2px] rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-accent-primary origin-left transition-transform duration-150"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] font-medium text-text-muted tabular-nums">
            {progress >= 1
              ? 'Lecture terminée'
              : minutesLeft !== null && progress > 0
                ? `Encore ${minutesLeft} min · ${Math.round(progress * 100)} %`
                : `${minutes} min de lecture`}
          </p>
        </div>
      )}
    </nav>
  );
};
