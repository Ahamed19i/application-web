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
    <section className="min-h-screen flex items-center pt-20 px-6">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            DISPONIBLE POUR NOUVELLES OPPORTUNITÉS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Ahamed Hassani <br />
            <span className="text-gradient">M'homa</span>
          </h1>
          
          <div className="h-8 mb-8">
            <p className="text-xl md:text-2xl font-mono text-white/70">
              &gt; <span className="typing-cursor">{text}</span>
            </p>
          </div>

          <p className="text-lg text-white/60 mb-10 max-w-lg leading-relaxed">
            Étudiant en Master 2 Systèmes, Réseaux & Télécommunications à Dakar. 
            Passionné par l'automatisation, la sécurité des infrastructures et le Cloud.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="px-8 py-4 bg-accent-primary text-bg font-bold rounded-lg hover:glow-primary transition-all flex items-center gap-2 group">
              Voir mes projets
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link to="/contact" className="px-8 py-4 glass font-bold rounded-lg hover:bg-white/5 transition-all">
              Me contacter
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-3xl font-mono font-bold text-accent-primary">15+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Projets</p>
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-accent-secondary">5+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Certifications</p>
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-white">20+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Technologies</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="relative z-10 glass p-8 rounded-2xl border-accent-primary/20 glow-primary">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-xs font-mono text-white/40 ml-2">ahamed@portfolio: ~</span>
            </div>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex gap-3">
                <Terminal className="text-accent-primary shrink-0" size={18} />
                <p><span className="text-accent-primary">root@dakar:</span><span className="text-accent-secondary">~#</span> neofetch</p>
              </div>
              <div className="pl-7 space-y-1 text-white/80">
                <p><span className="text-accent-primary">OS:</span> Ubuntu 22.04 LTS x86_64</p>
                <p><span className="text-accent-primary">Host:</span> Master 2 SRT Student</p>
                <p><span className="text-accent-primary">Kernel:</span> 5.15.0-generic</p>
                <p><span className="text-accent-primary">Shell:</span> zsh 5.8.1</p>
                <p><span className="text-accent-primary">Location:</span> Dakar, Senegal</p>
                <p><span className="text-accent-primary">Focus:</span> Cloud, DevOps, CyberSec</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Shield className="text-accent-secondary shrink-0" size={18} />
                <p><span className="text-accent-secondary">Sec:</span> Kali Linux, Wireshark, pfSense</p>
              </div>
              <div className="flex gap-3">
                <Cloud className="text-accent-primary shrink-0" size={18} />
                <p><span className="text-accent-primary">Cloud:</span> AWS, Docker, Kubernetes</p>
              </div>
              <div className="flex gap-3">
                <Server className="text-white shrink-0" size={18} />
                <p><span className="text-white">Net:</span> Cisco IOS, GNS3, Ansible</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-primary/10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-secondary/10 blur-3xl rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};
