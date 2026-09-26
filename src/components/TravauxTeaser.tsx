
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

export const TravauxTeaser: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => (res.ok ? res.json() : []))
      .then((data: Project[]) => {
        setProjects(Array.isArray(data) ? data.filter(p => p.published).slice(0, 3) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 md:py-28 px-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">Travaux</p>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-text-primary tracking-tight">
              Travaux récents
            </h2>
          </div>
          <Link to="/travaux" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors shrink-0">
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-bg-tertiary rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="border-t border-border">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.slug || project.id}`}
                className="group block py-6 border-b border-border hover:bg-bg-secondary transition-colors -mx-6 px-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif font-medium text-lg md:text-xl text-text-primary group-hover:text-accent-primary transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight size={16} className="text-text-muted group-hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                </div>
                <p className="text-text-secondary text-sm mt-1.5 max-w-[65ch] line-clamp-1">{project.description}</p>
              </Link>
            ))}
          </div>
        )}

        <Link to="/travaux" className="sm:hidden mt-8 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors">
          Tout voir <ArrowRight size={14} />
        </Link>
      </motion.div>
    </section>
  );
};
