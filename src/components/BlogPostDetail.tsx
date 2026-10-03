
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Post } from '../types';
import { PageShell } from './PageShell.tsx';
import { MarkdownContent, extractHeadings, frenchSpacing } from './MarkdownContent.tsx';
import { InlineToc, ReadingFrame, readingMinutes } from './ReadingGuide.tsx';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [siblings, setSiblings] = useState<{ prev: Post | null; next: Post | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);

    fetch(`/api/posts/${slug}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
      .then((data: Post) => {
        setPost(data);
        setLoading(false);
        return fetch('/api/posts');
      })
      .then(res => (res && res.ok ? res.json() : []))
      .then((all: Post[]) => {
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

  const headings = useMemo(() => (post ? extractHeadings(post.content) : []), [post]);
  const minutes = readingMinutes(post?.content || '');

  if (loading) {
    return (
      <PageShell>
        <div className="py-24 flex justify-center">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageShell>
    );
  }

  if (!post) {
    return (
      <PageShell>
        <div className="py-24">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Article introuvable</h1>
          <p className="text-text-secondary mb-8">Cet article n'existe pas ou n'est plus publié.</p>
          <Link to="/#journal" className="inline-flex items-center gap-2 text-accent-primary font-semibold">
            <ArrowLeft size={16} /> Retour au journal
          </Link>
        </div>
      </PageShell>
    );
  }

  const tags = (post.tags || '').split(',').map(t => t.trim()).filter(Boolean);

  return (
    <PageShell>
      <ReadingFrame headings={headings} minutes={minutes} label="Dans cet article">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
          {post.category && <span className="text-accent-primary">{post.category}</span>}
          {post.category && <span aria-hidden="true">·</span>}
          <span>
            {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span aria-hidden="true">·</span>
          <span>{minutes} min de lecture</span>
        </p>

        <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-8">
          {frenchSpacing(post.title)}
        </h1>

        {/* Couverture bornée en hauteur : l'article reste l'élément
            dominant, quelle que soit la taille de l'image fournie. */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt=""
            width={760}
            height={420}
            className="block w-full max-w-[760px] lg:max-w-[560px] aspect-[16/9] max-h-[420px] object-cover rounded-xl border border-border mb-10"
            referrerPolicy="no-referrer"
          />
        )}

        <InlineToc headings={headings} label="Dans cet article" />

        <MarkdownContent content={post.content} />
      </ReadingFrame>

      <div className="mx-auto max-w-[720px]">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-bg-secondary border border-border text-text-secondary text-[12px] font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {(siblings.prev || siblings.next) && (
          <nav aria-label="Navigation entre articles" className="mt-12 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
            {siblings.prev ? (
              <Link
                to={`/blog/${siblings.prev.slug || siblings.prev.id}`}
                className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors"
              >
                <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" /> Article précédent
                </span>
                <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                  {siblings.prev.title}
                </span>
              </Link>
            ) : <span />}
            {siblings.next && (
              <Link
                to={`/blog/${siblings.next.slug || siblings.next.id}`}
                className="group rounded-xl border border-border p-4 hover:border-accent-primary transition-colors sm:text-right"
              >
                <span className="flex items-center gap-1.5 sm:justify-end text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Article suivant <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
                <span className="block text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug">
                  {siblings.next.title}
                </span>
              </Link>
            )}
          </nav>
        )}

        <Link
          to="/#journal"
          className="group inline-flex items-center gap-2 mt-12 text-[14px] font-semibold text-text-secondary hover:text-accent-primary transition-colors"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Retour au journal
        </Link>
      </div>
    </PageShell>
  );
};
