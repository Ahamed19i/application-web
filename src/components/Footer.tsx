
import React from 'react';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = location.pathname.startsWith('/admin');

  // La page d'accueil a son propre petit pied de page intégré (voir Home.tsx).
  if (isAdmin || location.pathname === '/') return null;

  return (
    <footer className="bg-bg border-t border-border pt-12 md:pt-20 pb-12 px-6 mt-10 md:mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 md:mb-16">
          <div className="space-y-6">
            <p className="font-serif font-medium text-xl tracking-tight text-text-primary">
              Ahamed Hassani Mhoma
            </p>
            {/* TODO(Ahamed): remplacer par ta propre accroche — "passionné par..." retiré. */}
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Ingénieur en Systèmes & Réseaux Télécom.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com/ahamed19i" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 border border-border flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary transition-colors">
                <Github size={17} />
              </a>
              <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 border border-border flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary transition-colors">
                <Linkedin size={17} />
              </a>
              <a href="mailto:ahassanimhoma20@gmail.com" aria-label="Email" className="w-10 h-10 border border-border flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary transition-colors">
                <Mail size={17} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-primary mb-2">Discutons</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Vous avez un projet ou une opportunité ? N'hésitez pas à me contacter.
            </p>
            <a href="/#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary group">
              Démarrer une conversation
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
            © 2026 Ahamed Hassani Mhoma
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 px-5 py-2.5 border border-border hover:border-accent-primary transition-colors"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted group-hover:text-accent-primary transition-colors">Retour en haut</span>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-accent-primary transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
};
