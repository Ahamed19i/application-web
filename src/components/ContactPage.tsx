
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowLeft, Check } from 'lucide-react';
import { PageShell } from './PageShell.tsx';

const FIELD_CLASS =
  'w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent-primary';

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
    <PageShell>
      <div className="max-w-[560px]">
        <h1 className="text-[34px] sm:text-[42px] font-bold text-text-primary tracking-tight leading-[1.1] mb-4">
          Me contacter
        </h1>
        <p className="text-[16px] text-text-secondary leading-relaxed mb-3">
          Une opportunité, une question sur un projet, ou juste envie d'échanger ? Écrivez-moi, je réponds à tous
          les messages.
        </p>
        <a
          href="mailto:ahassanimhoma20@gmail.com"
          className="inline-block text-accent-primary font-medium mb-10 hover:underline underline-offset-4"
        >
          ahassanimhoma20@gmail.com
        </a>

        {status === 'success' ? (
          <div className="rounded-xl border border-accent-primary/40 bg-accent-primary/5 p-6">
            <p className="flex items-center gap-2 text-[16px] font-semibold text-text-primary mb-2">
              <Check size={18} className="text-accent-primary" /> Message envoyé
            </p>
            <p className="text-[15px] text-text-secondary mb-5">
              Merci, votre message est bien arrivé. Je vous réponds dès que possible.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-[14px] font-semibold text-accent-primary hover:underline underline-offset-4"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="block text-[12px] font-semibold text-text-muted uppercase tracking-wider">Nom</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={FIELD_CLASS}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="block text-[12px] font-semibold text-text-muted uppercase tracking-wider">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={FIELD_CLASS}
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-subject" className="block text-[12px] font-semibold text-text-muted uppercase tracking-wider">Sujet</label>
              <select
                id="contact-subject"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className={FIELD_CLASS}
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
              <label htmlFor="contact-message" className="block text-[12px] font-semibold text-text-muted uppercase tracking-wider">Message</label>
              <textarea
                id="contact-message"
                required
                rows={6}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className={`${FIELD_CLASS} resize-none`}
                placeholder="Votre message..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-6 py-3 text-[15px] font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === 'sending' ? (
                <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
              ) : (
                <>Envoyer le message <Send size={16} /></>
              )}
            </button>

            {status === 'error' && (
              <p className="text-danger text-[14px] font-medium">
                L'envoi a échoué. Réessayez, ou écrivez-moi directement par email.
              </p>
            )}
          </form>
        )}

        <Link
          to="/"
          className="group inline-flex items-center gap-2 mt-12 text-[14px] font-semibold text-text-secondary hover:text-accent-primary transition-colors"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Retour
        </Link>
      </div>
    </PageShell>
  );
};
