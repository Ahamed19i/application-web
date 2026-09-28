import React, { useRef, useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { Lightbox } from './Lightbox.tsx';
import { TimelinePhoto } from '../types';



export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
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

/** Extrait les titres H2/H3 du Markdown pour construire le sommaire. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Set<string>();
  const lines = markdown.split('\n');
  let inFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, '').trim();
    if (!text) continue;

    let id = slugify(text);
    let suffix = 2;
    while (seen.has(id)) {
      id = `${slugify(text)}-${suffix++}`;
    }
    seen.add(id);
    headings.push({ id, text, level });
  }

  return headings;
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
  const headingIds = useRef<Map<string, number>>(new Map());
  headingIds.current = new Map();
  // Une image du récit s'ouvre en grand dans la même visionneuse que les
  // galeries : la vignette reste contenue, le détail se regarde en plein écran.
  const [zoom, setZoom] = useState<TimelinePhoto | null>(null);

  const makeId = (children: React.ReactNode) => {
    const base = slugify(childrenToText(children));
    const count = headingIds.current.get(base) ?? 0;
    headingIds.current.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  return (
    <div className="markdown-content text-[16px] sm:text-[17px] text-text-secondary leading-[1.75]">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h2 id={makeId(children)} className="scroll-mt-28 text-[26px] sm:text-[28px] font-bold text-text-primary tracking-tight mt-12 mb-4 leading-snug">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 id={makeId(children)} className="scroll-mt-28 text-[24px] sm:text-[26px] font-bold text-text-primary tracking-tight mt-12 mb-4 leading-snug">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={makeId(children)} className="scroll-mt-28 text-[19px] sm:text-[20px] font-semibold text-text-primary mt-9 mb-3 leading-snug">
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
            <blockquote className="my-7 border-l-2 border-accent-primary pl-5 text-text-primary italic">
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
        {content}
      </Markdown>

      {zoom && (
        <Lightbox photos={[zoom]} index={0} onClose={() => setZoom(null)} onNavigate={() => {}} />
      )}
    </div>
  );
};
