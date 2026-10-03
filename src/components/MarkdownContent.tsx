import React, { useMemo, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { Lightbox } from './Lightbox.tsx';
import { TimelinePhoto } from '../types';



export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
  /** Ligne dans le texte normalisé : relie le titre rendu à son entrée du sommaire. */
  line: number;
}

/** Slug stable et lisible, identique côté sommaire et côté titre rendu. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

const LEADING_EMOJI = /^[\p{Extended_Pictographic}️‍]+\s*/u;
const SENTENCE_END = /[.!?…,;]$/;
const MARKDOWN_BLOCK = /^(#{1,6}\s|>|\||[-*+]\s|\d+[.)]\s|```|!\[)/;

/**
 * Typographie française : l'espace avant « ? ! : ; » et après « « » devient
 * insécable, pour qu'un point d'interrogation ne parte jamais seul à la ligne.
 */
export function frenchSpacing(text: string): string {
  return text.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ');
}

/** Une ligne courte, sans ponctuation finale : un élément de liste écrit sans tiret. */
function isBareItem(line: string): boolean {
  const t = line.trim();
  return t.length > 0 && t.length <= 100 && !SENTENCE_END.test(t) && !MARKDOWN_BLOCK.test(t);
}

/** « 📌 Le déclic » : ligne courte ouverte par un emoji, utilisée comme sous-titre. */
function isEmojiHeading(line: string): boolean {
  const t = line.trim();
  if (!LEADING_EMOJI.test(t) || t.startsWith('👉')) return false;
  const text = t.replace(LEADING_EMOJI, '');
  return text.length > 0 && text.length <= 80 && !SENTENCE_END.test(text);
}

/**
 * Les textes saisis dans l'admin sont souvent écrits « comme un post » :
 * sous-titres annoncés par un emoji, listes sans tiret après un deux-points.
 * On les traduit en vrai Markdown pour que le sommaire, la numérotation et
 * les listes fonctionnent, sans toucher à un mot du texte.
 */
export function normalizeContent(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    if (t.startsWith('```')) inFence = !inFence;
    if (inFence || t.startsWith('```')) {
      out.push(line);
      continue;
    }

    const heading = isEmojiHeading(t);
    const standalone = (i === 0 || lines[i - 1].trim() === '') && (i === lines.length - 1 || lines[i + 1].trim() === '');
    if (heading) {
      out.push('', `## ${frenchSpacing(t.replace(LEADING_EMOJI, ''))}`, '');
    } else if (standalone && t.startsWith('👉')) {
      // « 👉 Ce n'est pas le budget… » : la phrase que l'auteur veut faire
      // ressortir devient une citation mise en avant.
      out.push(`> ${frenchSpacing(t.replace(/^👉\s*/, ''))}`);
    } else {
      out.push(t.startsWith('|') ? line : frenchSpacing(line));
    }

    // Une liste suit un deux-points (une ligne vide tolérée) ou directement
    // un sous-titre. Il faut au moins deux éléments pour y croire.
    const opensList = heading || (t.endsWith(':') && !MARKDOWN_BLOCK.test(t));
    if (!opensList) continue;

    let j = i + 1;
    if (!heading && j < lines.length && lines[j].trim() === '') j++;
    const items: string[] = [];
    while (j < lines.length && isBareItem(lines[j]) && !isEmojiHeading(lines[j])) {
      items.push(lines[j].trim().replace(/^👉\s*/, ''));
      j++;
    }
    if (items.length < 2) continue;

    // « GitHub / Gestion du code… / Vercel / Déploiement… » : des paires
    // nom court + description deviennent « **GitHub** — Gestion du code… ».
    const isPairs =
      items.length >= 4 &&
      items.length % 2 === 0 &&
      items.every((item, k) => (k % 2 === 0 ? item.split(/\s+/).length <= 3 : item.split(/\s+/).length > 3));

    out.push('');
    if (isPairs) {
      for (let k = 0; k < items.length; k += 2) out.push(`- **${items[k]}** — ${items[k + 1]}`);
    } else {
      items.forEach(item => out.push(`- ${item}`));
    }
    out.push('');
    i = j - 1;
  }

  return out.join('\n');
}

/** Extrait les titres H2/H3 du Markdown pour construire le sommaire. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Set<string>();
  const lines = normalizeContent(markdown).split('\n');
  let inFence = false;

  lines.forEach((line, index) => {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (!match) return;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, '').trim();
    if (!text) return;

    let id = slugify(text);
    let suffix = 2;
    while (seen.has(id)) {
      id = `${slugify(text)}-${suffix++}`;
    }
    seen.add(id);
    headings.push({ id, text, level, line: index + 1 });
  });

  return headings;
}

/** Numéro de section affiché : seuls les H2 en portent un, et seulement s'il y en a au moins deux. */
export function sectionNumbers(headings: Heading[]): Map<string, string> {
  const numbers = new Map<string, string>();
  if (headings.filter(h => h.level === 2).length < 2) return numbers;
  let n = 0;
  headings.forEach(h => {
    if (h.level === 2) numbers.set(h.id, String(++n).padStart(2, '0'));
  });
  return numbers;
}

