
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, Linkedin, Mail, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.tsx';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (location.pathname !== '/') return;

      const sections = ['home', 'about', 'projects', 'blog', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '#home' },
    { name: 'À Propos', path: '#about' },
    { name: 'Travaux', path: '/travaux' },
    { name: 'Blog', path: '#blog' },
    { name: 'Contact', path: '#contact' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  // La page d'accueil a sa propre colonne de gauche (Sidebar) qui remplace cette nav.
  if (isAdmin || location.pathname === '/' || location.pathname === '/contact') return null;

  const isLinkActive = (path: string) => {
    if (path.startsWith('#')) {
      return location.pathname === '/' && activeSection === path.substring(1);
    }
    return location.pathname === path;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (path.startsWith('#')) {
      // Always use navigate to let ScrollToHash handle the scroll
      // This is more consistent across pages and mobile devices
      navigate('/' + path);
    } else {
      navigate(path);
    }
  };

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2.5 group">
          <div className="w-2 h-2 rounded-full bg-accent-primary"></div>
          <span className="font-serif font-medium text-base tracking-tight text-text-primary">
            Ahamed Hassani Mhoma
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors relative group/link ${
                isLinkActive(link.path)
                  ? 'text-accent-primary'
                  : 'text-text-muted hover:text-accent-primary'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent-primary transition-all duration-300 ${
                isLinkActive(link.path) ? 'w-full' : 'w-0 group-hover/link:w-full'
              }`}></span>
            </a>
          ))}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
            <button
              onClick={openPalette}
              aria-label="Ouvrir la palette de commandes"
              className="flex items-center gap-2 px-2.5 py-1.5 border border-border text-text-muted hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              <Search size={13} />
              <kbd className="text-[10px] font-mono">⌘K</kbd>
            </button>
            <a href="images/cv-ahamed-hassani.pdf" download className="text-[11px] font-mono px-3 py-1.5 border border-border text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors tracking-wider">
              CV
            </a>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={openPalette}
            aria-label="Ouvrir la palette de commandes"
            className="w-9 h-9 flex items-center justify-center border border-border text-text-muted"
          >
            <Search size={15} />
          </button>
          <ThemeToggle />
          <button
            className="text-text-primary p-2 z-50 relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 glass-nav border-t-0 overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-6 p-8">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`font-mono text-lg uppercase tracking-widest transition-colors ${
                    isLinkActive(link.path)
                      ? 'text-accent-primary'
                      : 'text-text-secondary hover:text-accent-primary'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-6 pt-6 border-t border-border">
                <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-primary transition-colors">
                  <Github size={22} />
                </a>
                <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-primary transition-colors">
                  <Linkedin size={22} />
                </a>
                <a href="mailto:ahassanimhoma20@gmail.com" className="text-text-muted hover:text-accent-primary transition-colors">
                  <Mail size={22} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
