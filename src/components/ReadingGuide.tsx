import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Heading } from './MarkdownContent.tsx';
import { ArticleToc } from './ArticleToc.tsx';

/** Distance sous le haut de l'écran à partir de laquelle une section est « en cours ». */
const ACTIVE_OFFSET = 140;

export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Où en est le lecteur : la section affichée et la part de l'article lue.
 * Calculé au défilement plutôt qu'avec un IntersectionObserver, pour qu'une
 * longue section reste active tant qu'on la lit.
 */
export function useReadingState(articleRef: React.RefObject<HTMLElement | null>, headings: Heading[]) {
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = '';
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = h.id;
      }
      setActive(current);

      const article = articleRef.current;
      if (article) {
        const rect = article.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const read = total > 0 ? -rect.top / total : rect.top <= 0 ? 1 : 0;
        setProgress(Math.min(1, Math.max(0, read)));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [articleRef, headings]);

  return { active, progress };
}

/** Fine barre en haut de l'écran : la part de l'article déjà lue. */
export const ReadingProgressBar: React.FC<{ progress: number }> = ({ progress }) =>
  createPortal(
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent-primary z-[1000] origin-left"
      style={{ transform: `scaleX(${progress})` }}
    />,
    document.body
  );

interface GuideProps {
  headings: Heading[];
  active: string;
}

/**
 * Sous le bureau large, pas de marge pour le sommaire : une barre discrète
 * rappelle la section en cours et s'ouvre sur la liste complète.
 */
export const SectionBar: React.FC<GuideProps & { progress: number }> = ({ headings, active, progress }) => {
  const [open, setOpen] = useState(false);
  const index = headings.findIndex(h => h.id === active);
  const current = headings[index];
  const visible = !!current && progress < 1;

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  const sections = headings.filter(h => h.level === 2);
  const currentSection = current
    ? current.level === 2
      ? current
      : [...headings.slice(0, index + 1)].reverse().find(h => h.level === 2)
    : undefined;
  const position = currentSection ? sections.indexOf(currentSection) + 1 : 0;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Section en cours"
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          exit={{ y: -64 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="xl:hidden fixed top-0 left-0 right-0 z-[999] bg-bg/90 backdrop-blur-md border-b border-border"
        >
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            className="w-full flex items-center gap-3 px-4 sm:px-10 py-3 text-left"
          >
            {position > 0 && (
              <span className="shrink-0 text-[11px] font-semibold tracking-[0.15em] text-accent-primary tabular-nums">
                {String(position).padStart(2, '0')}/{String(sections.length).padStart(2, '0')}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-text-primary">
              {current.text}
            </span>
            <span className="shrink-0 text-[11px] font-medium text-text-muted tabular-nums">
              {Math.round(progress * 100)} %
            </span>
            <ChevronDown size={16} className={`shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-4 sm:px-10"
              >
                <ul className="pb-3 max-h-[60vh] overflow-y-auto">
                  {headings.map(h => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(false);
                          scrollToHeading(h.id);
                        }}
                        className={`block py-2 text-[13px] leading-snug ${h.level === 3 ? 'pl-4' : ''} ${
                          h.id === active ? 'text-accent-primary font-semibold' : 'text-text-secondary'
                        }`}
                      >
                        <span>{h.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>,
    document.body
  );
};

/** Le plan du texte, donné dès le début : le lecteur sait où on l'emmène. */
export const InlineToc: React.FC<{ headings: Heading[]; label: string }> = ({ headings, label }) => {
  const sections = headings.filter(h => h.level === 2);
  if (sections.length < 2) return null;

  return (
    <nav aria-label={label} className="xl:hidden mb-12 rounded-2xl border border-border bg-bg-secondary/40 px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">{label}</p>
      <ul className="space-y-1">
        {sections.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(h.id);
              }}
              className="group flex items-center gap-3 py-1.5 text-[14px] leading-snug text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="h-px w-4 shrink-0 bg-text-muted transition-all duration-300 group-hover:w-7 group-hover:bg-accent-primary"></span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

interface ReadingFrameProps {
  headings: Heading[];
  minutes: number;
  /** Titre du sommaire : « Dans cet article », « Dans ce projet »… */
  label: string;
  children: React.ReactNode;
}

/**
 * Colonne de lecture centrée. Le sommaire vit dans la marge droite sur grand
 * écran, sans jamais décaler le texte ; en dessous, la barre de section prend
 * le relais. La barre de progression suit l'article seul, pas la page.
 */
export const ReadingFrame: React.FC<ReadingFrameProps> = ({ headings, minutes, label, children }) => {
  const articleRef = useRef<HTMLElement>(null);
  const { active, progress } = useReadingState(articleRef, headings);
  const hasToc = headings.length >= 2;

  return (
    <>
      <ReadingProgressBar progress={progress} />
      {hasToc && <SectionBar headings={headings} active={active} progress={progress} />}

      <div className="relative mx-auto max-w-[720px]">
        {/* Sur ordinateur, les photos du récit sont moins larges que la colonne,
            alignées sur le texte : il garde la vedette. La visionneuse montre tout. */}
        <article ref={articleRef} className="min-w-0 lg:[&_.markdown-content_figure]:max-w-[520px]">
          {children}
        </article>

        {hasToc && (
          <aside className="hidden xl:block absolute top-0 bottom-0 left-full ml-12 w-[200px]">
            <ArticleToc headings={headings} active={active} label={label} progress={progress} minutes={minutes} />
          </aside>
        )}
      </div>
    </>
  );
};

/** Rubrique ajoutée sous le récit (réalisations, leçons, galerie) : elle a sa place dans le sommaire. */
export function appendixHeading(id: string, text: string): Heading {
  return { id, text, level: 2, line: -1 };
}

/** Titre d'une rubrique ajoutée sous le récit, au même style que les sous-titres du texte. */
export const AppendixTitle: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="scroll-mt-28 text-[24px] sm:text-[26px] font-bold text-text-primary tracking-tight mb-6 leading-snug">
    {children}
  </h2>
);
