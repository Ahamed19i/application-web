
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Post } from '../types';

export const JournalTeaser: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => (res.ok ? res.json() : []))
      .then((data: Post[]) => {
        setPosts(Array.isArray(data) ? data.filter(p => p.published) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="journal" aria-labelledby="journal-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="journal-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">Journal</h2>
      </div>
      <h2 className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        Journal
      </h2>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-bg-secondary rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-text-muted text-sm">Aucun article publié pour l'instant.</p>
      ) : (
        <ul onMouseLeave={() => setHovered(null)}>
          {posts.map((post) => (
            <li
              key={post.id}
              onMouseEnter={() => setHovered(post.id)}
              className="transition-opacity duration-300"
              style={{ opacity: hovered === null || hovered === post.id ? 1 : 0.5 }}
            >
              <Link
                to={`/blog/${post.slug || post.id}`}
                onFocus={() => setHovered(post.id)}
                onBlur={() => setHovered(null)}
                className="group grid grid-cols-[72px_1fr] sm:grid-cols-[96px_1fr] gap-4 sm:gap-6 py-5 -mx-4 px-4 rounded-xl transition-colors duration-200 hover:bg-bg-secondary focus-visible:bg-bg-secondary focus-visible:outline-none items-center"
              >
                <div className="w-[72px] h-[54px] sm:w-[96px] sm:h-[72px] rounded-lg border border-border overflow-hidden bg-bg-tertiary shrink-0">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">Journal</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    {new Date(post.created_at).getFullYear()}
                  </p>
                  <h3 className="text-[16px] sm:text-[17px] font-semibold text-text-primary flex items-center gap-1.5">
                    <span className="group-hover:text-accent-primary transition-colors">{post.title}</span>
                    <ArrowUpRight size={15} className="text-text-muted group-hover:text-accent-primary transition-colors shrink-0" />
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/journal"
        className="inline-flex items-center gap-2 mt-2 text-[14px] font-semibold text-text-primary hover:text-accent-primary transition-colors"
      >
        Voir tout le journal →
      </Link>
    </section>
  );
};
