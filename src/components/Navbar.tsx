
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal, Github, Linkedin, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
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
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '#home' },
    { name: 'À Propos', path: '#about' },
    { name: 'Projets', path: '#projects' },
    { name: 'Blog', path: '#blog' },
    { name: 'Contact', path: '#contact' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      
      if (location.pathname !== '/') {
        navigate('/' + path);
        setIsOpen(false);
        return;
      }

      const element = document.querySelector(path);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2 group">
          <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(0,232,122,1)] animate-pulse"></div>
          <span className="font-display font-bold text-lg tracking-wider text-accent-primary uppercase">
            Ahamed19i
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
                activeSection === link.path.substring(1) 
                  ? 'text-accent-primary' 
                  : 'text-text-muted hover:text-accent-primary'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent-primary transition-all duration-300 ${
                activeSection === link.path.substring(1) ? 'w-full' : 'w-0 group-hover/link:w-full'
              }`}></span>
            </a>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <a href="/cv-ahamed-hassani.pdf" download className="text-[11px] font-mono px-4 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/25 text-accent-primary hover:bg-accent-primary/20 transition-all tracking-wider">
              ↓ CV
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
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
                    activeSection === link.path.substring(1) 
                      ? 'text-accent-primary' 
                      : 'text-white/70 hover:text-accent-primary'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-6 pt-6 border-t border-white/10">
                <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" className="text-white/50 hover:text-accent-primary transition-colors">
                  <Github size={24} />
                </a>
                <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" className="text-white/50 hover:text-accent-primary transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href="mailto:ahassanimhoma20@gmail.com" className="text-white/50 hover:text-accent-primary transition-colors">
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
