import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MouseGlow } from './MouseGlow.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';

interface PageShellProps {
  children: React.ReactNode;
  /** Largeur du conteneur. "reading" pour un article, "wide" pour une archive. */
  width?: 'reading' | 'wide';
  backTo?: string;
  backLabel?: string;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  width = 'reading',
  backTo = '/',
  backLabel = 'Ahamed Hassani',
}) => {
  return (
    <div className="relative min-h-screen">
      <MouseGlow />
      <a href="#contenu-principal" className="skip-link">Aller au contenu</a>

      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12">
        <div className={`mx-auto w-full ${width === 'wide' ? 'max-w-[1100px]' : 'max-w-[1024px]'}`}>
          <div className="flex items-center justify-between gap-4 mb-12 sm:mb-16">
            <Link
              to={backTo}
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-accent-primary"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
              {backLabel}
            </Link>
            <ThemeToggle variant="bare" size={20} />
          </div>

          <main id="contenu-principal">{children}</main>
        </div>
      </div>
    </div>
  );
};
