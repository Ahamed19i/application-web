import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, MapPin, Github, Linkedin, Terminal } from 'lucide-react';

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
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-4">
          <span className="text-accent-primary">04.</span> Contact
          <div className="h-px bg-white/10 flex-grow"></div>
        </h2>

        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <h3 className="text-3xl font-bold mb-6">Parlons de votre <span className="text-gradient">prochain projet</span></h3>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              Que ce soit pour une opportunité d'emploi, une collaboration sur un projet open-source ou simplement pour échanger sur la tech, n'hésitez pas à me contacter.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 group-hover:border-accent-primary transition-colors">
                  <Mail className="text-accent-primary" />
                </div>
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Email</p>
                  <a href="mailto:ahassanimhoma20@gmail.com" className="text-xl font-bold hover:text-accent-primary transition-colors">
                    ahassanimhoma20@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 group-hover:border-accent-secondary transition-colors">
                  <MapPin className="text-accent-secondary" />
                </div>
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Localisation</p>
                  <p className="text-xl font-bold">Dakar, Sénégal</p>
                  <p className="text-white/40 text-sm">GMT +0 (UTC)</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-6">
              <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-white/5 transition-all">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-white/5 transition-all">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-accent-primary/5 blur-3xl rounded-full"></div>
            <form onSubmit={handleSubmit} className="relative glass p-8 rounded-3xl space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Nom</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Sujet</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors"
                  placeholder="Opportunité de collaboration"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-colors resize-none"
                  placeholder="Votre message ici..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-accent-primary text-bg font-bold rounded-xl hover:glow-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <div className="w-6 h-6 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
                ) : (
                  <>
                    Envoyer le message <Send size={18} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="text-accent-primary text-center text-sm font-mono">Message envoyé avec succès !</p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-center text-sm font-mono">Une erreur est survenue.</p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
