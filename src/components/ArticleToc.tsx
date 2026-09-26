import React, { useEffect, useState } from 'react';
import { Heading } from './MarkdownContent.tsx';

interface ArticleTocProps {
  headings: Heading[];
}

export const ArticleToc: React.FC<ArticleTocProps> = ({ headings }) => {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
    );

    const observed: HTMLElement[] = [];
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) {
        observer.observe(el);
        observed.push(el);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav aria-label="Sommaire" className="sticky top-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-5">
        Dans cet article
      </p>
      <ul className="space-y-1">
        {headings.map(h => {
          const isActive = active === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => scrollTo(e, h.id)}
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
    </nav>
  );
};
