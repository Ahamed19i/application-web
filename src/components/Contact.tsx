
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, MapPin, Github, Linkedin, Terminal, ArrowRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">// 05 — Contact</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Travaillons <span className="text-accent-primary">ensemble</span>
        </h2>
        <div className="w-14 h-1 bg-gradient-to-r from-accent-primary to-transparent rounded-full mb-12"></div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="contact-info">
            <h3 className="text-2xl font-bold mb-4">Je suis ouvert aux opportunités</h3>
            <p className="text-text-secondary leading-relaxed mb-10 text-base">
              Recruteur, professionnel IT ou simplement curieux ? Je recherche activement un <strong>stage ou alternance</strong> en systèmes, réseaux, DevOps ou cloud. Réponse garantie en moins de 24h.
            </p>
            
            <div className="flex flex-col gap-4">
              <a href="mailto:ahassanimhoma20@gmail.com" className="group flex items-center gap-4 p-4 glass rounded-2xl border-white/10 hover:border-accent-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-white/10 flex items-center justify-center text-xl group-hover:text-accent-primary transition-colors">
                  📧
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-bold truncate">ahassanimhoma20@gmail.com</p>
                </div>
                <ArrowRight className="text-text-muted group-hover:text-accent-primary transition-colors" size={16} />
              </a>

              <a href="tel:+221787942729" className="group flex items-center gap-4 p-4 glass rounded-2xl border-white/10 hover:border-accent-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-white/10 flex items-center justify-center text-xl group-hover:text-accent-primary transition-colors">
                  📞
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Téléphone</p>
                  <p className="text-sm font-bold truncate">+221 78 794 27 29</p>
                </div>
                <ArrowRight className="text-text-muted group-hover:text-accent-primary transition-colors" size={16} />
              </a>

              <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 glass rounded-2xl border-white/10 hover:border-accent-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-white/10 flex items-center justify-center text-xl group-hover:text-accent-primary transition-colors">
                  💻
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">GitHub</p>
                  <p className="text-sm font-bold truncate">github.com/ahamed19i</p>
                </div>
                <ArrowRight className="text-text-muted group-hover:text-accent-primary transition-colors" size={16} />
              </a>

              <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 glass rounded-2xl border-white/10 hover:border-accent-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-white/10 flex items-center justify-center text-xl group-hover:text-accent-primary transition-colors">
                  💼
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">LinkedIn</p>
                  <p className="text-sm font-bold truncate">Ahamed Hassani Mhoma</p>
                </div>
                <ArrowRight className="text-text-muted group-hover:text-accent-primary transition-colors" size={16} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-accent-primary/5 blur-3xl rounded-full"></div>
            <form onSubmit={handleSubmit} className="relative glass p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold mb-2">Envoyer un message</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Nom</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-bg-tertiary border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-bg-tertiary border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Sujet</label>
                <select 
                  required
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-bg-tertiary border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm appearance-none"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="Proposition de stage">Proposition de stage</option>
                  <option value="Opportunité professionnelle">Opportunité professionnelle</option>
                  <option value="Collaboration technique">Collaboration technique</option>
                  <option value="Question sur un projet">Question sur un projet</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-bg-tertiary border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors resize-none text-sm"
                  placeholder="Décrivez votre proposition..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={status === 'sending'}
                className="btn-p w-full justify-center"
              >
                {status === 'sending' ? (
                  <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
                ) : (
                  <>
                    Envoyer le message <Send size={16} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="text-success text-center text-[11px] font-mono">✅ Message envoyé avec succès !</p>
              )}
              {status === 'error' && (
                <p className="text-danger text-center text-[11px] font-mono">❌ Une erreur est survenue.</p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
