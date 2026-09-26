import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface Command {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const goHash = (hash: string) => {
    navigate('/' + hash);
    close();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleOpenEvent = () => setOpen(true);
    window.addEventListener('open-command-palette', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, [close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      if (projects.length === 0) {
        fetch('/api/projects')
          .then(res => (res.ok ? res.json() : []))
          .then(data => setProjects(Array.isArray(data) ? data : []))
          .catch(() => setProjects([]));
      }
    }
  }, [open, projects.length]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentlyLight = root.getAttribute('data-theme') === 'light';
    if (currentlyLight) {
      root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
    close();
  };

  const staticCommands: Command[] = [
    { id: 'home', label: 'Accueil', action: () => { navigate('/'); close(); } },
    { id: 'about', label: 'À propos', action: () => goHash('#a-propos') },
    { id: 'parcours', label: 'Parcours', action: () => goHash('#parcours') },
    { id: 'travaux-section', label: 'Travaux (accueil)', action: () => goHash('#travaux') },
    { id: 'travaux', label: 'Travaux (archive)', action: () => { navigate('/travaux'); close(); } },
    { id: 'journal', label: 'Journal', action: () => goHash('#journal') },
    { id: 'contact', label: 'Contact par email', action: () => { window.location.href = 'mailto:ahassanimhoma20@gmail.com'; close(); } },
    { id: 'theme', label: 'Changer de thème (clair / sombre)', hint: 'Thème', action: toggleTheme },
  ];

  const projectCommands: Command[] = projects.map(p => ({
    id: `project-${p.id}`,
    label: p.title,
    hint: 'Travail',
    action: () => { navigate(`/project/${p.slug || p.id}`); close(); },
  }));

  const allCommands = [...staticCommands, ...projectCommands];
  const filtered = query.trim() === ''
    ? allCommands
    : allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[activeIndex]?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[300] bg-black/50 flex items-start justify-center pt-[12vh] px-6"
          onClick={close}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-label="Palette de commandes"
            className="w-full max-w-lg bg-bg border border-border shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={16} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={handleKeyNav}
                placeholder="Aller à..."
                className="w-full bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                aria-label="Rechercher une page, un travail, ou une action"
              />
              <kbd className="text-[10px] font-semibold text-text-muted border border-border px-1.5 py-0.5 rounded shrink-0">Esc</kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-text-muted text-center">Aucun résultat pour « {query} ».</p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === activeIndex ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  <span className="truncate">{cmd.label}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    {cmd.hint && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{cmd.hint}</span>
                    )}
                    {i === activeIndex && <ArrowRight size={13} className="text-accent-primary" />}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
