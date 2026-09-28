
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TimelineEntry, timelineHasStory } from '../types';
import { PageShell } from './PageShell.tsx';
import { MarkdownContent, extractHeadings } from './MarkdownContent.tsx';
import { ArticleToc } from './ArticleToc.tsx';
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

  const headings = useMemo(() => (entry?.content ? extractHeadings(entry.content) : []), [entry]);
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

      {/* La largeur « wide » ne sert plus qu'au sommaire latéral : la
          couverture tient désormais dans la colonne de lecture. */}
      <PageShell width={hasToc ? 'wide' : 'reading'}>
        {/* En-tête */}
        <header className={`max-w-[720px] ${hasToc ? '' : 'mx-auto'}`}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
            <span className="text-accent-primary">{entry.period_label}</span>
            {place && (
              <>
                <span aria-hidden="true">·</span>
                <span>{place}</span>
              </>
            )}
          </p>

          <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-3">
            {entry.title}
          </h1>

          {entry.institution && (
            <p className="text-[17px] font-medium text-text-primary mb-4">{entry.institution}</p>
          )}

          {entry.summary && (
            <p className="text-[16px] sm:text-[17px] text-text-secondary leading-relaxed">{entry.summary}</p>
          )}
        </header>

        {/* Couverture : à peine plus large que la colonne de texte, hauteur
            bornée. Le récit reste l'élément dominant de la page. */}
        {entry.cover_image_url && (
          <figure className={`mt-10 max-w-[760px] ${hasToc ? '' : 'mx-auto'}`}>
            <img
              src={entry.cover_image_url}
              alt={entry.cover_image_alt || entry.title}
              width={760}
              height={420}
              className="w-full aspect-[16/9] max-h-[420px] object-cover rounded-xl border border-border"
              referrerPolicy="no-referrer"
            />
            {entry.cover_image_alt && (
              <figcaption className="mt-2 text-[13px] text-text-muted">{entry.cover_image_alt}</figcaption>
            )}
          </figure>
        )}

        <div className={`mt-12 ${hasToc ? 'xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-16' : ''}`}>
          <div className={`min-w-0 max-w-[720px] ${hasToc ? '' : 'mx-auto'}`}>
            {/* Récit */}
            {entry.content && <MarkdownContent content={entry.content} />}

            {/* Leçons retenues */}
            {lessons.length > 0 && (
              <section aria-labelledby="lecons-heading" className="mt-14 pt-10 border-t border-border">
                <h2 id="lecons-heading" className="text-[12px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-7">
                  Leçons retenues
                </h2>
                <ol className="space-y-6">
                  {lessons.map((lesson, i) => (
                    <li key={i} className="grid grid-cols-[40px_1fr] gap-4">
                      <span className="text-[14px] font-bold text-accent-primary tabular-nums pt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[16px] text-text-primary leading-relaxed">{lesson}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Galerie */}
            {photos.length > 0 && (
              <section aria-labelledby="moments-heading" className="mt-14 pt-10 border-t border-border">
                <h2 id="moments-heading" className="text-[12px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-7">
                  Moments
                </h2>
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
                        <div className="h-[200px] sm:h-[220px] overflow-hidden rounded-xl border border-border bg-bg-secondary">
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

            {/* Navigation entre étapes */}
            {(siblings.prev || siblings.next) && (
              <nav aria-label="Navigation entre étapes" className="mt-14 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
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

          {hasToc && (
            <aside className="hidden xl:block">
              <ArticleToc headings={headings} />
            </aside>
          )}
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
