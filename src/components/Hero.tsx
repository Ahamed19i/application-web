
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';

const Counter = ({ value, label }: { value: number; label: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }

    const duration = 1200;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div>
      <p className="text-2xl font-serif font-medium text-text-primary leading-none">{count}+</p>
      <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1 font-mono">{label}</p>
    </div>
  );
};

export const Hero: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, posts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, postsRes] = await Promise.all([
          fetch(`/api/projects?t=${Date.now()}`),
          fetch(`/api/posts?t=${Date.now()}`)
        ]);

        if (!projectsRes.ok || !postsRes.ok) throw new Error('API Error');

        const projects = await projectsRes.json();
        const posts = await postsRes.json();

        const projectCount = Array.isArray(projects)
          ? projects.filter(p => p.published == true || p.published == 1 || p.published === 'true' || p.status === 'published').length
          : 0;
        const postCount = Array.isArray(posts)
          ? posts.filter(p => p.published == true || p.published == 1 || p.published === 'true' || p.status === 'published').length
          : 0;

        setStats({ projects: projectCount, posts: postCount });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section id="home" className="min-h-[70vh] md:min-h-screen flex items-start md:items-center pt-44 md:pt-20 px-6 relative">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_320px] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 order-2 lg:order-1 text-center lg:text-left"
        >
          <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-5 flex items-center justify-center lg:justify-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary"></span>
            Disponible — stage / alternance 2026
          </p>

          <h1 className="font-serif font-medium text-4xl md:text-6xl lg:text-[4.2rem] mb-6 leading-[1.05] tracking-tight text-text-primary">
            Ahamed Hassani Mhoma
          </h1>
          <p className="text-base md:text-lg text-text-secondary uppercase tracking-[0.1em] mb-8 font-mono">
            Ingénieur Systèmes & Réseaux · DevOps
          </p>

          {/* TODO(Ahamed): une phrase de positionnement personnelle — ce que tu fais concrètement,
              dans tes propres mots. Ne pas laisser une formule générique à sa place. */}
          <p className="text-sm md:text-base text-text-secondary mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Ingénieur en <strong className="text-text-primary">Systèmes & Réseaux Télécom</strong> à l'AFI-Université (Dakar),
            spécialisé sur la <strong className="text-text-primary">virtualisation des infrastructures IT</strong>.
            Expérience chez <strong className="text-text-primary">Tunisie Télécom</strong>.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
            <a href="images/cv-ahamed-hassani.pdf" download className="btn-p text-sm">
              Télécharger le CV <Download size={15} />
            </a>
            <a href="#projects" className="btn-g text-sm">
              Voir mes travaux <ArrowRight size={15} />
            </a>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-10">
            {['Linux', 'Windows Server', 'Cloud / AWS', 'Docker', 'Ansible'].map((tag) => (
              <span key={tag} className="px-3 py-1 border border-border text-text-secondary text-[11px] font-mono tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-border">
            <div>
              <p className="text-2xl font-serif font-medium text-text-primary leading-none">M2</p>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1 font-mono">Niveau ingénieur</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-medium text-text-primary leading-none">3</p>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1 font-mono">Stages</p>
            </div>
            <Counter value={stats.projects} label="Projets infra" />
            <Counter value={stats.posts} label="Articles publiés" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center order-1 lg:order-2 mt-12 lg:mt-0"
        >
          <div className="w-[220px] md:w-[260px] lg:w-[280px] aspect-[4/5] border border-border overflow-hidden">
            <img
              src="/images/propos.jpg"
              alt="Ahamed Hassani Mhoma"
              className="w-full h-full object-cover grayscale"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
