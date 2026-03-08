import React from 'react';
import { Terminal, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="glass border-x-0 border-b-0 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 rounded bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
              <Terminal className="text-accent-primary w-5 h-5" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tighter">
              AHAMED<span className="text-accent-primary">.</span>SYS
            </span>
          </Link>
          <p className="text-white/40 max-w-sm mb-8">
            Ingénieur Systèmes & Réseaux spécialisé en Cloud, DevOps et Cybersécurité. 
            Basé à Dakar, Sénégal.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:text-accent-primary transition-all">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:text-accent-secondary transition-all">
              <Linkedin size={20} />
            </a>
            <a href="mailto:ahassanimhoma20@gmail.com" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:text-white transition-all">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6">Navigation</h4>
          <ul className="space-y-4 font-mono text-sm">
            <li><Link to="/" className="hover:text-accent-primary transition-colors">Accueil</Link></li>
            <li><Link to="/about" className="hover:text-accent-primary transition-colors">À Propos</Link></li>
            <li><Link to="/projects" className="hover:text-accent-primary transition-colors">Projets</Link></li>
            <li><Link to="/blog" className="hover:text-accent-primary transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6">Légal</h4>
          <ul className="space-y-4 font-mono text-sm">
            <li className="text-white/20">© 2024 Ahamed Hassani</li>
            <li className="text-white/20">Built with React & Node.js</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          Designed & Developed by Ahamed Hassani M'homa
        </p>
      </div>
    </footer>
  );
};
