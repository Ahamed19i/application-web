/**
 * Préparation des images avant envoi à l'API admin.
 * Partagé par les écrans « Parcours » et « Expériences » : une seule règle de
 * redimensionnement, un seul endroit à corriger.
 */

/** Redimensionne et compresse avant envoi : largeur max 2000px, WebP si possible. */
export async function prepareImage(file: File): Promise<{ dataUrl: string; filename: string }> {
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

/** Envoie un fichier au bucket `parcours` et renvoie son URL publique. */
export async function uploadImage(
  file: File,
  token: string,
  onError: (message: string) => void,
): Promise<string | null> {
  if (file.size > 5 * 1024 * 1024) {
    onError(`${file.name} dépasse 5 Mo.`);
    return null;
  }
  try {
    const { dataUrl, filename } = await prepareImage(file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, filename }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Envoi impossible');
    return data.url as string;
  } catch (err: any) {
    onError(err?.message || 'Envoi impossible.');
    return null;
  }
}
