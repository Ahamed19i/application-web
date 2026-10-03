
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, FileDown } from 'lucide-react';
import { Project } from '../types';
import { PageShell } from './PageShell.tsx';
import { MarkdownContent, extractHeadings, frenchSpacing } from './MarkdownContent.tsx';
import { InlineToc, ReadingFrame, readingMinutes } from './ReadingGuide.tsx';

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
  const minutes = readingMinutes(project?.content || '');

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

  return (
    <PageShell>
      <ReadingFrame headings={headings} minutes={minutes} label="Dans ce projet">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
          <span className="text-accent-primary">{project.category || 'Projet'}</span>
          {project.year && (
            <>
              <span aria-hidden="true">·</span>
              <span>{project.year}</span>
            </>
          )}
          {project.content && (
            <>
              <span aria-hidden="true">·</span>
              <span>{minutes} min de lecture</span>
            </>
          )}
        </p>

        <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-6">
          {frenchSpacing(project.title)}
        </h1>

        {project.description && (
          <p className="text-[17px] sm:text-[19px] text-text-secondary leading-relaxed mb-10">
            {frenchSpacing(project.description)}
          </p>
        )}

        {/* Même ouverture que le journal : la couverture, puis la fiche du
            projet, puis le plan du récit. */}
        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            width={760}
            height={420}
            className="block w-full max-w-[760px] lg:max-w-[560px] aspect-[16/9] max-h-[420px] object-cover rounded-xl border border-border mb-10"
            referrerPolicy="no-referrer"
          />
        )}

        {(project.status || stack.length > 0 || project.github_url || project.pdf_url) && (
          <div className="mb-12 border-y border-border divide-y divide-border">
            {(project.status || stack.length > 0) && (
              <dl className="flex flex-wrap gap-x-12 gap-y-5 py-5">
                {project.status && (
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2">Statut</dt>
                    <dd className="text-[14px] font-medium text-text-primary">{project.status}</dd>
                  </div>
                )}
                {stack.length > 0 && (
                  <div className="min-w-0 flex-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2">Technologies</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {stack.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-full border border-border text-text-secondary text-[12px] font-medium">
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            )}

            {(project.github_url || project.pdf_url) && (
              <div className="flex flex-wrap gap-3 py-5">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] font-semibold text-text-primary hover:border-accent-primary hover:text-accent-primary transition-colors"
                  >
                    <Github size={15} /> Code source
                    <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                {project.pdf_url && (
                  <a
                    href={project.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] font-semibold text-text-primary hover:border-accent-primary hover:text-accent-primary transition-colors"
                  >
                    <FileDown size={15} /> Rapport (PDF)
                    <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        <InlineToc headings={headings} label="Dans ce projet" />

        {project.content && <MarkdownContent content={project.content} />}
      </ReadingFrame>

      <div className="mx-auto max-w-[720px]">
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
      </div>
    </PageShell>
  );
};
