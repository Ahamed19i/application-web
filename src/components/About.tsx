
import React from 'react';

const SKILLS = [
  'Linux (Ubuntu/Debian)', 'Windows Server', 'Virtualisation',
  'Cisco IOS', 'pfSense', 'EVE-NG', 'VPN/VLAN',
  'Docker', 'Kubernetes', 'Ansible', 'AWS', 'CI/CD',
];

const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <strong className="text-text-primary font-medium">{children}</strong>
);

export const About: React.FC = () => {
  return (
    <section id="a-propos" aria-labelledby="a-propos-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="a-propos-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">À propos</h2>
      </div>

      <div className="space-y-5 text-[16px] text-text-secondary leading-[1.75] max-w-[640px]">
        <p>
          Salut ! Je m'appelle Ahamed HASSANI MHOMA, et j'aime construire et transmettre. Je suis{" "}
          <Strong>formateur et spécialiste en intelligence artificielle appliquée</Strong>, avec un socle d'
          ingénieur systèmes et réseaux : infrastructures, cloud, DevOps et développement web et mobile.
          J'aime comprendre comment les choses fonctionnent, transformer des idées en solutions concrètes, et aider les
          autres à en faire autant.
        </p>
        <p>
          Je forme et accompagne des professionnels au sein des
          entreprises dans l'<Strong>intégration concrète de l'IA</Strong> : création de contenu, automatisation, assistants
          IA. En parallèle, je développe mes propres projets, avec l'IA intégrée à chaque étape du développement.
        </p>
        <p>
          En fin de Master 2 en Systèmes, Réseaux et Télécommunications à Dakar, je consacre mon mémoire à
          la conception d'une infrastructure hybride résiliente, pensée pour assurer la{" "}
          <Strong>haute disponibilité des services critiques</Strong>.
        </p>
        <p>
          En dehors de l'informatique, je suis passionné par le football et les documentaires. Je m'intéresse à la veille technologique, j'aime voyager, découvrir de nouvelles cultures et des parcours différents.
        </p>
        <p>
          Ce site rassemble un peu de tout cela : ce que je construis, ce que je transmets et les expériences qui façonnent
          mon parcours.
        </p>
      </div>

      <div className="mt-8 max-w-[640px]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">Compétences</p>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="px-3 py-1.5 rounded-full bg-bg-secondary border border-border text-text-secondary text-[12px] font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
