import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function getStoredIsLight(): boolean {
  try {
    return localStorage.getItem('theme') === 'light';
  } catch {
    return false;
  }
}

interface ThemeToggleProps {
  variant?: 'boxed' | 'bare';
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'boxed', size = 16 }) => {
  const [isDark, setIsDark] = useState<boolean>(() => !getStoredIsLight());

  useEffect(() => {
    setIsDark(!getStoredIsLight());
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', 'light'); } catch {}
    } else {
      root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    }
    setIsDark(!isDark);
  };

  if (variant === 'bare') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
        className="text-text-muted hover:text-accent-primary transition-colors shrink-0"
      >
        {isDark ? <Sun size={size} /> : <Moon size={size} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors shrink-0"
    >
      {isDark ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
};
