
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Clock, ArrowRight, Tag, Share2, Check } from 'lucide-react';
import { Post } from '../types';
import Markdown from 'react-markdown';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#post-')) {
        const postId = parseInt(hash.replace('#post-', ''));
        const post = posts.find(p => p.id === postId);
        if (post) {
          setSelectedPost(post);
          const element = document.getElementById('blog');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [posts]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => {
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);

        // Initial check
        const hash = window.location.hash;
        if (hash.startsWith('#post-')) {
          const postId = parseInt(hash.replace('#post-', ''));
          const post = data.find((p: Post) => p.id === postId);
          if (post) {
            setSelectedPost(post);
            setTimeout(() => {
              const element = document.getElementById('blog');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const closePost = () => {
    setSelectedPost(null);
    if (window.location.hash.startsWith('#post-')) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  const handleShare = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.title,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedPost) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex justify-between items-start w-full md:w-auto">
            <button 
              onClick={closePost}
              className="text-accent-primary font-mono text-sm mb-8 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
            >
              &lt; Retour aux articles
            </button>
            <button 
              onClick={(e) => handleShare(e, selectedPost)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-accent-primary border border-white/10 transition-all flex items-center gap-2 text-xs font-mono"
            >
              <Share2 size={16} /> PARTAGER
            </button>
          </div>
        </div>
        
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
    <section id="blog" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">// 03 — Blog</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Derniers <span className="text-accent-primary">articles</span>
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-accent-primary to-transparent rounded-full"></div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-bg-tertiary border border-white/10 rounded-xl pl-12 pr-6 py-3 focus:border-accent-primary outline-none transition-colors text-sm font-mono"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="glass h-64 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                id={`post-${post.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPost(post)}
                className="group relative glass rounded-2xl overflow-hidden hover:border-accent-primary/30 transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-[21/9] overflow-hidden bg-bg-tertiary relative">
                  <img 
                    src={post.image_url || `https://picsum.photos/seed/${post.id}/800/400`} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-[9px] font-mono px-2.5 py-1 rounded-md uppercase tracking-wider bg-accent-primary/10 text-accent-primary border border-accent-primary/20 backdrop-blur-md">
                      {post.category}
                    </span>
                    <button 
                      onClick={(e) => handleShare(e, post)}
                      className="p-1.5 bg-bg/60 backdrop-blur-md rounded-lg text-white/70 hover:text-accent-primary border border-white/10 hover:border-accent-primary/30 transition-all"
                      title="Partager cet article"
                    >
                      <Share2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] text-text-muted flex items-center gap-1.5 font-mono uppercase tracking-widest">
                      <Clock size={12} /> {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent-primary transition-colors leading-tight">{post.title}</h3>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-6 leading-relaxed">
                    {post.content.substring(0, 150).replace(/[#*`]/g, '')}...
                  </p>
                  <div className="flex items-center gap-2 text-accent-primary text-[11px] font-mono uppercase tracking-widest group-hover:gap-4 transition-all">
                    Lire la suite <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="col-span-full text-center py-20 glass rounded-3xl border-dashed border-white/10">
                <p className="text-text-muted font-mono text-sm">Aucun article trouvé pour "{search}"</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-accent-primary text-bg px-6 py-3 rounded-full font-mono text-xs font-bold flex items-center gap-2 shadow-2xl"
          >
            <Check size={16} /> LIEN COPIÉ DANS LE PRESSE-PAPIER
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
