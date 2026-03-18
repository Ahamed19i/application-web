
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Share2, 
  CheckCircle2, 
  FileDown, 
  ChevronRight,
  Layers,
  Info,
  Globe,
  Code2,
  Terminal
} from 'lucide-react';
import { Project } from '../types';
import Markdown from 'react-markdown';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
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
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: Project) => p.id === Number(id));
        setProject(found || null);
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
        title: project?.title,
        text: project?.description,
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

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6">
        <h1 className="text-4xl font-bold mb-4">Projet introuvable</h1>
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
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-widest text-text-muted mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-accent-primary transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <Link to="/#projects" className="hover:text-accent-primary transition-colors">Projets</Link>
          <ChevronRight size={12} />
          <span className="text-accent-primary truncate max-w-[200px]">{project.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 xl:gap-16">
          {/* Main Content Area */}
          <div className="min-w-0">
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-md bg-accent-primary/10 text-accent-primary text-[10px] font-mono uppercase tracking-widest border border-accent-primary/20">
                  {project.category}
                </span>
                <span className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest border ${
                  project.status === 'Terminé' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-8">
                {project.title}
              </h1>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 italic text-text-secondary leading-relaxed border-l-4 border-l-accent-primary text-lg">
                {project.description}
              </div>
            </header>

            {/* Markdown Content */}
            <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:tracking-tight prose-headings:font-extrabold prose-a:text-accent-primary prose-img:rounded-3xl prose-pre:bg-bg-tertiary prose-pre:border prose-pre:border-white/10 mb-16">
              <div className="markdown-body">
                <Markdown>{project.content}</Markdown>
              </div>
            </div>

            {/* Reports & Documentation Section (Main) */}
            <div className="glass p-10 rounded-3xl border-white/10 bg-gradient-to-br from-accent-primary/5 to-transparent mb-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <FileDown className="text-accent-primary" size={24} />
                    Rapports & Documentation
                  </h2>
                  <p className="text-text-muted text-sm">Accédez aux documents détaillés et aux rapports de performance de ce projet.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {project.pdf_url ? (
                    <a 
                      href={project.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-bg font-bold hover:glow-primary transition-all text-sm"
                    >
                      <ExternalLink size={18} />
                      Voir le Rapport
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-text-muted font-bold text-sm cursor-not-allowed">
                      <FileDown size={18} />
                      Rapport non disponible
                    </span>
                  )}
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary font-bold hover:bg-white/10 transition-all text-sm"
                  >
                    <Share2 size={18} />
                    Partager
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section - CTA */}
            <div className="pt-16 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-12 rounded-[2rem] bg-accent-primary/5 border border-accent-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 blur-[100px] -z-10 group-hover:bg-accent-primary/20 transition-colors"></div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-4">Intéressé par ce projet ?</h3>
                  <p className="text-text-secondary max-w-md">Discutons de la manière dont je peux apporter une expertise similaire à votre infrastructure.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/#contact" className="btn-p px-8 py-4 text-center">
                    Me contacter
                  </Link>
                  <button onClick={handleShare} className="btn-gr px-8 py-4 flex items-center justify-center gap-2">
                    <Share2 size={18} />
                    Partager ce projet
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-32 space-y-8">
              {/* Project Info Card */}
              <div className="glass p-8 rounded-3xl border-white/10 space-y-8 shadow-xl">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-accent-primary"></div>
                    Spécifications
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0">
                        <Layers size={16} className="text-accent-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Stack Technique</p>
                        <p className="text-sm font-medium text-text-primary">{project.stack}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Statut</p>
                        <p className="text-sm font-medium text-text-primary">{project.status}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0">
                        <Calendar size={16} className="text-accent-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Date de réalisation</p>
                        <p className="text-sm font-medium text-text-primary">Mars 2024</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 space-y-4">
                  {project.pdf_url && (
                    <a 
                      href={project.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-4 rounded-2xl bg-accent-primary/5 border border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10 transition-all group"
                    >
                      <span className="flex items-center gap-3 text-sm font-bold">
                        <FileDown size={18} />
                        Rapport Technique (PDF)
                      </span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}

                  {project.github_url && (
                    <a 
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <span className="flex items-center gap-3 text-sm font-bold">
                        <Github size={18} className="text-accent-primary" />
                        Code Source
                      </span>
                      <ChevronRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                  
                  <button 
                    onClick={handleShare}
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-accent-primary text-bg font-bold hover:glow-primary transition-all group"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <Share2 size={18} />
                      Partager le projet
                    </span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
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
