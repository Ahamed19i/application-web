import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TimelineEntry, timelineHasStory } from '../types';
import { PageShell } from './PageShell.tsx';
import { Heading, MarkdownContent, extractHeadings, frenchSpacing } from './MarkdownContent.tsx';
import { AppendixTitle, InlineToc, ReadingFrame, appendixHeading, readingMinutes } from './ReadingGuide.tsx';
import { Lightbox } from './Lightbox.tsx';

export const ParcoursDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [entry, setEntry] = useState<TimelineEntry | null>(null);
  const [siblings, setSiblings] = useState<{ prev: TimelineEntry | null; next: TimelineEntry | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);
    setLightboxIndex(null);

    fetch(`/api/timeline/${slug}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
      .then((data: TimelineEntry) => {
        setEntry(data);
        setLoading(false);
        return fetch('/api/timeline');
      })
      .then(res => (res && res.ok ? res.json() : []))
      .then((all: TimelineEntry[]) => {
        if (!Array.isArray(all)) return;
        // Ordre chronologique : la liste est du plus récent au plus ancien.
        const withStory = all.filter(timelineHasStory);
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
    if ((entry.lessons?.length ?? 0) > 0) list.push(appendixHeading('rubrique-lecons', 'Leçons retenues'));
    if ((entry.photos?.length ?? 0) > 0) list.push(appendixHeading('rubrique-moments', 'Moments'));
    return list;
  }, [entry]);
  const minutes = readingMinutes([entry?.content, ...(entry?.lessons ?? [])].filter(Boolean).join(' '));

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
          <h1 className="text-3xl font-bold text-text-primary mb-4">Étape introuvable</h1>
          <p className="text-text-secondary mb-8">Cette étape du parcours n'existe pas ou n'est pas publiée.</p>
          <Link to="/#parcours" className="inline-flex items-center gap-2 text-accent-primary font-semibold">
            <ArrowLeft size={16} /> Retour au parcours
          </Link>
        </div>
      </PageShell>
    );
  }

  const place = [entry.city, entry.country].filter(Boolean).join(', ');
  const photos = entry.photos ?? [];
  const lessons = entry.lessons ?? [];
  const shareImage = entry.cover_image_url || photos[0]?.image_url;

  return (
    <>
      <Helmet>
        <title>{`${entry.title} — Ahamed Hassani Mhoma`}</title>
        <meta name="description" content={entry.summary || `${entry.title}, ${entry.institution ?? ''} ${place}`.trim()} />
        <meta property="og:title" content={`${entry.title} — Ahamed Hassani Mhoma`} />
        {entry.summary && <meta property="og:description" content={entry.summary} />}
        {shareImage && <meta property="og:image" content={shareImage} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content={shareImage ? 'summary_large_image' : 'summary'} />
      </Helmet>

      <PageShell>
        <ReadingFrame headings={headings} minutes={minutes} label="Dans cette étape">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
            <span className="text-accent-primary">{entry.period_label}</span>
            {place && (
              <>
                <span aria-hidden="true">·</span>
                <span>{place}</span>
              </>
            )}
            {entry.content && (
              <>
                <span aria-hidden="true">·</span>
                <span>{minutes} min de lecture</span>
              </>
            )}
          </p>

          <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-3">
            {frenchSpacing(entry.title)}
          </h1>

          {entry.institution && (
            <p className="text-[17px] font-medium text-text-primary mb-6">{entry.institution}</p>
          )}

          {entry.summary && (
            <p className="text-[17px] sm:text-[19px] text-text-secondary leading-relaxed mb-10">{frenchSpacing(entry.summary)}</p>
          )}

          {entry.cover_image_url && (
            <figure className="mb-10 max-w-[760px] lg:max-w-[560px]">
              <img
                src={entry.cover_image_url}
                alt={entry.cover_image_alt || entry.title}
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

          <InlineToc headings={headings} label="Dans cette étape" />

          {entry.content && <MarkdownContent content={entry.content} />}

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
            <nav aria-label="Navigation entre étapes" className="mt-12 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
              {siblings.prev ? (
                <Link
                  to={`/parcours/${siblings.prev.slug}`}
                  className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" /> Étape précédente
                  </span>
                  <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                    {siblings.prev.title}
                  </span>
                </Link>
              ) : <span />}
              {siblings.next && (
                <Link
                  to={`/parcours/${siblings.next.slug}`}
                  className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors sm:text-right"
                >
                  <span className="flex items-center gap-1.5 sm:justify-end text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Étape suivante <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                    {siblings.next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          <Link
            to="/#parcours"
            className="group inline-flex items-center gap-2 mt-12 text-[14px] font-semibold text-text-secondary hover:text-accent-primary transition-colors"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Retour au parcours
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
