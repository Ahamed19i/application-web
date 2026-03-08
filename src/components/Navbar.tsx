
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal, Github, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À Propos', path: '/about' },
    { name: 'Projets', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(0,232,122,1)] animate-pulse"></div>
          <span className="font-display font-bold text-lg tracking-wider text-accent-primary uppercase">
            Ahamed19i
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors relative group/link ${
                location.pathname === link.path ? 'text-accent-primary' : 'text-text-muted hover:text-accent-primary'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent-primary transition-all duration-300 ${
                location.pathname === link.path ? 'w-full' : 'w-0 group-hover/link:w-full'
              }`}></span>
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <a href="/cv-ahamed-hassani.pdf" download className="text-[11px] font-mono px-4 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/25 text-accent-primary hover:bg-accent-primary/20 transition-all tracking-wider">
              ↓ CV
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t-0 p-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-mono text-lg uppercase tracking-widest ${
                    location.pathname === link.path ? 'text-accent-primary' : 'text-white/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" className="text-white/50">
                  <Github size={24} />
                </a>
                <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" className="text-white/50">
                  <Linkedin size={24} />
                </a>
                <a href="mailto:ahassanimhoma20@gmail.com" className="text-white/50">
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
