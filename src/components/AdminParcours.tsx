import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, X, Upload, ArrowUp, ArrowDown, Loader2, Images,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { TimelineEntry, TimelinePhoto } from '../types';

const INPUT =
  'w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary';
const LABEL = 'block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5';

/** Redimensionne et compresse avant envoi : largeur max 2000px, WebP si possible. */
async function prepareImage(file: File): Promise<{ dataUrl: string; filename: string }> {
  const bitmapUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image illisible'));
      el.src = bitmapUrl;
    });

    const maxWidth = 2000;
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas indisponible');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let dataUrl = canvas.toDataURL('image/webp', 0.85);
    if (!dataUrl.startsWith('data:image/webp')) {
      dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    }
    return { dataUrl, filename: file.name };
  } finally {
    URL.revokeObjectURL(bitmapUrl);
  }
}

const emptyEntry = (): TimelineEntry => ({
  slug: '',
  period_label: '',
  sort_order: 0,
  title: '',
  institution: '',
  city: '',
  country: '',
  summary: '',
  cover_image_url: '',
  cover_image_alt: '',
  content: '',
  lessons: [],
  published: false,
});

interface Props {
  token: string;
  notify: (message: string, type: 'success' | 'error') => void;
}

export const AdminParcours: React.FC<Props> = ({ token, notify }) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TimelineEntry | null>(null);
  const [form, setForm] = useState<TimelineEntry>(emptyEntry());
  const [photos, setPhotos] = useState<TimelinePhoto[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const res = await fetch('/api/admin/timeline', { headers });
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      notify('Chargement du parcours impossible.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openModal = async (entry: TimelineEntry | null) => {
    setEditing(entry);
    setForm(entry ? { ...entry, lessons: entry.lessons ?? [] } : emptyEntry());
    setPreview(false);
    setPhotos([]);
    setModalOpen(true);

    if (entry?.id) {
      try {
        const res = await fetch(`/api/admin/timeline/${entry.id}/photos`, { headers });
        const data = await res.json();
        setPhotos(Array.isArray(data) ? data : []);
      } catch {
        notify('Galerie non chargée.', 'error');
      }
    }
  };

  const upload = async (file: File): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) {
      notify(`${file.name} dépasse 5 Mo.`, 'error');
      return null;
    }
    try {
      const { dataUrl, filename } = await prepareImage(file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, filename }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Envoi impossible');
      return data.url as string;
    } catch (err: any) {
      notify(err?.message || 'Envoi impossible.', 'error');
      return null;
    }
  };

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

  const moveLesson = (index: number, direction: -1 | 1) => {
    setForm(f => {
      const lessons = [...(f.lessons ?? [])];
      const target = index + direction;
      if (target < 0 || target >= lessons.length) return f;
      [lessons[index], lessons[target]] = [lessons[target], lessons[index]];
      return { ...f, lessons };
    });
  };

  const save = async () => {
    if (!form.slug.trim() || !form.title.trim() || !form.period_label.trim()) {
      notify('Slug, période et titre sont obligatoires.', 'error');
      return;
    }
    const missingAlt = photos.find(p => !p.alt.trim());
    if (missingAlt) {
      notify('Chaque photo doit avoir un texte alternatif.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, lessons: (form.lessons ?? []).filter(l => l.trim()) };
      const url = editing?.id ? `/api/timeline/${editing.id}` : '/api/timeline';
      const res = await fetch(url, {
        method: editing?.id ? 'PUT' : 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Enregistrement impossible');

      const entryId = editing?.id ?? data?.id;
      if (entryId) {
        const photoRes = await fetch(`/api/timeline/${entryId}/photos`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ photos }),
        });
        if (!photoRes.ok) {
          const photoData = await photoRes.json();
          throw new Error(photoData?.message || 'Galerie non enregistrée');
        }
      }

      notify('Étape enregistrée.', 'success');
      setModalOpen(false);
      load();
    } catch (err: any) {
      notify(err?.message || 'Enregistrement impossible.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (entry: TimelineEntry) => {
    if (!confirm(`Supprimer « ${entry.title} » et sa galerie ?`)) return;
    try {
      const res = await fetch(`/api/timeline/${entry.id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      notify('Étape supprimée.', 'success');
      load();
    } catch {
      notify('Suppression impossible.', 'error');
    }
  };

  const togglePublish = async (entry: TimelineEntry) => {
    try {
      const res = await fetch(`/api/timeline/${entry.id}`, {
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

  const reorder = async (entry: TimelineEntry, direction: -1 | 1) => {
    const index = entries.findIndex(e => e.id === entry.id);
    const target = index + direction;
    if (target < 0 || target >= entries.length) return;
    const other = entries[target];
    try {
      await Promise.all([
        fetch(`/api/timeline/${entry.id}`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...entry, sort_order: other.sort_order }),
        }),
        fetch(`/api/timeline/${other.id}`, {
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
          Les étapes sans récit ni photo restent visibles sur l'accueil, mais ne sont pas cliquables.
        </p>
        <button onClick={() => openModal(null)} className="btn-p text-sm">
          <Plus size={16} /> Nouvelle étape
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-bg-tertiary rounded-lg animate-pulse" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-text-muted text-sm">
            Aucune étape. Si vous venez d'installer cette fonctionnalité, exécutez d'abord
            la migration <code className="text-accent-primary">migrations/002_timeline.sql</code> dans Supabase.
          </p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-tertiary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Période</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">Titre</th>
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
                    <p className="text-sm font-semibold text-text-primary">{entry.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">/parcours/{entry.slug}</p>
                  </td>
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
                {editing ? 'Modifier l\'étape' : 'Nouvelle étape'}
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Fermer" className="text-text-muted hover:text-text-primary">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL} htmlFor="tl-period">Période *</label>
                  <input id="tl-period" className={INPUT} value={form.period_label}
                    onChange={e => setForm(f => ({ ...f, period_label: e.target.value }))}
                    placeholder="2021 — 2024" />
                </div>
                <div>
                  <label className={LABEL} htmlFor="tl-slug">Slug (URL) *</label>
                  <input id="tl-slug" className={INPUT} value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="licence-genie-logiciel-tunis" />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="tl-title">Titre *</label>
                <input id="tl-title" className={INPUT} value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={LABEL} htmlFor="tl-inst">Établissement</label>
                  <input id="tl-inst" className={INPUT} value={form.institution ?? ''}
                    onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL} htmlFor="tl-city">Ville</label>
                  <input id="tl-city" className={INPUT} value={form.city ?? ''}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL} htmlFor="tl-country">Pays</label>
                  <input id="tl-country" className={INPUT} value={form.country ?? ''}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="tl-summary">Résumé (1-2 phrases)</label>
                <textarea id="tl-summary" rows={2} className={`${INPUT} resize-none`} value={form.summary ?? ''}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
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
                  <label className={LABEL} htmlFor="tl-content">Récit (Markdown)</label>
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
                  <textarea id="tl-content" ref={contentRef} rows={12} className={`${INPUT} resize-y font-mono text-[13px]`}
                    value={form.content ?? ''}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder={'## Ce que j\'ai fait\n\nVotre récit...\n\n> Une anecdote mise en avant.'} />
                )}
              </div>

              {/* Leçons */}
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className={LABEL}>Leçons retenues</p>
                  <button type="button" onClick={() => setForm(f => ({ ...f, lessons: [...(f.lessons ?? []), ''] }))}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent-primary">
                    <Plus size={14} /> Ajouter
                  </button>
                </div>
                {(form.lessons ?? []).length === 0 ? (
                  <p className="text-xs text-text-muted">Aucune leçon. Le bloc ne s'affichera pas.</p>
                ) : (
                  <ul className="space-y-2">
                    {(form.lessons ?? []).map((lesson, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-accent-primary w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <input className={INPUT} value={lesson}
                          onChange={e => setForm(f => {
                            const lessons = [...(f.lessons ?? [])];
                            lessons[i] = e.target.value;
                            return { ...f, lessons };
                          })} />
                        <button type="button" onClick={() => moveLesson(i, -1)} disabled={i === 0} aria-label="Monter" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"><ArrowUp size={14} /></button>
                        <button type="button" onClick={() => moveLesson(i, 1)} disabled={i === (form.lessons ?? []).length - 1} aria-label="Descendre" className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"><ArrowDown size={14} /></button>
                        <button type="button" aria-label="Supprimer"
                          onClick={() => setForm(f => ({ ...f, lessons: (f.lessons ?? []).filter((_, j) => j !== i) }))}
                          className="p-1 text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
                Publier cette étape
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
