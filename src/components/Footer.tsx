
import React from 'react';
import { Terminal, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg border-t border-white/10 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto text-center">
        <div className="font-display font-bold text-xl tracking-wider text-accent-primary uppercase mb-3">
          Ahamed19i
        </div>
        <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
          M2 Systèmes & Réseaux · DevOps · Cloud · Linux · Dakar 🇸🇳
        </p>
        
        <div className="flex justify-center gap-8 flex-wrap mb-10">
          <Link to="/" className="font-mono text-[11px] text-text-muted uppercase tracking-wider hover:text-accent-primary transition-colors">Accueil</Link>
          <Link to="/about" className="font-mono text-[11px] text-text-muted uppercase tracking-wider hover:text-accent-primary transition-colors">Profil</Link>
          <Link to="/projects" className="font-mono text-[11px] text-text-muted uppercase tracking-wider hover:text-accent-primary transition-colors">Projets</Link>
          <Link to="/blog" className="font-mono text-[11px] text-text-muted uppercase tracking-wider hover:text-accent-primary transition-colors">Blog</Link>
          <Link to="/contact" className="font-mono text-[11px] text-text-muted uppercase tracking-wider hover:text-accent-primary transition-colors">Contact</Link>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
            © 2026 Ahamed Hassani Mhoma. Tous droits réservés.
          </p>
          <p className="font-mono text-[10px] text-accent-primary uppercase tracking-widest">
            Built from Dakar 🇸🇳 with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};
