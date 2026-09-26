import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-6">Erreur 404</p>
        <h1 className="font-serif font-medium text-6xl md:text-8xl text-text-primary mb-6">
          Page introuvable
        </h1>
        <p className="text-text-secondary text-base mb-10 max-w-md mx-auto leading-relaxed">
          Cette page n'existe pas ou plus. Elle a peut-être été déplacée.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-p text-sm">
            Retour à l'accueil <ArrowRight size={15} />
          </Link>
          <Link to="/travaux" className="btn-g text-sm">
            Voir les travaux
          </Link>
        </div>
      </div>
    </div>
  );
};
