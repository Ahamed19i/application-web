
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag, Share2, Clock, User, Bookmark, FileDown } from 'lucide-react';
import { Post } from '../types';
import Markdown from 'react-markdown';

export const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: Post) => p.id === Number(id));
        setPost(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.title,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6">
        <h1 className="text-4xl font-bold mb-4">Article introuvable</h1>
        <button onClick={() => navigate('/')} className="btn-p">Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg pt-32 pb-20"
    >
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-accent-primary font-mono text-sm mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} />
          RETOUR AUX ARTICLES
        </button>

        <article className="space-y-12">
          <header className="space-y-6 md:space-y-8 text-center">
            <div className="flex justify-center gap-3">
              <span className="px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[10px] font-mono uppercase tracking-widest border border-accent-primary/20">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight px-2">
              {post.title}
            </h1>

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap justify-center items-center gap-4 md:gap-8 text-text-muted text-[10px] md:text-sm font-mono uppercase tracking-widest">
              <div className="flex items-center justify-center gap-2">
                <Calendar size={14} className="text-accent-primary" />
                {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock size={14} className="text-accent-primary" />
                5 min de lecture
              </div>
              <div className="flex items-center justify-center gap-2">
                <User size={14} className="text-accent-primary" />
                Ahamed Hassani
              </div>
            </div>
          </header>

          <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://picsum.photos/seed/blog/1200/800";
              }}
            />
          </div>

          <div className="prose prose-invert prose-2xl max-w-none">
            <div className="markdown-body">
              <Markdown>{post.content}</Markdown>
            </div>
          </div>

          <footer className="pt-20 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, i) => (
                  <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-secondary">
                    <Tag size={12} />
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {post.pdf_url && (
                  <a 
                    href={post.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 transition-colors"
                  >
                    <FileDown size={18} />
                    PDF
                  </a>
                )}
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent-primary text-white hover:bg-accent-primary/80 transition-colors shadow-lg shadow-accent-primary/20"
                >
                  <Share2 size={18} />
                  Partager
                </button>
                <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200]">
          <div className="glass px-6 py-3 rounded-full border-accent-primary/30 flex items-center gap-3 shadow-2xl animate-bounce">
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
            <span className="text-xs font-mono tracking-widest text-accent-primary">LIEN COPIÉ</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
