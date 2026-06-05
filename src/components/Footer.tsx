
import React from 'react';
import { Terminal, Github, Linkedin, Mail, Twitter, Instagram, ArrowUpRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <footer className="bg-bg border-t border-white/5 pt-12 md:pt-24 pb-12 px-6 mt-10 md:mt-20 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-primary/5 blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-secondary/5 blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 md:mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="font-display font-black text-2xl tracking-tighter text-white uppercase flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
                <Terminal size={18} className="text-bg" />
              </div>
              Ahamed19i
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Ingénieur en Systèmes & Réseaux Télécom. Passionné par l'automatisation, le Cloud et la sécurité des infrastructures.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/ahamed19i" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all group">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="mailto:hassanimhoma2019@gmail.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter/CTA Column */}
          <div className="space-y-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-primary mb-8">Discutons</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Vous avez un projet ou une opportunité ? N'hésitez pas à me contacter.
            </p>
            <a href="/#contact" className="inline-flex items-center gap-2 text-sm font-bold text-white group">
              Démarrer une conversation
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
              © 2026 Ahamed Hassani Mhoma.
            </p>
            <p className="font-mono text-[9px] text-accent-primary/60 uppercase tracking-widest">
              Conçu à Dakar, Sénégal 🇸🇳
            </p>
          </div>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-accent-primary/30 transition-all"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted group-hover:text-white transition-colors">Retour en haut</span>
            <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary transition-colors">
              <ArrowUpRight size={14} className="text-accent-primary group-hover:text-bg transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
