import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Experience, experienceHasStory, experienceOrganization } from '../types';
import { PageShell } from './PageShell.tsx';
import { Heading, MarkdownContent, extractHeadings, frenchSpacing } from './MarkdownContent.tsx';
import { AppendixTitle, InlineToc, ReadingFrame, appendixHeading, readingMinutes } from './ReadingGuide.tsx';
import { Lightbox } from './Lightbox.tsx';

/** Une ligne de la fiche. Rien ne s'affiche sans valeur. */
const Fact: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2">{label}</dt>
    <dd className="text-[14px] font-medium text-text-primary leading-snug">{children}</dd>
  </div>
);

export const ExperienceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [entry, setEntry] = useState<Experience | null>(null);
  const [siblings, setSiblings] = useState<{ prev: Experience | null; next: Experience | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);
    setLightboxIndex(null);

    fetch(`/api/experiences/${slug}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
      .then((data: Experience) => {
        setEntry(data);
        setLoading(false);
        return fetch('/api/experiences');
      })
      .then(res => (res && res.ok ? res.json() : []))
      .then((all: Experience[]) => {
        if (!Array.isArray(all)) return;
        // La liste est de la plus récente à la plus ancienne.
        const withStory = all.filter(experienceHasStory);
        const index = withStory.findIndex(e => e.slug === slug);
        if (index === -1) return;
        setSiblings({
          prev: withStory[index - 1] ?? null,
          next: withStory[index + 1] ?? null,
        });
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Le sommaire couvre le récit puis les rubriques qui le suivent.
  const headings = useMemo<Heading[]>(() => {
    if (!entry) return [];
    const list = entry.content ? extractHeadings(entry.content) : [];
    if ((entry.achievements?.length ?? 0) > 0) list.push(appendixHeading('rubrique-realisations', 'Ce que j’ai réalisé'));
    if ((entry.lessons?.length ?? 0) > 0) list.push(appendixHeading('rubrique-lecons', 'Leçons retenues'));
    if ((entry.photos?.length ?? 0) > 0) list.push(appendixHeading('rubrique-moments', 'Moments'));
    return list;
  }, [entry]);
  const minutes = readingMinutes(
    [entry?.content, ...(entry?.achievements ?? []), ...(entry?.lessons ?? [])].filter(Boolean).join(' ')
  );

  if (loading) {
    return (
      <PageShell>
        <div className="py-24 flex justify-center">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageShell>
    );
  }

  if (!entry) {
    return (
      <PageShell>
        <div className="py-24">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Expérience introuvable</h1>
          <p className="text-text-secondary mb-8">Cette expérience n'existe pas ou n'est pas publiée.</p>
          <Link to="/#experience" className="inline-flex items-center gap-2 text-accent-primary font-semibold">
            <ArrowLeft size={16} /> Retour aux expériences
          </Link>
        </div>
      </PageShell>
    );
  }

  const org = experienceOrganization(entry);
  const photos = entry.photos ?? [];
  const achievements = entry.achievements ?? [];
  const lessons = entry.lessons ?? [];
  const technologies = entry.technologies ?? [];
  const place = [entry.location, entry.remote ? 'à distance' : null].filter(Boolean).join(' · ');
  const shareImage = entry.cover_image_url || photos[0]?.image_url;

  return (
    <>
      <Helmet>
        <title>{`${entry.role}${org ? ` — ${org}` : ''} — Ahamed Hassani Mhoma`}</title>
        <meta name="description" content={entry.summary || `${entry.role}${org ? `, ${org}` : ''}${place ? `, ${place}` : ''}`} />
        <meta property="og:title" content={`${entry.role}${org ? ` — ${org}` : ''} — Ahamed Hassani Mhoma`} />
        {entry.summary && <meta property="og:description" content={entry.summary} />}
        {shareImage && <meta property="og:image" content={shareImage} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content={shareImage ? 'summary_large_image' : 'summary'} />
      </Helmet>

      <PageShell>
        <ReadingFrame headings={headings} minutes={minutes} label="Dans cette expérience">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
            <span className="text-accent-primary">{entry.type}</span>
            <span aria-hidden="true">·</span>
            <span>{entry.period_label}</span>
            <span aria-hidden="true">·</span>
            <span>{minutes} min de lecture</span>
          </p>

          <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-3">
            {frenchSpacing(entry.role)}
          </h1>

          {org && (
            entry.organization_url ? (
              <a
                href={entry.organization_url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 text-[17px] font-medium text-text-primary hover:text-accent-primary transition-colors mb-6"
              >
                {org}
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <p className="text-[17px] font-medium text-text-primary mb-6">{org}</p>
            )
          )}

          {entry.summary && (
            <p className="text-[17px] sm:text-[19px] text-text-secondary leading-relaxed mb-10">{frenchSpacing(entry.summary)}</p>
          )}

          {entry.cover_image_url && (
            <figure className="mb-10 max-w-[760px] lg:max-w-[560px]">
              <img
                src={entry.cover_image_url}
                alt={entry.cover_image_alt || entry.role}
                width={760}
                height={420}
                className="block w-full aspect-[16/9] max-h-[420px] object-cover rounded-xl border border-border"
                referrerPolicy="no-referrer"
              />
              {entry.cover_image_alt && (
                <figcaption className="mt-2 text-[13px] text-text-muted">{entry.cover_image_alt}</figcaption>
              )}
            </figure>
          )}

          {/* Fiche de l'expérience, au même filet que la fiche projet. */}
          <section aria-label="En bref" className="mb-12 border-y border-border divide-y divide-border">
            <dl className="flex flex-wrap gap-x-12 gap-y-5 py-5">
              <Fact label="Période">{entry.period_label}</Fact>
              <Fact label="Type">{entry.type}</Fact>
              {org && <Fact label="Organisation">{org}</Fact>}
              {place && <Fact label="Lieu">{place}</Fact>}
            </dl>

            {technologies.length > 0 && (
              <div className="py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full border border-border text-text-secondary text-[12px] font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <InlineToc headings={headings} label="Dans cette expérience" />

          {entry.content && <MarkdownContent content={entry.content} />}

          {achievements.length > 0 && (
            <section aria-labelledby="rubrique-realisations" className="mt-14">
              <AppendixTitle id="rubrique-realisations">Ce que j’ai réalisé</AppendixTitle>
              <ul className="space-y-4 text-[16px] sm:text-[17px] leading-[1.75]">
                {achievements.map((item, i) => (
                  <li key={i} className="grid grid-cols-[20px_1fr] gap-3">
                    <span aria-hidden="true" className="text-accent-primary">▸</span>
                    <p className="text-text-secondary">{item}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lessons.length > 0 && (
            <section aria-labelledby="rubrique-lecons" className="mt-14">
              <AppendixTitle id="rubrique-lecons">Leçons retenues</AppendixTitle>
              <ol className="space-y-5 text-[16px] sm:text-[17px] leading-[1.75]">
                {lessons.map((lesson, i) => (
                  <li key={i} className="grid grid-cols-[40px_1fr] gap-4">
                    <span className="text-[14px] font-bold text-accent-primary tabular-nums pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-text-secondary">{lesson}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {photos.length > 0 && (
            <section aria-labelledby="rubrique-moments" className="mt-14">
              <AppendixTitle id="rubrique-moments">Moments</AppendixTitle>
              {/* Hauteur identique pour toutes les vignettes, quel que soit
                  le format d'origine : la grille reste régulière et compacte. */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo, i) => (
                  <li key={photo.id ?? i}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="group block w-full text-left"
                      aria-label={`Agrandir : ${photo.alt}`}
                    >
                      <div className="h-[200px] lg:h-[160px] overflow-hidden rounded-xl border border-border bg-bg-secondary">
                        <img
                          src={photo.image_url}
                          alt={photo.alt}
                          loading="lazy"
                          width={320}
                          height={220}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {photo.caption && (
                        <p className="mt-2 text-[13px] text-text-muted leading-snug">{photo.caption}</p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </ReadingFrame>

        <div className="mx-auto max-w-[720px]">
          {(siblings.prev || siblings.next) && (
            <nav aria-label="Navigation entre expériences" className="mt-12 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
              {siblings.prev ? (
                <Link
                  to={`/experience/${siblings.prev.slug}`}
                  className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" /> Expérience précédente
                  </span>
                  <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                    {siblings.prev.role}
                  </span>
                </Link>
              ) : <span />}
              {siblings.next && (
                <Link
                  to={`/experience/${siblings.next.slug}`}
                  className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors sm:text-right"
                >
                  <span className="flex items-center gap-1.5 sm:justify-end text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Expérience suivante <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                    {siblings.next.role}
                  </span>
                </Link>
              )}
            </nav>
          )}

          <Link
            to="/#experience"
            className="group inline-flex items-center gap-2 mt-12 text-[14px] font-semibold text-text-secondary hover:text-accent-primary transition-colors"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Retour aux expériences
          </Link>
        </div>
      </PageShell>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
};
