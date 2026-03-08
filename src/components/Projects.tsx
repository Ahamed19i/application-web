
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
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <span className="text-accent-primary">02.</span> Projets
          <div className="h-px bg-white/10 flex-grow"></div>
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-1.5 rounded-full font-mono text-xs transition-all border ${
                filter === cat 
                  ? 'bg-accent-primary text-bg border-accent-primary' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-80 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
            <p className="text-white/40 font-mono">Aucun projet trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative glass rounded-2xl overflow-hidden hover:border-accent-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image_url || `https://picsum.photos/seed/${project.id}/800/450`} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest px-2 py-1 bg-accent-primary/10 rounded">
                      {project.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-1 rounded ${
                      project.status === 'Terminé' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">{project.title}</h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.split(',').slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] font-mono text-white/40">#{s.trim()}</span>
                    ))}
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
    </div>
  );
};
