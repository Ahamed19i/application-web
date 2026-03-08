
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, Shield, Cloud, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = [
    "Ingénieur Systèmes & Réseaux",
    "Cloud Engineer",
    "DevOps Enthusiast",
    "Cybersecurity Student"
  ];
  const speed = isDeleting ? 50 : 100;

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        setText(currentRole.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
        }
      } else {
        setText(currentRole.substring(0, text.length + 1));
        if (text === currentRole) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex]);

  return (
    <section className="min-h-screen flex items-center pt-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[9px] font-mono mb-6 tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            Disponible pour nouvelles opportunités
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
            Ahamed Hassani <br />
            <span className="text-gradient">M'homa</span>
          </h1>
          
          <div className="h-6 mb-6">
            <p className="text-base md:text-lg font-mono text-white/70">
              &gt; <span className="typing-cursor">{text}</span>
            </p>
          </div>

          <p className="text-sm md:text-base text-white/60 mb-8 max-w-lg leading-relaxed">
            Étudiant en Master 2 Systèmes, Réseaux & Télécommunications à Dakar. 
            Passionné par l'automatisation, la sécurité des infrastructures et le Cloud.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="px-5 py-2.5 bg-accent-primary text-bg font-bold rounded-full hover:glow-primary transition-all flex items-center gap-2 group text-xs">
              Voir mes projets
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
            <a 
              href="/images/CV_Officiel1.pdf" 
              download
              className="px-5 py-2.5 glass font-bold rounded-full hover:bg-white/5 transition-all text-xs flex items-center gap-2"
            >
              <Download size={16} />
              Télécharger CV
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
            <div>
              <p className="text-xl font-mono font-bold text-accent-primary">15+</p>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Projets</p>
            </div>
            <div>
              <p className="text-xl font-mono font-bold text-accent-secondary">5+</p>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Certifications</p>
            </div>
            <div>
              <p className="text-xl font-mono font-bold text-white/80">20+</p>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Technologies</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
          {/* Orbital Container */}
          <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] flex items-center justify-center">
            
            {/* Orbital Lines */}
            <div className="absolute inset-0 border border-white/5 rounded-full"></div>
            <div className="absolute inset-10 border border-dashed border-white/10 rounded-full"></div>
            <div className="absolute inset-20 border border-white/5 rounded-full"></div>

            {/* Moving Orbital Dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-accent-secondary rounded-full shadow-[0_0_15px_rgba(0,212,255,0.8)]"></div>
            </motion.div>

            {/* Rotating Text SVG (Subtle) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full opacity-20"
            >
              <svg viewBox="0 0 300 300" className="w-full h-full">
                <defs>
                  <path
                    id="circlePath"
                    d="M 150, 150 m -135, 0 a 135,135 0 0,1 270,0 a 135,135 0 0,1 -270,0"
                  />
                </defs>
                <text className="fill-white font-mono text-[10px] uppercase tracking-[0.4em]">
                  <textPath xlinkHref="#circlePath">
                    Systems • Networks • Cloud • Security • DevOps • Automation •
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* Profile Image Container */}
            <div className="relative w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden border border-white/10 p-1.5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden relative group">
                <img
                  src="/images/profile.jpg"
                  alt="Ahamed Hassani M'homa"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://picsum.photos/seed/ahamed/400/400";
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-accent-primary/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>

            {/* Floating Badges (Glassmorphism) */}
            
            {/* Top Left Badge */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -top-4 -left-4 md:top-10 md:left-0 z-20"
            >
              <div className="glass px-4 py-2 rounded-2xl border-white/10 flex items-center gap-3 shadow-2xl backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <Cloud className="text-accent-primary" size={16} />
                </div>
                <div className="font-mono">
                  <p className="text-[10px] text-accent-primary font-bold tracking-wider">DevOps • Cloud • Linux</p>
                </div>
              </div>
            </motion.div>

            {/* Bottom Right Badge */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute -bottom-4 -right-4 md:bottom-10 md:right-0 z-20"
            >
              <div className="glass px-5 py-3 rounded-2xl border-white/10 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
                  <p className="text-[10px] text-accent-primary font-bold uppercase tracking-widest">Open to work</p>
                </div>
                <p className="text-[11px] text-white/60 font-mono">Stage / Alternance 2026</p>
              </div>
            </motion.div>

            {/* Floating Tech Icons */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -right-6 p-2 glass rounded-lg border-white/10 opacity-40"
            >
              <Terminal size={16} className="text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 -left-6 p-2 glass rounded-lg border-white/10 opacity-40"
            >
              <Shield size={16} className="text-accent-secondary" />
            </motion.div>

          </div>
          
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-primary/5 blur-[120px] rounded-full -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};
