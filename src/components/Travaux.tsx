
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { PageShell } from './PageShell.tsx';

export const Travaux: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  const hasYear = projects.some(p => !!p.year);

  return (
    <PageShell width="wide">
      <h1 className="text-[34px] sm:text-[44px] font-bold text-text-primary tracking-tight leading-[1.1] mb-3">
        Tous les projets
      </h1>
      <p className="text-text-secondary mb-12">
        {projects.length > 0
          ? `${projects.length} projet${projects.length > 1 ? 's' : ''} publié${projects.length > 1 ? 's' : ''}.`
          : ''}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-bg-secondary rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-text-muted">Aucun projet publié pour l'instant.</p>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {hasYear && (
                <th className="py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-[80px]">
                  Année
                </th>
              )}
              <th className="py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Projet
              </th>
              <th className="hidden sm:table-cell py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-[160px]">
                Catégorie
              </th>
              <th className="hidden lg:table-cell py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Technologies
              </th>
              <th className="hidden sm:table-cell py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-[60px]">
                Lien
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => {
              const stack = (project.stack || '').split(',').map(s => s.trim()).filter(Boolean);
              const href = `/project/${project.slug || project.id}`;
              return (
                <tr key={project.id} className="group border-b border-border hover:bg-bg-secondary transition-colors">
                  {hasYear && (
                    <td className="py-4 pr-6 align-top text-[13px] text-text-muted font-medium whitespace-nowrap">
                      {project.year ?? ''}
                    </td>
                  )}
                  <td className="py-4 pr-6 align-top">
                    <Link
                      to={href}
                      className="text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="hidden sm:table-cell py-4 pr-6 align-top text-[13px] text-text-secondary">
                    {project.category}
                  </td>
                  <td className="hidden lg:table-cell py-4 pr-6 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {stack.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell py-4 align-top">
                    <Link to={href} aria-label={`Ouvrir ${project.title}`} className="inline-block text-text-muted group-hover:text-accent-primary transition-colors">
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </PageShell>
  );
};
