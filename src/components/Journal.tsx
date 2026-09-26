
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Post } from '../types';
import { PageShell } from './PageShell.tsx';

function readingTime(markdown: string): number {
  const words = (markdown || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const Journal: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('/api/posts')
      .then(res => (res.ok ? res.json() : []))
      .then((data: Post[]) => {
        setPosts(Array.isArray(data) ? data.filter(p => p.published) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageShell width="wide">
      <h1 className="text-[34px] sm:text-[44px] font-bold text-text-primary tracking-tight leading-[1.1] mb-3">
        Tout le journal
      </h1>
      <p className="text-text-secondary mb-12">
        {posts.length > 0
          ? `${posts.length} article${posts.length > 1 ? 's' : ''} publié${posts.length > 1 ? 's' : ''}.`
          : ''}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-bg-secondary rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-text-muted">Aucun article publié pour l'instant.</p>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-[130px]">
                Date
              </th>
              <th className="py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Titre
              </th>
              <th className="hidden sm:table-cell py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-[160px]">
                Catégorie
              </th>
              <th className="hidden sm:table-cell py-3 pr-6 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-[120px]">
                Lecture
              </th>
              <th className="hidden sm:table-cell py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-[60px]">
                Lien
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => {
              const href = `/blog/${post.slug || post.id}`;
              return (
                <tr key={post.id} className="group border-b border-border hover:bg-bg-secondary transition-colors">
                  <td className="py-4 pr-6 align-top text-[13px] text-text-muted font-medium whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 pr-6 align-top">
                    <Link
                      to={href}
                      className="text-[15px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="hidden sm:table-cell py-4 pr-6 align-top text-[13px] text-text-secondary">
                    {post.category}
                  </td>
                  <td className="hidden sm:table-cell py-4 pr-6 align-top text-[13px] text-text-secondary whitespace-nowrap">
                    {readingTime(post.content)} min
                  </td>
                  <td className="hidden sm:table-cell py-4 align-top">
                    <Link to={href} aria-label={`Ouvrir ${post.title}`} className="inline-block text-text-muted group-hover:text-accent-primary transition-colors">
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
