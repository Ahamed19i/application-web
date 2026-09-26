
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, FileDown } from 'lucide-react';
import { Project } from '../types';
import { PageShell } from './PageShell.tsx';
import { MarkdownContent, extractHeadings } from './MarkdownContent.tsx';
import { ArticleToc } from './ArticleToc.tsx';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [siblings, setSiblings] = useState<{ prev: Project | null; next: Project | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);

    fetch(`/api/projects/${slug}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
      .then((data: Project) => {
        setProject(data);
        setLoading(false);
        return fetch('/api/projects');
      })
      .then(res => (res && res.ok ? res.json() : []))
      .then((all: Project[]) => {
        if (!Array.isArray(all)) return;
        const published = all.filter(p => p.published);
        const index = published.findIndex(p => String(p.slug) === slug || String(p.id) === slug);
        if (index === -1) return;
        setSiblings({
          prev: published[index - 1] ?? null,
          next: published[index + 1] ?? null,
        });
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const headings = useMemo(() => (project ? extractHeadings(project.content || '') : []), [project]);
  const hasToc = headings.length >= 2;

  if (loading) {
    return (
      <PageShell>
        <div className="py-24 flex justify-center">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell>
        <div className="py-24">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Projet introuvable</h1>
          <p className="text-text-secondary mb-8">Ce projet n'existe pas ou n'est plus publié.</p>
          <Link to="/travaux" className="inline-flex items-center gap-2 text-accent-primary font-semibold">
            <ArrowLeft size={16} /> Retour aux projets
          </Link>
        </div>
      </PageShell>
    );
  }

  const stack = (project.stack || '').split(',').map(s => s.trim()).filter(Boolean);

  const facts: { label: string; value: React.ReactNode }[] = [];
  if (project.year) facts.push({ label: 'Année', value: String(project.year) });
  if (project.category) facts.push({ label: 'Catégorie', value: project.category });
  if (project.status) facts.push({ label: 'Statut', value: project.status });

  return (
    <PageShell>
      <div className={hasToc ? 'xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-16' : ''}>
        <article className={`min-w-0 max-w-[720px] ${hasToc ? '' : 'mx-auto'}`}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
            <span className="text-accent-primary">Projet</span>
            {project.category && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.category}</span>
              </>
            )}
          </p>

          <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-6">
            {project.title}
          </h1>

          {project.description && (
            <p className="text-[17px] sm:text-[18px] text-text-secondary leading-relaxed mb-8">
              {project.description}
            </p>
          )}

          {(facts.length > 0 || stack.length > 0 || project.github_url || project.pdf_url) && (
            <div className="rounded-xl border border-border p-5 mb-10 space-y-4">
              {facts.length > 0 && (
                <dl className="flex flex-wrap gap-x-10 gap-y-4">
                  {facts.map(fact => (
                    <div key={fact.label}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">{fact.label}</dt>
                      <dd className="text-[14px] font-medium text-text-primary">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {stack.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(project.github_url || project.pdf_url) && (
                <div className="flex flex-wrap gap-4 pt-1">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-text-primary hover:text-accent-primary transition-colors"
                    >
                      <Github size={15} /> Code source <ArrowUpRight size={13} />
                    </a>
                  )}
                  {project.pdf_url && (
                    <a
                      href={project.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-text-primary hover:text-accent-primary transition-colors"
                    >
                      <FileDown size={15} /> Rapport (PDF) <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {project.image_url && (
            <figure className="mb-10">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full rounded-xl border border-border"
                referrerPolicy="no-referrer"
              />
            </figure>
          )}

          {project.content && <MarkdownContent content={project.content} />}

          {(siblings.prev || siblings.next) && (
            <nav aria-label="Navigation entre projets" className="mt-12 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
              {siblings.prev ? (
                <Link
                  to={`/project/${siblings.prev.slug || siblings.prev.id}`}
                  className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" /> Projet précédent
                  </span>
                  <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                    {siblings.prev.title}
                  </span>
                </Link>
              ) : <span />}
              {siblings.next && (
                <Link
                  to={`/project/${siblings.next.slug || siblings.next.id}`}
                  className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors sm:text-right"
                >
                  <span className="flex items-center gap-1.5 sm:justify-end text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Projet suivant <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                    {siblings.next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          <Link
            to="/travaux"
            className="group inline-flex items-center gap-2 mt-12 text-[14px] font-semibold text-text-secondary hover:text-accent-primary transition-colors"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Retour aux projets
          </Link>
        </article>

        {hasToc && (
          <aside className="hidden xl:block">
            <ArticleToc headings={headings} />
          </aside>
        )}
      </div>
    </PageShell>
  );
};
