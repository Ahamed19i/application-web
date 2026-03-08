import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Clock, ChevronRight, Tag } from 'lucide-react';
import { Post } from '../types';
import Markdown from 'react-markdown';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedPost) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedPost(null)}
          className="text-accent-primary font-mono text-sm mb-8 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
        >
          &lt; Retour aux articles
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img 
            src={selectedPost.image_url || `https://picsum.photos/seed/${selectedPost.id}/1200/600`} 
            alt={selectedPost.title}
            className="w-full aspect-video object-cover rounded-3xl mb-10 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-xs font-mono">
              {selectedPost.category}
            </span>
            <span className="text-white/40 text-sm flex items-center gap-2">
              <Clock size={14} /> {new Date(selectedPost.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-10">{selectedPost.title}</h1>
          
          <div className="markdown-body prose prose-invert max-w-none text-white/80 leading-relaxed">
            <Markdown>{selectedPost.content}</Markdown>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10">
            <h4 className="font-mono text-sm text-white/40 uppercase tracking-widest mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.split(',').map((tag, i) => (
                <span key={i} className="flex items-center gap-1 text-xs text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <Tag size={12} /> {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <h2 className="text-4xl font-bold flex items-center gap-4">
            <span className="text-accent-primary">03.</span> Blog & Tutos
            <div className="h-px bg-white/10 w-20"></div>
          </h2>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un article..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 focus:border-accent-primary outline-none transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-40 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPost(post)}
                className="group glass p-6 rounded-2xl flex flex-col md:flex-row gap-8 hover:border-accent-primary/30 transition-all cursor-pointer"
              >
                <div className="w-full md:w-64 h-40 shrink-0 overflow-hidden rounded-xl">
                  <img 
                    src={post.image_url || `https://picsum.photos/seed/${post.id}/600/400`} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-white/30 flex items-center gap-1 font-mono">
                      <Clock size={10} /> {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-accent-primary transition-colors">{post.title}</h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center text-accent-secondary text-sm font-mono group-hover:gap-2 transition-all">
                    Lire l'article <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-20 glass rounded-3xl">
                <p className="text-white/40 font-mono">Aucun article trouvé pour "{search}"</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
