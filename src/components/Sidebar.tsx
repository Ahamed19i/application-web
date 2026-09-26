import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.tsx';

const NAV_ITEMS = [
  { id: 'a-propos', label: 'À propos' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'travaux', label: 'Travaux' },
  { id: 'journal', label: 'Journal' },
];

export const Sidebar: React.FC = () => {
  const [active, setActive] = useState('a-propos');

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToId = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between py-12 lg:py-16 px-6 sm:px-10 lg:px-12 xl:px-16">
      <div>
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="inline-block"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]">
            Ahamed Hassani Mhoma
          </h1>
        </a>
        <p className="mt-3 text-lg font-medium text-text-primary">
          Ingénieur Systèmes & Réseaux · DevOps
        </p>
        {/* TODO(Ahamed): une phrase sur ce que tu construis, dans tes propres mots. */}
        <p className="mt-4 text-base text-text-secondary max-w-[320px] leading-relaxed">
          TODO(Ahamed) : une phrase sur ce que je construis.
        </p>

        <p className="mt-6 flex items-center gap-2.5 text-[13px] font-medium text-text-secondary">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-60 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
          </span>
          Disponible — stage / alternance 2026
        </p>

        <nav aria-label="Navigation principale" className="hidden lg:block mt-16">
          <ul className="space-y-5">
            {NAV_ITEMS.map(item => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToId(e, item.id)}
                    className="group flex items-center gap-4 py-1"
                  >
                    <span
                      className={`h-px transition-all duration-300 ${
                        isActive ? 'w-16 bg-text-primary' : 'w-8 bg-text-muted group-hover:w-16 group-hover:bg-text-primary'
                      }`}
                    ></span>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${
                        isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-4 mt-12 lg:mt-0">
        <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-text-muted hover:text-accent-primary transition-colors">
          <Github size={19} />
        </a>
        <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-text-muted hover:text-accent-primary transition-colors">
          <Linkedin size={19} />
        </a>
        <a href="mailto:ahassanimhoma20@gmail.com" aria-label="Email" className="text-text-muted hover:text-accent-primary transition-colors">
          <Mail size={19} />
        </a>
        <a href="/images/cv-ahamed-hassani.pdf" download aria-label="Télécharger le CV" className="text-text-muted hover:text-accent-primary transition-colors">
          <Download size={19} />
        </a>
        <span className="w-px h-5 bg-border"></span>
        <ThemeToggle />
      </div>
    </header>
  );
};
