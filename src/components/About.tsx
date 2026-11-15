
import React from 'react';
import { motion } from 'motion/react';

const SKILL_GROUPS = [
  { label: 'Systèmes', skills: ['Linux (Ubuntu/Debian)', 'Windows Server', 'Virtualisation', 'Haute disponibilité'] },
  { label: 'Réseaux', skills: ['Cisco IOS', 'pfSense', 'VPN', 'MPLS', 'SD-WAN'] },
  { label: 'Développement web & mobile', skills: ['React Native', 'Flutter', 'Node.js', 'API', 'PostgreSQL'] },
  { label: 'Automatisation avancée', skills: ['AWS', 'Docker', 'Kubernetes', 'Ansible', 'CI/CD'] },
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
          Moi, c’est Ahamed HASSANI MHOMA. J’aime comprendre comment les choses fonctionnent, construire des solutions et partager ce que j’apprends. Mon parcours mêle systèmes et réseaux, développement et IA appliquée, avec toujours cette même curiosité : explorer une idée, la mettre à l’épreuve et en faire quelque chose d’utile.
        </p>
        <p>
          J’aide les professionnels en entreprise à intégrer l’IA dans leur quotidien, à travers des formations et la création d’agents, d’assistants et d’automatisations adaptés à leurs besoins. En parallèle, je développe des projets numériques pour mes clients et pour moi-même, en intégrant l’IA dès leur conception.
        </p>
        <p>
          En fin de Master 2 en Systèmes, Réseaux et Télécommunications à Dakar, je consacre mon mémoire à
          la conception d'une infrastructure hybride résiliente, pensée pour assurer la{" "}
          <Strong>haute disponibilité des services critiques</Strong>.
        </p>
        <p>
          En dehors de l’informatique, j’aime le football et les documentaires. Je garde aussi un œil sur les nouveautés technologiques. À travers mes écrans, je découvre d’autres cultures et des parcours de vie qui nourrissent ma curiosité.
        </p>
        <p>
          Ce site rassemble un peu de tout cela : ce que je construis, ce que je transmets et les expériences qui façonnent
          mon parcours.
        </p>
      </div>

      <div className="mt-8 max-w-[640px]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-5">Compétences</p>
        <div className="space-y-7">
          {SKILL_GROUPS.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted mb-2.5">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-bg-secondary border border-border text-text-secondary text-[12px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
