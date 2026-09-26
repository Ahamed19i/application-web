
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

const SkeletonRow: React.FC = () => (
  <div className="py-8 border-b border-border animate-pulse">
    <div className="flex items-center gap-4 mb-3">
      <div className="h-3 w-16 bg-bg-tertiary rounded"></div>
      <div className="h-3 w-24 bg-bg-tertiary rounded"></div>
    </div>
    <div className="h-6 w-2/3 bg-bg-tertiary rounded mb-3"></div>
    <div className="h-4 w-1/2 bg-bg-tertiary rounded"></div>
  </div>
);

export const Travaux: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tous');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('/api/projects')
      .then(res => (res.ok ? res.json() : []))
      .then((data: Project[]) => {
        setProjects(Array.isArray(data) ? data.filter(p => p.published) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map(p => p.category).filter(Boolean));
    return ['Tous', ...Array.from(set)];
  }, [projects]);

  const filtered = filter === 'Tous' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-24 md:pb-32">
      <header className="mb-16 md:mb-20">
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-5">Travaux</p>
        <h1 className="font-serif font-medium text-5xl md:text-7xl text-text-primary mb-6 leading-[1.05] tracking-tight">
          Travaux
        </h1>
        <p className="text-text-secondary text-base md:text-lg max-w-[60ch] leading-relaxed">
          Études de cas d'infrastructure : réseaux, virtualisation et cloud.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider border transition-colors ${
              filter === cat
                ? 'border-accent-primary text-accent-primary'
                : 'border-border text-text-muted hover:border-text-muted hover:text-text-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center border-t border-border">
          <p className="text-text-muted text-sm mb-4">Aucun travail dans cette catégorie pour l'instant.</p>
          {filter !== 'Tous' && (
            <button onClick={() => setFilter('Tous')} className="text-accent-primary text-sm font-medium hover:underline">
              Voir tous les travaux
            </button>
          )}
        </div>
      ) : (
        <div className="border-t border-border">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
            >
              <Link
                to={`/project/${project.slug || project.id}`}
                className="group block py-8 border-b border-border hover:bg-bg-secondary transition-colors -mx-6 px-6"
              >
                <div className="flex items-center gap-3 mb-3 font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  <span className={project.status === 'Terminé' ? 'text-accent-primary' : 'text-warning'}>
                    {project.status || 'En cours'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{project.category}</span>
                </div>
                <h2 className="font-serif font-medium text-xl md:text-2xl text-text-primary mb-2 group-hover:text-accent-primary transition-colors flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </h2>
                <p className="text-text-secondary text-sm max-w-[65ch] leading-relaxed mb-3">
                  {project.description}
                </p>
                {project.stack && (
                  <p className="font-mono text-[11px] text-text-muted tracking-wide">
                    {project.stack.split(',').map(s => s.trim()).join(' · ')}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
