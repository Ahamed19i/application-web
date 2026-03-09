
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Share2, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';
import Markdown from 'react-markdown';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

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
      className="min-h-screen bg-bg pt-32 pb-20"
    >
      <div className="max-w-5xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-accent-primary font-mono text-sm mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} />
          RETOUR AUX PROJETS
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-16">
          <div className="space-y-12">
            <header>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[10px] font-mono uppercase tracking-widest border border-accent-primary/20">
                  {project.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-success/10 text-success text-[10px] font-mono uppercase tracking-widest border border-success/20">
                  {project.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                {project.title}
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed font-light italic border-l-4 border-accent-primary pl-6 py-2">
                {project.description}
              </p>
            </header>

            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://picsum.photos/seed/project/1200/800";
                }}
              />
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <div className="markdown-body">
                <Markdown>{project.content}</Markdown>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="glass p-8 rounded-3xl border-white/10 space-y-8 sticky top-32">
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.split(',').map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-secondary">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4">
                {project.github_url && (
                  <a 
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <Github size={18} />
                      Code Source
                    </span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                
                <button 
                  onClick={handleShare}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 text-accent-primary hover:bg-accent-primary/20 transition-colors group"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Share2 size={18} />
                    Partager le projet
                  </span>
                </button>
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 text-success">
                  <CheckCircle2 size={18} />
                  <span className="text-xs font-mono uppercase tracking-widest">Projet Validé</span>
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
