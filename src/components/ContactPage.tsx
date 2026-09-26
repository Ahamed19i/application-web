
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar.tsx';
import { MouseGlow } from './MouseGlow.tsx';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="relative">
      <MouseGlow />
      <a href="#contenu-principal" className="skip-link">Aller au contenu</a>

      <div className="relative z-10 max-w-[1312px] mx-auto lg:grid lg:grid-cols-[45fr_55fr] lg:gap-8 xl:gap-16">
        <Sidebar />

        <main id="contenu-principal" className="px-6 sm:px-10 lg:px-0 lg:pr-12 xl:pr-16 py-6 lg:py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-accent-primary transition-colors mb-10">
            <ArrowLeft size={15} /> Retour
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
            Contact
          </h1>
          {/* TODO(Ahamed): une phrase pour introduire la prise de contact. */}
          <p className="text-text-secondary leading-relaxed mb-4 max-w-[560px]">
            TODO(Ahamed) : une phrase pour introduire la prise de contact.
          </p>
          <a href="mailto:ahassanimhoma20@gmail.com" className="inline-block text-accent-primary font-medium mb-12 hover:underline underline-offset-4">
            ahassanimhoma20@gmail.com
          </a>

          <form onSubmit={handleSubmit} className="max-w-[560px] space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">Nom</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm text-text-primary"
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm text-text-primary"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-subject" className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">Sujet</label>
              <select
                id="contact-subject"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 focus:border-accent-primary outline-none transition-colors text-sm text-text-primary"
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
              <label htmlFor="contact-message" className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">Message</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 focus:border-accent-primary outline-none transition-colors resize-none text-sm text-text-primary"
                placeholder="Décrivez votre proposition..."
              ></textarea>
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn-p w-full justify-center">
              {status === 'sending' ? (
                <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
              ) : (
                <>Envoyer le message <Send size={16} /></>
              )}
            </button>

            {status === 'success' && (
              <p className="text-success text-center text-sm font-medium">Message envoyé avec succès.</p>
            )}
            {status === 'error' && (
              <p className="text-danger text-center text-sm font-medium">Une erreur est survenue.</p>
            )}
          </form>

          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-accent-primary transition-colors mt-10">
            <ArrowLeft size={15} /> Retour
          </Link>
        </main>
      </div>
    </div>
  );
};
