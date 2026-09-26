
import React from 'react';

const SKILLS = [
  'Linux (Ubuntu/Debian)', 'Windows Server', 'Virtualisation',
  'Cisco IOS', 'pfSense', 'EVE-NG', 'VPN/VLAN',
  'Docker', 'Kubernetes', 'Ansible', 'AWS', 'CI/CD',
];

export const About: React.FC = () => {
  return (
    <section id="a-propos" aria-labelledby="a-propos-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="a-propos-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">À propos</h2>
      </div>

      <div className="space-y-5 text-[16px] text-text-secondary leading-[1.7] max-w-[640px] [&_a]:text-text-primary [&_a]:font-medium [&_a]:underline [&_a]:decoration-transparent hover:[&_a]:decoration-accent-primary [&_a]:underline-offset-4 [&_a]:transition-colors">
        {/* TODO(Ahamed): qui je suis et ce qui m'a amené à l'infrastructure. */}
        <p>TODO(Ahamed) : qui je suis et ce qui m'a amené à l'infrastructure.</p>
        {/* TODO(Ahamed): ce que je fais en ce moment. */}
        <p>TODO(Ahamed) : ce que je fais en ce moment.</p>
        {/* TODO(Ahamed): ce que je fais en dehors de l'informatique. */}
        <p>TODO(Ahamed) : ce que je fais en dehors de l'informatique.</p>
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
