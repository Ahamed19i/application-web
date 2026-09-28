
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

export const Projets: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => (res.ok ? res.json() : []))
      .then((data: Project[]) => {
        setProjects(Array.isArray(data) ? data.filter(p => p.published) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="projets" aria-labelledby="projets-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="projets-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">Projets</h2>
      </div>
      <h2 className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        Projets
      </h2>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-bg-secondary rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-text-muted text-sm">Aucun projet publié pour l'instant.</p>
      ) : (
        <ul onMouseLeave={() => setHovered(null)}>
          {projects.map((project) => (
            <li
              key={project.id}
              onMouseEnter={() => setHovered(project.id)}
              className="transition-opacity duration-300"
              style={{ opacity: hovered === null || hovered === project.id ? 1 : 0.5 }}
            >
              <Link
                to={`/project/${project.slug || project.id}`}
                onFocus={() => setHovered(project.id)}
                onBlur={() => setHovered(null)}
                className="group grid grid-cols-[88px_1fr] sm:grid-cols-[112px_1fr] gap-4 sm:gap-6 py-5 -mx-4 px-4 rounded-xl transition-colors duration-200 hover:bg-bg-secondary focus-visible:bg-bg-secondary focus-visible:outline-none items-start"
              >
                <div className="w-[88px] h-[66px] sm:w-[112px] sm:h-[84px] rounded-lg border border-border overflow-hidden bg-bg-tertiary shrink-0">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center px-2 text-center">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-text-muted leading-tight">{project.category}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">{project.category}</p>
                  <h3 className="text-[16px] sm:text-[17px] font-semibold text-text-primary flex items-center gap-1.5">
                    <span className="group-hover:text-accent-primary transition-colors">{project.title}</span>
                    <ArrowUpRight size={15} className="text-text-muted group-hover:text-accent-primary transition-colors shrink-0" />
                  </h3>
                  <p className="text-[14px] text-text-secondary mt-1.5 leading-relaxed line-clamp-2">{project.description}</p>
                  {project.stack && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.stack.split(',').slice(0, 4).map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[11px] font-medium">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/travaux"
        className="inline-flex items-center gap-2 mt-2 text-[14px] font-semibold text-text-primary hover:text-accent-primary transition-colors"
      >
        Voir tous les projets →
      </Link>
    </section>
  );
};
