
import React from 'react';
import { Sidebar } from './Sidebar.tsx';
import { MouseGlow } from './MouseGlow.tsx';
import { About } from './About.tsx';
import { Parcours } from './Parcours.tsx';
import { TravauxTeaser } from './TravauxTeaser.tsx';
import { JournalTeaser } from './JournalTeaser.tsx';

export const Home: React.FC = () => {
  return (
    <div id="home" className="relative">
      <MouseGlow />
      <a href="#contenu-principal" className="skip-link">Aller au contenu</a>

      <div className="relative z-10 max-w-[1312px] mx-auto lg:grid lg:grid-cols-[45%_55%] lg:gap-8 xl:gap-16">
        <Sidebar />

        <main id="contenu-principal" className="px-6 sm:px-10 lg:px-0 lg:pr-12 xl:pr-16 py-6 lg:py-16 space-y-24 lg:space-y-36">
          <About />
          <Parcours />
          <TravauxTeaser />
          <JournalTeaser />

          <footer className="pt-8 border-t border-border">
            <p className="text-[13px] text-text-muted leading-relaxed">
              Conçu à Dakar et codé dans VS Code.<br />
              Construit avec React et Tailwind CSS, déployé sur Vercel.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
