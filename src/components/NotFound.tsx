import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageShell } from './PageShell.tsx';

export const NotFound: React.FC = () => {
  return (
    <PageShell>
      <div className="py-16 max-w-[560px]">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-accent-primary mb-5">Erreur 404</p>
        <h1 className="text-[34px] sm:text-[44px] font-bold text-text-primary tracking-tight leading-[1.1] mb-4">
          Page introuvable
        </h1>
        <p className="text-[16px] text-text-secondary leading-relaxed mb-10">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-[15px] font-semibold text-bg transition-opacity hover:opacity-90"
          >
            Retour à l'accueil <ArrowRight size={15} />
          </Link>
          <Link
            to="/travaux"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-[15px] font-semibold text-text-primary hover:border-accent-primary hover:text-accent-primary transition-colors"
          >
            Voir les projets
          </Link>
        </div>
      </div>
    </PageShell>
  );
};
