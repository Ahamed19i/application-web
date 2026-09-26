
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  stack: string;
  github_url: string;
  image_url: string;
  category: string;
  status: string;
  published: number;
  pdf_url?: string;
  /** Optionnel : présent uniquement après la migration 001 (voir migrations/). */
  year?: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string;
  tags: string;
  published: number;
  created_at: string;
  pdf_url?: string;
}

export interface TimelinePhoto {
  id?: number;
  image_url: string;
  alt: string;
  caption?: string | null;
  sort_order?: number;
}

export interface TimelineEntry {
  id?: number;
  slug: string;
  period_label: string;
  sort_order: number;
  title: string;
  institution?: string | null;
  city?: string | null;
  country?: string | null;
  summary?: string | null;
  cover_image_url?: string | null;
  cover_image_alt?: string | null;
  content?: string | null;
  lessons?: string[];
  published?: boolean;
  photos?: TimelinePhoto[];
  /** Ajouté par /api/timeline pour savoir si l'étape a une galerie. */
  has_photos?: boolean;
}

/** Une étape n'est cliquable que si elle a vraiment quelque chose à montrer. */
export function timelineHasStory(entry: TimelineEntry): boolean {
  const hasContent = !!entry.content && entry.content.trim().length > 0;
  const hasPhotos = entry.has_photos === true || (entry.photos?.length ?? 0) > 0;
  const hasCover = !!entry.cover_image_url;
  return hasContent || hasPhotos || hasCover;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: number;
  created_at: string;
}
