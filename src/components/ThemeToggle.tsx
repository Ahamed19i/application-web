import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Stored = 'light' | 'dark' | null;

function getStored(): Stored {
  try {
    const v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = getStored();
    return stored ? stored === 'dark' : prefersDark();
  });

  useEffect(() => {
    const root = document.documentElement;
    const stored = getStored();
    if (stored) {
      root.setAttribute('data-theme', stored);
      setIsDark(stored === 'dark');
    }
  }, []);

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setIsDark(next === 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};
