import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.tsx';

export interface MenuItem {
  id: string;
  label: string;
}

interface MobileMenuProps {
  items: MenuItem[];
  onNavigate: (id: string) => void;
  /** Icônes des réseaux, partagées avec la colonne de gauche. */
  social: React.ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Sous lg, la navigation de la colonne de gauche disparaît : ce bouton en
 * haut à droite ouvre un sommaire plein écran des sections de l'accueil.
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({ items, onNavigate, social }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const toggle = () => {
    if (!open) {
      // La section en cours se lit au moment d'ouvrir : la dernière dont le
      // haut a dépassé le tiers de l'écran.
      let current = '';
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 3) current = item.id;
      }
      setActive(current);
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    // Le défilement attend que la page soit de nouveau défilable.
    requestAnimationFrame(() => onNavigate(id));
  };

  return createPortal(
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="fixed right-4 z-[1001] flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-colors hover:border-accent-primary"
        style={{ top: 'max(14px, env(safe-area-inset-top))' }}
      >
        <span className="relative block h-3 w-[18px]" aria-hidden="true">
          <span
            className={`absolute left-0 h-[1.5px] w-full rounded-full bg-text-primary transition-all duration-300 ease-out ${
              open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute left-0 h-[1.5px] rounded-full bg-text-primary transition-all duration-300 ease-out ${
              open ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'bottom-0 w-2/3'
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[1000] overflow-y-auto overflow-x-hidden bg-bg/95 backdrop-blur-2xl"
          >
            {/* Halo doré discret : la même lumière que le reste du site. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent-primary/10 blur-3xl"
            />

            <div
              className="relative flex min-h-full flex-col px-6 sm:px-10 pb-10"
              style={{ paddingTop: 'max(14px, env(safe-area-inset-top))' }}
            >
              <div className="flex h-11 items-center">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-bold tracking-tight text-text-primary"
                >
                  Ahamed Hassani
                </Link>
              </div>

              <nav aria-label="Sections de l'accueil" className="mt-14">
                <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Naviguer
                </p>
                <ul className="space-y-1">
                  {items.map((item, i) => {
                    const isActive = active === item.id;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.06 + i * 0.05, ease: EASE }}
                      >
                        <a
                          ref={i === 0 ? firstLinkRef : undefined}
                          href={`#${item.id}`}
                          onClick={(e) => go(e, item.id)}
                          aria-current={isActive ? 'location' : undefined}
                          className="group flex items-center gap-4 py-2.5"
                        >
                          <span
                            aria-hidden="true"
                            className={`h-px shrink-0 transition-all duration-500 ease-out ${
                              isActive ? 'w-8 bg-accent-primary' : 'w-0 bg-text-primary group-hover:w-5'
                            }`}
                          />
                          <span
                            className={`text-[34px] sm:text-[40px] font-bold leading-none tracking-tight transition-colors duration-300 ${
                              isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'
                            }`}
                          >
                            {item.label}
                          </span>
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06 + items.length * 0.05, ease: EASE }}
                className="mt-12 flex flex-wrap gap-3"
              >
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-3 text-[14px] font-semibold text-bg transition-opacity hover:opacity-90"
                >
                  Me contacter
                  <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="/images/CV-AhamedHassani.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-semibold text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
                >
                  <Download size={15} /> Mon CV
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 + items.length * 0.05, ease: EASE }}
                className="mt-auto pt-14"
              >
                <p className="flex items-center gap-2 text-[12px] font-medium text-text-secondary">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-60 animate-ping"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-primary"></span>
                  </span>
                  Disponible — freelance uniquement
                </p>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
                  <div className="flex items-center gap-5">{social}</div>
                  <ThemeToggle variant="bare" size={22} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};
