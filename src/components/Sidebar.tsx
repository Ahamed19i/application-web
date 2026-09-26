import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.tsx';

const NAV_ITEMS = [
  { id: 'a-propos', label: 'À propos' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'experience', label: 'Expérience' },
  { id: 'projets', label: 'Projets' },
  { id: 'journal', label: 'Journal' },
];

export const Sidebar: React.FC = () => {
  const [active, setActive] = useState('a-propos');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) return;
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
  }, [isHome]);

  const scrollToId = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (!isHome) {
      navigate('/#' + id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="sidebar-shell lg:sticky lg:top-0 lg:h-screen lg:max-h-screen flex flex-col justify-between px-6 sm:px-10 lg:px-12 xl:px-16">
      <div>
        <Link to="/" className="inline-block">
          <h1 className="sidebar-name font-bold tracking-tight text-text-primary leading-none whitespace-nowrap">
            Ahamed Hassani
          </h1>
        </Link>
        <p className="mt-2.5 text-[19px] font-medium text-text-primary leading-snug">
          Ingénieur Systèmes &amp; Réseaux · DevOps
        </p>
        <p className="mt-3 text-[15px] text-text-secondary max-w-[330px] leading-relaxed">
          J'aime construire : des infrastructures résilientes aux applications qui tournent dessus.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-primary text-accent-primary text-sm font-semibold hover:bg-accent-primary/10 transition-colors"
          >
            Me contacter
          </Link>
          <p className="flex items-center gap-2 text-[12px] font-medium text-text-secondary">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-60 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            Disponible — stage / alternance 2026
          </p>
        </div>

        <nav aria-label="Navigation principale" className="sidebar-nav hidden lg:block">
          <ul>
            {NAV_ITEMS.map(item => {
              const isActive = isHome && active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToId(e, item.id)}
                    className="sidebar-nav-link group flex items-center gap-4"
                  >
                    <span
                      className={`h-px transition-all duration-300 ${
                        isActive ? 'w-16 bg-text-primary' : 'w-8 bg-text-muted group-hover:w-16 group-hover:bg-text-primary'
                      }`}
                    ></span>
                    <span
                      className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
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

      <div className="sidebar-icons flex items-center gap-5">
        <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-text-muted hover:text-accent-primary transition-colors">
          <Github size={22} />
        </a>
        <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-text-muted hover:text-accent-primary transition-colors">
          <Linkedin size={22} />
        </a>
        <a href="mailto:ahassanimhoma20@gmail.com" aria-label="Email" className="text-text-muted hover:text-accent-primary transition-colors">
          <Mail size={22} />
        </a>
        <a href="/images/cv-ahamed-hassani.pdf" download aria-label="Télécharger le CV" className="text-text-muted hover:text-accent-primary transition-colors">
          <Download size={22} />
        </a>
        <ThemeToggle variant="bare" size={22} />
      </div>
    </header>
  );
};