function childrenToText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (React.isValidElement(children)) {
    return childrenToText((children.props as { children?: React.ReactNode }).children);
  }
  return '';
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // react-markdown passe le <code> en enfant du <pre> : on y lit le langage.
  let language = '';
  if (React.isValidElement(children)) {
    const className = (children.props as { className?: string }).className || '';
    const match = /language-([\w-]+)/.exec(className);
    if (match) language = match[1];
  }

  const copy = async () => {
    const text = preRef.current?.textContent ?? '';
    if (!text) return;

    let done = false;
    try {
      await navigator.clipboard.writeText(text);
      done = true;
    } catch {
      // Contexte non sécurisé ou permission refusée : repli historique.
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        done = document.execCommand('copy');
      } catch {
        done = false;
      }
      document.body.removeChild(area);
    }

    if (done) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group/code my-7 rounded-xl border border-border bg-bg-secondary overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-muted hover:text-accent-primary transition-colors"
          aria-label="Copier le code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre ref={preRef} className="overflow-x-auto px-4 py-4 text-[13.5px] leading-relaxed">
        {children}
      </pre>
    </div>
  );
};

export const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const source = useMemo(() => normalizeContent(content), [content]);
  // Identifiant et numéro de chaque titre, retrouvés par sa ligne dans le
  // texte : le rendu reste stable même si React rend un titre deux fois.
  const headings = useMemo(() => extractHeadings(content), [content]);
  const headingAt = useMemo(() => new Map(headings.map(h => [h.line, h])), [headings]);
  const numbers = useMemo(() => sectionNumbers(headings), [headings]);
  // Une image du récit s'ouvre en grand dans la même visionneuse que les
  // galeries : la vignette reste contenue, le détail se regarde en plein écran.
  const [zoom, setZoom] = useState<TimelinePhoto | null>(null);

  const headingId = (node: { position?: { start: { line: number } } } | undefined, children: React.ReactNode) => {
    const line = node?.position?.start.line;
    return (line !== undefined && headingAt.get(line)?.id) || slugify(childrenToText(children));
  };

  return (
    <div className="markdown-content text-[16px] sm:text-[17px] text-text-secondary leading-[1.75]">
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, children }) => (
            <h2 id={headingId(node, children)} className="scroll-mt-28 text-[26px] sm:text-[28px] font-bold text-text-primary tracking-tight mt-12 mb-4 leading-snug">
              {children}
            </h2>
          ),
          h2: ({ node, children }) => {
            const id = headingId(node, children);
            return (
              <h2 id={id} className="scroll-mt-28 text-[24px] sm:text-[26px] font-bold text-text-primary tracking-tight mt-14 mb-4 leading-snug">
                {numbers.has(id) && (
                  <span aria-hidden="true" className="block mb-2 text-[12px] font-semibold tracking-[0.2em] text-accent-primary tabular-nums">
                    {numbers.get(id)}
                  </span>
                )}
                {children}
              </h2>
            );
          },
          h3: ({ node, children }) => (
            <h3 id={headingId(node, children)} className="scroll-mt-28 text-[19px] sm:text-[20px] font-semibold text-text-primary mt-9 mb-3 leading-snug">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[17px] font-semibold text-text-primary mt-7 mb-2">{children}</h4>
          ),
          p: ({ children }) => <p className="my-5">{children}</p>,
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noreferrer' : undefined}
              className="text-accent-primary underline decoration-transparent hover:decoration-current underline-offset-4 transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
          ul: ({ children }) => <ul className="my-5 space-y-2 list-disc pl-5 marker:text-text-muted">{children}</ul>,
          ol: ({ children }) => <ol className="my-5 space-y-2 list-decimal pl-5 marker:text-text-muted">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-10 border-l-2 border-accent-primary pl-6 text-[19px] sm:text-[21px] font-medium text-text-primary leading-snug tracking-tight [&_p]:my-0">
              {/* Une phrase mise en avant, pas un pavé en italique : elle se lit
                  d'un coup d'œil en parcourant la page. */}
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-border" />,
          table: ({ children }) => (
            <div className="my-7 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-[14px] border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-bg-secondary">{children}</thead>,
          th: ({ children }) => (
            <th className="text-left px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-text-muted border-b border-border">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="px-4 py-2.5 border-b border-border align-top">{children}</td>,
          img: ({ src, alt }) => {
            const url = typeof src === 'string' ? src : undefined;
            if (!url) return null;
            return (
              <figure className="my-8">
                {/* Vignette bornée en hauteur pour que le texte reste l'élément
                    dominant : une photo portrait ne fait plus défiler l'écran.
                    Le recadrage n'est que d'aperçu — la visionneuse montre
                    l'image entière. */}
                <button
                  type="button"
                  onClick={() => setZoom({ image_url: url, alt: alt || '', caption: alt || null })}
                  className="group block w-full overflow-hidden rounded-xl border border-border bg-bg-secondary"
                  aria-label={alt ? `Agrandir : ${alt}` : 'Agrandir l’image'}
                >
                  <img
                    src={url}
                    alt={alt || ''}
                    loading="lazy"
                    className="w-full max-h-[380px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </button>
                {alt && <figcaption className="mt-2 text-[13px] text-text-muted text-center">{alt}</figcaption>}
              </figure>
            );
          },
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          code: ({ children, className }) => {
            const isBlock = (className || '').includes('language-') || (className || '').includes('hljs');
            if (isBlock) return <code className={className}>{children}</code>;
            return (
              <code className="rounded bg-bg-secondary border border-border px-1.5 py-0.5 text-[0.9em] text-text-primary">
                {children}
              </code>
            );
          },
        }}
      >
        {source}
      </Markdown>

      {zoom && (
        <Lightbox photos={[zoom]} index={0} onClose={() => setZoom(null)} onNavigate={() => {}} />
      )}
    </div>
  );
};
