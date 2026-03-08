
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, Shield, Cloud, Server } from 'lucide-react';
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[10px] font-mono mb-6 tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            Disponible pour nouvelles opportunités
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Ahamed Hassani <br />
            <span className="text-gradient">M'homa</span>
          </h1>
          
          <div className="h-8 mb-6">
            <p className="text-lg md:text-xl font-mono text-white/70">
              &gt; <span className="typing-cursor">{text}</span>
            </p>
          </div>

          <p className="text-base text-white/60 mb-8 max-w-lg leading-relaxed">
            Étudiant en Master 2 Systèmes, Réseaux & Télécommunications à Dakar. 
            Passionné par l'automatisation, la sécurité des infrastructures et le Cloud.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="px-6 py-3 bg-accent-primary text-bg font-bold rounded-full hover:glow-primary transition-all flex items-center gap-2 group text-sm">
              Voir mes projets
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link to="/contact" className="px-6 py-3 glass font-bold rounded-full hover:bg-white/5 transition-all text-sm">
              Me contacter
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
            <div>
              <p className="text-2xl font-mono font-bold text-accent-primary">15+</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Projets</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-accent-secondary">5+</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Certifications</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-white/80">20+</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Technologies</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
          {/* Circular Rotating Text Effect */}
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            {/* Rotating Text SVG */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full"
            >
              <svg viewBox="0 0 300 300" className="w-full h-full">
                <defs>
                  <path
                    id="circlePath"
                    d="M 150, 150 m -120, 0 a 120,120 0 0,1 240,0 a 120,120 0 0,1 -240,0"
                  />
                </defs>
                <text className="fill-accent-primary/40 font-mono text-[14px] uppercase tracking-[0.3em]">
                  <textPath xlinkHref="#circlePath">
                    Ingénieur Systèmes & Réseaux • Cloud Engineer • DevOps Enthusiast • Cybersecurity Student •
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* Profile Image Container */}
            <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-accent-primary/20 p-2 glass">
              <div className="w-full h-full rounded-full overflow-hidden relative group">
                <img
                  src="/images/propos.jpg"
                  alt="Ahamed Hassani M'homa"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://picsum.photos/seed/ahamed/400/400";
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-accent-primary/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>

            {/* Floating Icons */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 right-10 p-3 glass rounded-xl border-accent-primary/30"
            >
              <Cloud className="text-accent-primary" size={24} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 -left-4 p-3 glass rounded-xl border-accent-secondary/30"
            >
              <Shield className="text-accent-secondary" size={24} />
            </motion.div>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -right-4 p-3 glass rounded-xl border-white/20"
            >
              <Terminal className="text-white" size={24} />
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-primary/5 blur-[100px] rounded-full -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-secondary/5 blur-[80px] rounded-full -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};
