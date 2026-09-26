
import React from 'react';
import { Sidebar } from './Sidebar.tsx';
import { MouseGlow } from './MouseGlow.tsx';
import { About } from './About.tsx';
import { Parcours } from './Parcours.tsx';
import { Experience } from './Experience.tsx';
import { Projets } from './Projets.tsx';
import { JournalTeaser } from './JournalTeaser.tsx';
import { Certifications } from './Certifications.tsx';

export const Home: React.FC = () => {
  return (
    <div id="home" className="relative">
      <MouseGlow />
      <a href="#contenu-principal" className="skip-link">Aller au contenu</a>

      {/* Ratio calé sur la référence : à 1536 px, la colonne droite commence à
          753 px et mesure 607 px, exactement comme elle. En fr (jamais en %) :
          les pourcentages se calculent sur la largeur totale et le gap
          s'ajoute par-dessus, ce qui débordait de la largeur du gap. */}
      <div className="relative z-10 max-w-[1312px] mx-auto lg:grid lg:grid-cols-[46.25fr_53.75fr] lg:gap-8 xl:gap-16">
        <Sidebar />

        <main id="contenu-principal" className="main-column px-6 sm:px-10 lg:px-0 lg:pr-12 xl:pr-16 pb-6 lg:pb-24 space-y-24 lg:space-y-36">
          <About />
          <Parcours />
          <Experience />
          <Projets />
          <JournalTeaser />
          <Certifications />

          <footer className="pt-8 border-t border-border">
            <p className="text-[13px] text-text-muted leading-relaxed">
              Conçu à Dakar et codé dans <span className="text-text-primary font-medium">VS Code</span>.<br />
              Construit avec <span className="text-text-primary font-medium">React</span> et{' '}
              <span className="text-text-primary font-medium">Tailwind CSS</span>, déployé sur{' '}
              <span className="text-text-primary font-medium">Vercel</span>.
            </p>
            <p className="mt-3 text-[13px] text-text-muted">© 2026 Ahamed Hassani Mhoma</p>
          </footer>
        </main>
      </div>
    </div>
  );
};
