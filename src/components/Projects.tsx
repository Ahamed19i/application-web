
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, Filter, X, Share2, Check, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleShare = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/project/${project.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    }
  };

  const categories = ['Tous', 'Réseau', 'Cloud/DevOps', 'Cybersécurité', 'Automatisation'];

  const filteredProjects = filter === 'Tous' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="pt-16 md:pt-24 pb-16 md:pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">// 02 — Projets</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Mes <span className="text-accent-primary">réalisations</span>
        </h2>
        <div className="w-14 h-1 bg-gradient-to-r from-accent-primary to-transparent rounded-full mb-12"></div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all border ${
                filter === cat 
                  ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/50' 
                  : 'bg-white/5 text-text-muted border-white/10 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-80 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
            <p className="text-text-muted font-mono text-sm">Aucun projet trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                id={`project-${project.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative glass rounded-2xl overflow-hidden hover:border-accent-primary/30 transition-all cursor-pointer flex flex-col"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="aspect-[16/9] overflow-hidden bg-bg-tertiary flex items-center justify-center relative">
                  <img 
                    src={project.image_url || `https://picsum.photos/seed/${project.id}/800/450`} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={(e) => handleShare(e, project)}
                      className="p-2 bg-bg/60 backdrop-blur-md rounded-lg text-white/70 hover:text-accent-primary border border-white/10 hover:border-accent-primary/30 transition-all"
                      title="Partager ce projet"
                    >
                      <Share2 size={14} />
                    </button>
                    <span className={`text-[9px] font-mono px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                      project.category === 'Cloud/DevOps' ? 'bg-warning/10 text-warning border-warning/20' :
                      project.category === 'Réseau' ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20' :
                      project.category === 'Cybersécurité' ? 'bg-danger/10 text-danger border-danger/20' :
                      'bg-success/10 text-success border-success/20'
                    }`}>
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-accent-primary transition-colors">{project.title}</h3>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.stack.split(',').slice(0, 4).map((s, i) => (
                      <span key={i} className="text-[10px] font-mono text-text-muted bg-bg-tertiary px-2 py-0.5 rounded">#{s.trim()}</span>
                    ))}
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg group-hover:border-accent-primary/30 transition-all">
                      ⚡ Détails
                    </div>
                    <ArrowUpRight size={16} className="text-accent-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" />
                  </div>
                </div>
              </motion.div>
            ))}
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
