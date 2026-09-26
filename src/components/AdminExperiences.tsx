import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, X, Upload, ArrowUp, ArrowDown, Loader2, Images,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Experience, ExperienceType, TimelinePhoto } from '../types';
import { uploadImage } from '../lib/adminUpload';

const INPUT =
  'w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary';
const LABEL = 'block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5';

const TYPES: ExperienceType[] = ['Entreprise', 'Stage', 'Freelance', 'Mission'];

const emptyEntry = (): Experience => ({
  slug: '',
  sort_order: 0,
  period_label: '',
  role: '',
  organization: '',
  organization_url: '',
  type: 'Entreprise',
  location: '',
  remote: false,
  confidential: false,
  summary: '',
  technologies: [],
  cover_image_url: '',
  cover_image_alt: '',
  content: '',
  achievements: [],
  lessons: [],
  start_date: '',
  end_date: '',
  published: false,
});

interface Props {
  token: string;
  notify: (message: string, type: 'success' | 'error') => void;
}

/** Éditeur générique d'une liste de phrases (réalisations, leçons). */
const StringList: React.FC<{
  label: string;
  emptyHint: string;
  numbered?: boolean;
  items: string[];
  onChange: (items: string[]) => void;
}> = ({ label, emptyHint, numbered, items, onChange }) => {
  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <p className={LABEL}>{label}</p>
        <button type="button" onClick={() => onChange([...items, ''])}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent-primary">
          <Plus size={14} /> Ajouter
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-text-muted">{emptyHint}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {numbered && (
                <span className="text-xs font-bold text-accent-primary w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              )}
              <input className={INPUT} value={item}
                onChange={e => onChange(items.map((v, j) => (j === i ? e.target.value : v)))} />
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Descendre" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"><ArrowDown size={14} /></button>
              <button type="button" aria-label="Supprimer"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="p-1 text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const AdminExperiences: React.FC<Props> = ({ token, notify }) => {
  const [entries, setEntries] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Experience>(emptyEntry());
  const [photos, setPhotos] = useState<TimelinePhoto[]>([]);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const res = await fetch('/api/admin/experiences', { headers });
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      notify('Chargement des expériences impossible.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openModal = async (entry: Experience | null) => {
    setEditing(entry);
    setForm(entry
      ? {
          ...entry,
          technologies: entry.technologies ?? [],
          achievements: entry.achievements ?? [],
          lessons: entry.lessons ?? [],
        }
      : emptyEntry());
    setTechInput('');
    setPreview(false);
    setPhotos([]);
    setModalOpen(true);

    if (entry?.id) {
      try {
        const res = await fetch(`/api/admin/experiences/${entry.id}/photos`, { headers });
        const data = await res.json();
        setPhotos(Array.isArray(data) ? data : []);
      } catch {
        notify('Galerie non chargée.', 'error');
      }
    }
  };

  const upload = (file: File) => uploadImage(file, token, message => notify(message, 'error'));

  const onGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const added: TimelinePhoto[] = [];
    for (const file of Array.from(files)) {
      const url = await upload(file);
      if (url) added.push({ image_url: url, alt: '', caption: '' });
    }
    setPhotos(prev => [...prev, ...added]);
    setUploading(false);
    if (galleryInput.current) galleryInput.current.value = '';
    if (added.length) notify(`${added.length} photo(s) envoyée(s). Ajoutez le texte alternatif.`, 'success');
  };

  const onCoverFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const url = await upload(files[0]);
    if (url) setForm(f => ({ ...f, cover_image_url: url }));
    setUploading(false);
    if (coverInput.current) coverInput.current.value = '';
  };

  const insertImageInContent = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const url = await upload(files[0]);
    setUploading(false);
    if (!url) return;
    const area = contentRef.current;
    const snippet = `\n\n![Décrivez la photo](${url})\n\n`;
    if (area) {
      const start = area.selectionStart ?? (form.content?.length ?? 0);
      const next = (form.content ?? '').slice(0, start) + snippet + (form.content ?? '').slice(start);
      setForm(f => ({ ...f, content: next }));
    } else {
      setForm(f => ({ ...f, content: (f.content ?? '') + snippet }));
    }
    notify("Photo insérée dans le récit — remplacez le texte entre crochets par sa description.", 'success');
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    setPhotos(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addTech = () => {
    const value = techInput.trim();
    if (!value) return;
    setForm(f => ({ ...f, technologies: [...(f.technologies ?? []), value] }));
    setTechInput('');
  };

  const save = async () => {
    if (!form.slug.trim() || !form.role.trim() || !form.period_label.trim()) {
      notify('Slug, période et intitulé sont obligatoires.', 'error');
      return;
    }
    if (form.confidential && !form.summary?.trim()) {
      notify('Mission confidentielle : décrivez le client en une phrase dans le résumé.', 'error');
      return;
    }
    const missingAlt = photos.find(p => !p.alt.trim());
    if (missingAlt) {
      notify('Chaque photo doit avoir un texte alternatif.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: (form.technologies ?? []).filter(t => t.trim()),
        achievements: (form.achievements ?? []).filter(a => a.trim()),
        lessons: (form.lessons ?? []).filter(l => l.trim()),
      };
      const url = editing?.id ? `/api/experiences/${editing.id}` : '/api/experiences';
      const res = await fetch(url, {
        method: editing?.id ? 'PUT' : 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Enregistrement impossible');

      const entryId = editing?.id ?? data?.id;
      if (entryId) {
        const photoRes = await fetch(`/api/experiences/${entryId}/photos`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ photos }),
        });
        if (!photoRes.ok) {
          const photoData = await photoRes.json();
          throw new Error(photoData?.message || 'Galerie non enregistrée');
        }
      }

      notify('Expérience enregistrée.', 'success');
      setModalOpen(false);
      load();
    } catch (err: any) {
      notify(err?.message || 'Enregistrement impossible.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (entry: Experience) => {
    if (!confirm(`Supprimer « ${entry.role} » et sa galerie ?`)) return;
    try {
      const res = await fetch(`/api/experiences/${entry.id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      notify('Expérience supprimée.', 'success');
      load();
    } catch {
      notify('Suppression impossible.', 'error');
    }
  };

  const togglePublish = async (entry: Experience) => {
    try {
      const res = await fetch(`/api/experiences/${entry.id}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, published: !entry.published }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      notify('Modification impossible.', 'error');
    }
  };

  const reorder = async (entry: Experience, direction: -1 | 1) => {
    const index = entries.findIndex(e => e.id === entry.id);
    const target = index + direction;
    if (target < 0 || target >= entries.length) return;
    const other = entries[target];
    try {
      await Promise.all([
        fetch(`/api/experiences/${entry.id}`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...entry, sort_order: other.sort_order }),
        }),
        fetch(`/api/experiences/${other.id}`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...other, sort_order: entry.sort_order }),
        }),
      ]);
      load();
    } catch {
      notify('Réordonnancement impossible.', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted">
          Les expériences sans récit, réalisation ni photo restent visibles sur l'accueil, mais ne sont pas cliquables.
        </p>
        <button onClick={() => openModal(null)} className="btn-p text-sm">
          <Plus size={16} /> Nouvelle expérience
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-bg-tertiary rounded-lg animate-pulse" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-text-muted text-sm">
            Aucune expérience. Si vous venez d'installer cette fonctionnalité, exécutez d'abord
            la migration <code className="text-accent-primary">migrations/003_experiences.sql</code> dans Supabase.
          </p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-tertiary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Période</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Intitulé</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Récit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Ordre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">{entry.period_label}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-text-primary">{entry.role}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {entry.confidential ? 'Client confidentiel' : entry.organization || '—'} · /experience/{entry.slug}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">{entry.type}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {entry.content?.trim() ? 'Oui' : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => reorder(entry, -1)} disabled={index === 0} aria-label="Monter" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30">
                        <ArrowUp size={15} />
                      </button>
                      <button onClick={() => reorder(entry, 1)} disabled={index === entries.length - 1} aria-label="Descendre" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30">
                        <ArrowDown size={15} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => togglePublish(entry)} aria-label={entry.published ? 'Dépublier' : 'Publier'}>
                        {entry.published
                          ? <Eye size={18} className="text-accent-primary" />
                          : <EyeOff size={18} className="text-text-muted" />}
                      </button>
                      <button onClick={() => openModal(entry)} aria-label="Modifier" className="text-text-muted hover:text-text-primary"><Edit size={18} /></button>
                      <button onClick={() => remove(entry)} aria-label="Supprimer" className="text-red-500/50 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass rounded-2xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-bg-secondary rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-text-primary">
                {editing ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Fermer" className="text-text-muted hover:text-text-primary">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL} htmlFor="xp-period">Période *</label>
                  <input id="xp-period" className={INPUT} value={form.period_label}
                    onChange={e => setForm(f => ({ ...f, period_label: e.target.value }))}
                    placeholder="2024 — Aujourd'hui" />
                </div>
                <div>
                  <label className={LABEL} htmlFor="xp-slug">Slug (URL) *</label>
                  <input id="xp-slug" className={INPUT} value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="stage-administrateur-systemes-reseaux-tunisie-telecom" />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="xp-role">Intitulé du poste *</label>
                <input id="xp-role" className={INPUT} value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="Stage Administrateur Systèmes &amp; Réseaux" />
              </div>

              <div>
                <label className={LABEL} htmlFor="xp-type">Type</label>
                <select id="xp-type" className={INPUT} value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as ExperienceType }))}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Client confidentiel */}
              <div className="rounded-xl border border-border p-4 space-y-3">
                <label className="flex items-start gap-3 text-sm text-text-secondary">
                  <input type="checkbox" checked={!!form.confidential}
                    onChange={e => setForm(f => ({ ...f, confidential: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 accent-current shrink-0" />
                  <span>
                    Client confidentiel
                    <span className="block text-xs text-text-muted mt-0.5">
                      Le nom du client n'est ni enregistré ni affiché. Décrivez-le vous-même en une
                      phrase dans le résumé ci-dessous (par exemple « un opérateur télécom »).
                    </span>
                  </span>
                </label>

                {!form.confidential && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL} htmlFor="xp-org">Organisation</label>
                      <input id="xp-org" className={INPUT} value={form.organization ?? ''}
                        onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} />
                    </div>
                    <div>
                      <label className={LABEL} htmlFor="xp-org-url">Site de l'organisation</label>
                      <input id="xp-org-url" className={INPUT} value={form.organization_url ?? ''}
                        onChange={e => setForm(f => ({ ...f, organization_url: e.target.value }))}
                        placeholder="https://..." />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL} htmlFor="xp-location">Lieu</label>
                  <input id="xp-location" className={INPUT} value={form.location ?? ''}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Tunis, Tunisie" />
                </div>
                <label className="flex items-center gap-3 text-sm text-text-secondary sm:mt-7">
                  <input type="checkbox" checked={!!form.remote}
                    onChange={e => setForm(f => ({ ...f, remote: e.target.checked }))}
                    className="w-4 h-4 accent-current" />
                  À distance
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL} htmlFor="xp-start">Début</label>
                  <input id="xp-start" type="date" className={INPUT} value={form.start_date ?? ''}
                    onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL} htmlFor="xp-end">Fin (vide si en cours)</label>
                  <input id="xp-end" type="date" className={INPUT} value={form.end_date ?? ''}
                    onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="xp-summary">
                  Résumé (1-2 phrases){form.confidential ? ' *' : ''}
                </label>
                <textarea id="xp-summary" rows={2} className={`${INPUT} resize-none`} value={form.summary ?? ''}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder={form.confidential ? 'Mission pour un opérateur télécom…' : undefined} />
              </div>

              {/* Technologies */}
              <div className="rounded-xl border border-border p-4">
                <p className={LABEL}>Technologies</p>
                <div className="flex gap-2">
                  <input className={INPUT} value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="Ajouter une technologie puis Entrée" />
                  <button type="button" onClick={addTech}
                    className="px-3 rounded-lg border border-border text-sm text-text-primary hover:border-accent-primary shrink-0">
                    Ajouter
                  </button>
                </div>
                {(form.technologies ?? []).length === 0 ? (
                  <p className="text-xs text-text-muted mt-3">Aucune technologie. Le bloc ne s'affichera pas.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(form.technologies ?? []).map((tech, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[12px] font-medium">
                        {tech}
                        <button type="button" aria-label={`Retirer ${tech}`}
                          onClick={() => setForm(f => ({ ...f, technologies: (f.technologies ?? []).filter((_, j) => j !== i) }))}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Couverture */}
              <div className="rounded-xl border border-border p-4 space-y-3">
                <p className={LABEL}>Photo de couverture</p>
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="" className="w-full max-h-48 object-cover rounded-lg border border-border" />
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                    onChange={e => onCoverFile(e.target.files)} />
                  <button type="button" onClick={() => coverInput.current?.click()} disabled={uploading}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-text-primary hover:border-accent-primary disabled:opacity-50">
                    {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Choisir une image
                  </button>
                  {form.cover_image_url && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, cover_image_url: '' }))}
                      className="text-sm text-red-500/70 hover:text-red-500">Retirer</button>
                  )}
                </div>
                <input className={INPUT} value={form.cover_image_alt ?? ''}
                  onChange={e => setForm(f => ({ ...f, cover_image_alt: e.target.value }))}
                  placeholder="Texte alternatif de la couverture" />
              </div>

              {/* Récit */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={LABEL} htmlFor="xp-content">Récit (Markdown)</label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent-primary cursor-pointer">
                      <Images size={14} /> Insérer une photo
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                        onChange={e => insertImageInContent(e.target.files)} />
                    </label>
                    <button type="button" onClick={() => setPreview(p => !p)}
                      className="text-xs font-semibold text-text-muted hover:text-accent-primary">
                      {preview ? 'Éditer' : 'Aperçu'}
                    </button>
                  </div>
                </div>
                {preview ? (
                  <div className="rounded-lg border border-border bg-bg-tertiary p-4 min-h-[220px] prose prose-sm max-w-none">
                    <Markdown>{form.content || '_Rien à afficher._'}</Markdown>
                  </div>
                ) : (
                  <textarea id="xp-content" ref={contentRef} rows={12} className={`${INPUT} resize-y font-mono text-[13px]`}
                    value={form.content ?? ''}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder={'## Le contexte\n\nVotre récit...\n\n> Une anecdote mise en avant.'} />
                )}
              </div>

              <StringList
                label="Ce que j'ai réalisé"
                emptyHint="Aucune réalisation. Le bloc ne s'affichera pas."
                items={form.achievements ?? []}
                onChange={achievements => setForm(f => ({ ...f, achievements }))}
              />

              <StringList
                label="Leçons retenues"
                emptyHint="Aucune leçon. Le bloc ne s'affichera pas."
                numbered
                items={form.lessons ?? []}
                onChange={lessons => setForm(f => ({ ...f, lessons }))}
              />

              {/* Galerie */}
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className={LABEL}>Galerie « Moments »</p>
                  <input ref={galleryInput} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden"
                    onChange={e => onGalleryFiles(e.target.files)} />
                  <button type="button" onClick={() => galleryInput.current?.click()} disabled={uploading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent-primary disabled:opacity-50">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Ajouter des photos
                  </button>
                </div>

                {photos.length === 0 ? (
                  <p className="text-xs text-text-muted">Aucune photo. Le bloc « Moments » ne s'affichera pas.</p>
                ) : (
                  <ul className="space-y-3">
                    {photos.map((photo, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <img src={photo.image_url} alt="" className="w-20 h-16 object-cover rounded-lg border border-border shrink-0" />
                        <div className="flex-1 space-y-2 min-w-0">
                          <input className={INPUT} value={photo.alt} placeholder="Texte alternatif (obligatoire)"
                            onChange={e => setPhotos(prev => prev.map((p, j) => j === i ? { ...p, alt: e.target.value } : p))} />
                          <input className={INPUT} value={photo.caption ?? ''} placeholder="Légende (facultative)"
                            onChange={e => setPhotos(prev => prev.map((p, j) => j === i ? { ...p, caption: e.target.value } : p))} />
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0} aria-label="Monter" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1} aria-label="Descendre" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))} aria-label="Supprimer" className="p-1 text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="flex items-center gap-3 text-sm text-text-secondary">
                <input type="checkbox" checked={!!form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-current" />
                Publier cette expérience
              </label>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
                Annuler
              </button>
              <button onClick={save} disabled={saving || uploading} className="btn-p text-sm disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
