
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Post } from '../types';
import { PageShell } from './PageShell.tsx';
import { MarkdownContent, extractHeadings } from './MarkdownContent.tsx';
import { ArticleToc } from './ArticleToc.tsx';

function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [siblings, setSiblings] = useState<{ prev: Post | null; next: Post | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent-primary z-[1000] origin-left"
        style={{ scaleX }}
      />
      <PageShell>
        <div className={hasToc ? 'xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-16' : ''}>
          <article className={`min-w-0 max-w-[720px] ${hasToc ? '' : 'mx-auto'}`}>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
              {post.category && <span className="text-accent-primary">{post.category}</span>}
              {post.category && <span aria-hidden="true">·</span>}
              <span>
                {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{readingTime(post.content)} min de lecture</span>
            </p>

            <h1 className="text-[32px] sm:text-[38px] font-bold text-text-primary tracking-tight leading-[1.15] mb-8">
              {post.title}
            </h1>

            {post.image_url && (
              <img
                src={post.image_url}
                alt=""
                className="w-full rounded-xl border border-border mb-10"
                referrerPolicy="no-referrer"
              />
            )}

            <MarkdownContent content={post.content} />

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
          </article>

          {hasToc && (
            <aside className="hidden xl:block">
              <ArticleToc headings={headings} />
            </aside>
          )}
        </div>
      </PageShell>
    </>
  );
};
