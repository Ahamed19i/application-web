
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, Shield, Cloud, Download } from 'lucide-react';

export const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = [
    "Ingénieur Systèmes & Réseaux",
    "Cloud Engineer",
    "DevOps Enthusiast"
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
    <section id="home" className="min-h-screen flex items-center pt-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_30%,rgba(0,80,200,0.07)_0%,transparent_65%),radial-gradient(ellipse_60%_60%_at_10%_80%,rgba(0,180,255,0.05)_0%,transparent_55%)] -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,180,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_400px] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 order-2 lg:order-1 text-center lg:text-left"
        >
                   
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            <span className="block">Ahamed Hassani</span>
            <span className="block text-accent-primary text-[0.35em] font-medium tracking-[0.15em] uppercase mt-3 md:mt-4 opacity-80">Ingénieur Systèmes, Réseaux & Cloud</span>
          </h1>
          
          <div className="h-6 mb-6">
            <p className="text-sm md:text-base font-mono text-accent-primary">
              &gt; <span className="typing-cursor">{text}</span>
            </p>
          </div>

          <p className="text-sm md:text-base text-text-secondary mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Ingénieur en <strong>Master 2 Systèmes & Réseaux</strong> à l'AFI-Université (Dakar).
            Spécialisé en <strong>Linux / Windows Server</strong>, virtualisation, cloud DevOps.
            Expériences chez <strong>Sonatel</strong> (Orange) et <strong>Tunisie Télécom</strong>.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <a href="/cv-ahamed-hassani.pdf" download className="btn-p text-sm md:text-base">
              📄 Télécharger mon CV
            </a>
            <a href="#projects" className="btn-g text-sm md:text-base">
              🚀 Mes projets
            </a>
            <a href="#contact" className="btn-gr text-sm md:text-base">
              ✉️ Me contacter
            </a>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-10">
            <span className="px-3 py-1 rounded-full border border-success/20 text-success bg-success/5 text-[11px] font-mono tracking-wider">🐧 Linux</span>
            <span className="px-3 py-1 rounded-full border border-white/10 text-text-muted bg-white/5 text-[11px] font-mono tracking-wider">🪟 Windows Server</span>
            <span className="px-3 py-1 rounded-full border border-white/10 text-text-muted bg-white/5 text-[11px] font-mono tracking-wider">☁️ Cloud / AWS</span>
            <span className="px-3 py-1 rounded-full border border-white/10 text-text-muted bg-white/5 text-[11px] font-mono tracking-wider">🐳 Docker</span>
            <span className="px-3 py-1 rounded-full border border-white/10 text-text-muted bg-white/5 text-[11px] font-mono tracking-wider">⚙️ Ansible</span>
          </div>

          <div className="mt-10 flex justify-center lg:justify-start gap-8 md:gap-12 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-accent-primary leading-none">M2</p>
              <p className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-widest mt-1">Niveau Ingénieur</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-accent-primary leading-none">2+</p>
              <p className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-widest mt-1">Expériences pro</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-accent-primary leading-none">5+</p>
              <p className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-widest mt-1">Projets infra</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center order-1 lg:order-2"
        >
          <div className="relative w-[220px] h-[280px] md:w-[280px] md:h-[350px] lg:w-[320px] lg:h-[400px]">
            <div className="absolute -inset-6 md:-inset-10 border border-dashed border-accent-primary/20 rounded-full animate-spin-slow">
              <div className="absolute top-1/4 right-0 w-2 h-2 md:w-3 md:h-3 bg-accent-primary rounded-full shadow-[0_0_15px_rgba(0,180,255,1)]"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary to-accent-primary opacity-10 animate-morph"></div>
            
            <div className="absolute inset-4 bg-bg-secondary border border-white/10 animate-morph overflow-hidden shadow-2xl">
              <img
                src="/images/propos.jpg"
                alt="Ahamed Hassani M'homa"
                className="w-full h-full object-cover transition-all duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://picsum.photos/seed/ahamed/600/800";
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="absolute -bottom-2 -right-8 glass px-4 py-3 rounded-xl shadow-2xl border-white/10">
              <p className="text-success font-bold text-[11px] mb-0.5">🟢 Open to work</p>
              <p className="text-text-muted text-[10px] font-mono">Stage / Alternance 2026</p>
            </div>

            <div className="absolute -top-4 md:top-8 -left-4 md:-left-8 glass px-3 py-2 rounded-xl shadow-xl border-white/10 z-20">
              <p className="text-accent-primary text-[9px] md:text-[10px] font-mono">☁️ DevOps · Cloud · Linux</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
