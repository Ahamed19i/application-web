
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Post } from '../types';

export const JournalTeaser: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => (res.ok ? res.json() : []))
      .then((data: Post[]) => {
        setPosts(Array.isArray(data) ? data.filter(p => p.published).slice(0, 3) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 md:py-28 px-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">Journal</p>
        <h2 className="font-serif font-medium text-3xl md:text-4xl text-text-primary tracking-tight mb-10">
          Derniers articles
        </h2>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-bg-tertiary rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="border-t border-border">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug || post.id}`}
                className="group block py-6 border-b border-border hover:bg-bg-secondary transition-colors -mx-6 px-6"
              >
                <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-2">
                  {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif font-medium text-lg md:text-xl text-text-primary group-hover:text-accent-primary transition-colors">
                    {post.title}
                  </h3>
                  <ArrowUpRight size={16} className="text-text-muted group-hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};
