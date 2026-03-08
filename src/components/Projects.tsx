
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, Filter, X } from 'lucide-react';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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

  const categories = ['Tous', 'Réseau', 'Cloud/DevOps', 'Cybersécurité', 'Automatisation'];

  const filteredProjects = filter === 'Tous' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
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
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative glass rounded-2xl overflow-hidden hover:border-accent-primary/30 transition-all cursor-pointer flex flex-col"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-[16/9] overflow-hidden bg-bg-tertiary flex items-center justify-center relative">
                  <img 
                    src={project.image_url || `https://picsum.photos/seed/${project.id}/800/450`} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
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

                  <div className="mt-auto flex gap-3">
                    <div className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg group-hover:border-accent-primary/30 transition-all">
                      ⚡ Détails
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <img 
                    src={selectedProject.image_url || `https://picsum.photos/seed/${selectedProject.id}/800/450`} 
                    alt={selectedProject.title}
                    className="w-full rounded-2xl border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex gap-4 mt-6">
                    {selectedProject.github_url && (
                      <a 
                        href={selectedProject.github_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-grow py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <Github size={20} /> Code Source
                      </a>
                    )}
                    <button className="flex-grow py-3 bg-accent-primary text-bg font-bold rounded-xl flex items-center justify-center gap-2 hover:glow-primary transition-all">
                      <ExternalLink size={20} /> Démo Live
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-accent-primary font-mono text-sm mb-2 block">{selectedProject.category}</span>
                  <h2 className="text-3xl font-bold mb-4">{selectedProject.title}</h2>
                  <div className="prose prose-invert max-w-none text-white/70 mb-8">
                    <p>{selectedProject.content || selectedProject.description}</p>
                  </div>
                  
                  <h4 className="font-mono text-sm text-white/40 uppercase tracking-widest mb-4">Stack Technologique</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.split(',').map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-lg text-xs font-mono">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
