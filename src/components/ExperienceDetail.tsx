
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Experience, experienceHasStory, experienceOrganization } from '../types';
import { PageShell } from './PageShell.tsx';
import { MarkdownContent, extractHeadings } from './MarkdownContent.tsx';
import { ArticleToc } from './ArticleToc.tsx';
import { Lightbox } from './Lightbox.tsx';

/** Une ligne de la carte récapitulative. Rien ne s'affiche sans valeur. */
const Fact: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</dt>
    <dd className="mt-1 text-[14px] text-text-primary leading-snug">{children}</dd>
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

      <PageShell width={hasToc ? 'wide' : 'reading'}>
        {/* En-tête */}
        <header className={`max-w-[720px] ${hasToc ? '' : 'mx-auto'}`}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
            <span className="text-accent-primary">{entry.period_label}</span>
            <span aria-hidden="true">·</span>
            <span>{entry.type}</span>
          </p>

          <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-3">
            {entry.role}
          </h1>

          {org && (
            entry.organization_url ? (
              <a
                href={entry.organization_url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 text-[17px] font-medium text-text-primary hover:text-accent-primary transition-colors mb-4"
              >
                {org}
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <p className="text-[17px] font-medium text-text-primary mb-4">{org}</p>
            )
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
              alt={entry.cover_image_alt || entry.role}
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
            {/* Carte récapitulative */}
            <section aria-labelledby="recap-heading" className="rounded-xl border border-border bg-bg-secondary p-5 sm:p-6">
              <h2 id="recap-heading" className="sr-only">En bref</h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                <Fact label="Période">{entry.period_label}</Fact>
                <Fact label="Type">{entry.type}</Fact>
                {org && <Fact label="Organisation">{org}</Fact>}
                {place && <Fact label="Lieu">{place}</Fact>}
              </dl>

              {technologies.length > 0 && (
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[12px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Récit */}
            {entry.content && (
              <div className="mt-12">
                <MarkdownContent content={entry.content} />
              </div>
            )}

            {/* Ce que j'ai réalisé */}
            {achievements.length > 0 && (
              <section aria-labelledby="realisations-heading" className="mt-14 pt-10 border-t border-border">
                <h2 id="realisations-heading" className="text-[12px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-7">
                  Ce que j'ai réalisé
                </h2>
                <ul className="space-y-5">
                  {achievements.map((item, i) => (
                    <li key={i} className="grid grid-cols-[20px_1fr] gap-3">
                      <span aria-hidden="true" className="text-accent-primary pt-0.5 leading-relaxed">▸</span>
                      <p className="text-[16px] text-text-primary leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

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

            {/* Navigation entre expériences */}
            {(siblings.prev || siblings.next) && (
              <nav aria-label="Navigation entre expériences" className="mt-14 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
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
