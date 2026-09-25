
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Phone, Github, Linkedin, ArrowRight } from 'lucide-react';

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
    <section id="contact" className="pt-16 md:pt-24 pb-16 md:pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">Contact</p>
        <h2 className="font-serif font-medium text-3xl md:text-4xl mb-12 tracking-tight text-text-primary">
          Travaillons ensemble
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h3 className="text-xl font-serif font-medium mb-4 text-text-primary">Je suis ouvert aux opportunités</h3>
            {/* TODO(Ahamed): "réponse garantie en moins de 24h" retiré — n'affirme un délai que si tu le tiens vraiment. */}
            <p className="text-text-secondary leading-relaxed mb-10 text-base">
              Recruteur, professionnel IT ou simplement curieux ? Je recherche activement un <strong className="text-text-primary">stage ou alternance</strong> en systèmes, réseaux, DevOps ou cloud.
            </p>

            <div className="flex flex-col gap-3">
              <a href="mailto:ahassanimhoma20@gmail.com" className="group flex items-center gap-4 p-4 border border-border hover:border-accent-primary transition-colors">
                <div className="flex-shrink-0 w-10 h-10 border border-border flex items-center justify-center text-text-secondary group-hover:text-accent-primary transition-colors">
                  <Mail size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-text-primary truncate">ahassanimhoma20@gmail.com</p>
                </div>
                <ArrowRight className="flex-shrink-0 text-text-muted group-hover:text-accent-primary transition-colors" size={14} />
              </a>

              <a href="tel:+221787942729" className="group flex items-center gap-4 p-4 border border-border hover:border-accent-primary transition-colors">
                <div className="flex-shrink-0 w-10 h-10 border border-border flex items-center justify-center text-text-secondary group-hover:text-accent-primary transition-colors">
                  <Phone size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Téléphone</p>
                  <p className="text-sm font-semibold text-text-primary truncate">+221 78 794 27 29</p>
                </div>
                <ArrowRight className="flex-shrink-0 text-text-muted group-hover:text-accent-primary transition-colors" size={14} />
              </a>

              <a href="https://github.com/ahamed19i" target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 border border-border hover:border-accent-primary transition-colors">
                <div className="flex-shrink-0 w-10 h-10 border border-border flex items-center justify-center text-text-secondary group-hover:text-accent-primary transition-colors">
                  <Github size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">GitHub</p>
                  <p className="text-sm font-semibold text-text-primary truncate">github.com/ahamed19i</p>
                </div>
                <ArrowRight className="flex-shrink-0 text-text-muted group-hover:text-accent-primary transition-colors" size={14} />
              </a>

              <a href="https://linkedin.com/in/ahamed19i" target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 border border-border hover:border-accent-primary transition-colors">
                <div className="flex-shrink-0 w-10 h-10 border border-border flex items-center justify-center text-text-secondary group-hover:text-accent-primary transition-colors">
                  <Linkedin size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">LinkedIn</p>
                  <p className="text-sm font-semibold text-text-primary truncate">Ahamed Hassani Mhoma</p>
                </div>
                <ArrowRight className="flex-shrink-0 text-text-muted group-hover:text-accent-primary transition-colors" size={14} />
              </a>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="border border-border p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-semibold text-text-primary">Envoyer un message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Nom</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-bg-tertiary border border-border px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm text-text-primary"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-bg-tertiary border border-border px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm text-text-primary"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-subject" className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Sujet</label>
                <select
                  id="contact-subject"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-bg-tertiary border border-border px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm text-text-primary"
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
                <label htmlFor="contact-message" className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-bg-tertiary border border-border px-4 py-3 focus:border-accent-primary outline-none transition-colors resize-none text-sm text-text-primary"
                  placeholder="Décrivez votre proposition..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-p w-full justify-center"
              >
                {status === 'sending' ? (
                  <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
                ) : (
                  <>
                    Envoyer le message <Send size={16} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="text-success text-center text-[11px] font-mono">Message envoyé avec succès.</p>
              )}
              {status === 'error' && (
                <p className="text-danger text-center text-[11px] font-mono">Une erreur est survenue.</p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
