
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Share2, 
  Clock, 
  User, 
  Bookmark, 
  FileDown, 
  ChevronRight,
  MessageCircle,
  Hash,
  Terminal,
  Info,
  Code2,
  Layers,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { Post } from '../types';
import Markdown from 'react-markdown';

export const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
      className="min-h-screen bg-bg pb-20"
    >
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-[1400px] mx-auto px-6 pt-32">
        {/* Breadcrumbs - MDN Style */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-widest text-text-muted mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-accent-primary transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <Link to="/#blog" className="hover:text-accent-primary transition-colors">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-accent-primary truncate max-w-[200px]">{post.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 xl:gap-16">
          {/* Main Content Area */}
          <article className="min-w-0">
            <header id="introduction" className="mb-12 scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-md bg-accent-primary/10 text-accent-primary text-[10px] font-mono uppercase tracking-widest border border-accent-primary/20">
                  {post.category}
                </span>
                <span className="text-text-muted text-[10px] font-mono uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-8">
                {post.title}
              </h3>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30 overflow-hidden">
                  <User size={20} className="text-accent-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">Ahamed Hassani</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Expert DevOps & Cloud</p>
                </div>
              </div>
            </header>

            {/* Markdown Content with MDN-like styling */}
            <div id="concepts" className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:tracking-tight prose-headings:font-extrabold prose-a:text-accent-primary prose-img:rounded-3xl prose-pre:bg-bg-tertiary prose-pre:border prose-pre:border-white/10 mb-16 scroll-mt-32">
              <div className="markdown-body">
                <Markdown>{post.content}</Markdown>
              </div>
            </div>

            {/* Conclusion Section */}
            <div id="conclusion" className="glass p-10 rounded-3xl border-white/10 bg-gradient-to-br from-accent-primary/5 to-transparent mb-16 scroll-mt-32">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <CheckCircle2 className="text-accent-primary" size={24} />
                Conclusion & Prochaines étapes
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                La maîtrise de ces outils est un voyage continu. J'espère que cet article vous a donné les bases nécessaires pour explorer davantage ces technologies fascinantes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xl font-bold text-accent-primary mb-1">1</p>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Expérimenter</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xl font-bold text-accent-primary mb-1">2</p>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Approfondir</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xl font-bold text-accent-primary mb-1">3</p>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Partager</p>
                </div>
              </div>
            </div>

            <footer className="pt-10 border-t border-white/10">
              <div className="flex flex-wrap gap-2 mb-10">
                {post.tags.split(',').map((tag, i) => (
                  <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-secondary hover:border-accent-primary/30 transition-colors cursor-default">
                    <Hash size={12} className="text-accent-primary" />
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div className="glass p-8 rounded-3xl border-accent-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-lg font-bold mb-1">Cet article vous a aidé ?</h4>
                  <p className="text-sm text-text-muted">Partagez-le avec votre réseau ou téléchargez le PDF.</p>
                </div>
                <div className="flex items-center gap-3">
                  {post.pdf_url && (
                    <a 
                      href={post.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      <FileDown size={18} />
                      PDF
                    </a>
                  )}
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-bg font-bold hover:glow-primary transition-all"
                  >
                    <Share2 size={18} />
                    Partager
                  </button>
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar - MDN Style */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-10">
              {/* Table of Contents Placeholder */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-accent-primary"></div>
                  Dans cet article
                </h3>
                <nav className="space-y-4 border-l border-white/10 ml-2">
                  <a href="#introduction" className="block pl-4 text-sm text-text-muted hover:text-accent-primary transition-colors">Introduction</a>
                  <a href="#concepts" className="block pl-4 text-sm text-text-muted hover:text-accent-primary transition-colors">Concepts Clés</a>
                  <a href="#concepts" className="block pl-4 text-sm text-text-muted hover:text-accent-primary transition-colors">Mise en œuvre</a>
                  <a href="#conclusion" className="block pl-4 text-sm text-text-muted hover:text-accent-primary transition-colors">Conclusion</a>
                </nav>
              </div>

              {/* Quick Metadata */}
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center gap-4 text-text-secondary">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                    <Clock size={18} className="text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Temps de lecture</p>
                    <p className="text-sm font-bold">~5 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-text-secondary">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                    <MessageCircle size={18} className="text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Commentaires</p>
                    <p className="text-sm font-bold">0</p>
                  </div>
                </div>
                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                  <Bookmark size={14} className="group-hover:text-accent-primary transition-colors" />
                  Sauvegarder l'article
                </button>
              </div>

              {/* Related Links / Resources */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Ressources utiles</h4>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent-primary transition-colors">
                    <Globe size={14} /> Documentation officielle
                  </a>
                  <a href="#" className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent-primary transition-colors">
                    <Code2 size={14} /> Exemples de code (GitHub)
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
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
