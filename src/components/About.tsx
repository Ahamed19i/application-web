
import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award } from 'lucide-react';

export const About: React.FC = () => {
  const timeline = [
    {
      year: "2024 - Présent",
      title: "Master 2 SRT",
      institution: "AFI-L'UE",
      description: "Spécialisation en Systèmes, Réseaux et Télécommunications. Focus sur le Cloud et la Cybersécurité.",
      type: "education"
    },
    {
      year: "2024",
      title: "Stage Administrateur Systèmes & Réseaux",
      institution: "Tunisie Telecom",
      description: "Maintenance des infrastructures réseaux, configuration de routeurs Cisco et supervision.",
      type: "experience"
    },
    {
      year: "2021 - 2024",
      title: "Licence SRT",
      institution: "Université Centrale de Tunis",
      description: "Bases solides en administration systèmes (Linux/Windows) et réseaux (CCNA)/Huawei.",
      type: "education"
    }
  ];

  const skills = [
    { category: "Systèmes", items: ["Linux (Ubuntu/Debian)", "Windows Server", "Virtualisation"] },
    { category: "Réseaux", items: ["Cisco IOS", "pfSense", "EVE-NG", "VPN/VLAN"] },
    { category: "Cloud & DevOps", items: ["Docker", "Kubernetes", "Ansible", "AWS", "CI/CD"] }
  ];

  const certifications = [
    { title: "Cisco Networking Basics", issuer: "Cisco Networking Academy", date: "2025" },
    { title: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", date: "2025" },
    { title: "CCNA (En cours)", issuer: "Cisco", date: "2026" },
    { title: "DevOps (En cours)", issuer: "Coursera", date: "2026" }
  ];

  return (
    <section id="about" className="pt-16 md:pt-24 pb-16 md:pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">Profil</p>
        <h2 className="font-serif font-medium text-3xl md:text-4xl mb-12 tracking-tight text-text-primary">
          Mon expertise
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 text-text-secondary leading-relaxed text-base">
            <p>
              Je suis <strong className="text-text-primary">Ahamed Hassani Mhoma</strong>, étudiant en ingénierie <strong className="text-text-primary">Systèmes & Réseaux Télécom</strong>, spécialisé dans l'administration des infrastructures <strong className="text-text-primary">Linux/Windows Server</strong>, la virtualisation et le cloud. Mon parcours entre <strong className="text-text-primary">Tunis et Dakar</strong>.
            </p>
            {/* TODO(Ahamed): remplacer par ta propre description de ta démarche/philosophie de travail — phrase générique retirée. */}
            <p>
              Je m'oriente vers le <strong className="text-text-primary">DevOps et Cloud Engineering</strong>, avec une couche cybersécurité en développement actif.
            </p>
            <p>
              Expérience chez <strong className="text-text-primary">Tunisie Télécom</strong>, avec une compréhension opérationnelle des environnements télécoms à grande échelle.
            </p>

            <div className="pt-8">
              <h3 className="text-base font-semibold mb-8 flex items-center gap-3 text-text-primary">
                <GraduationCap className="text-accent-primary" size={18} /> Parcours académique
              </h3>
              <div className="space-y-8 border-l border-border ml-2 pl-6 relative">
                {timeline.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-bg border border-accent-primary"></div>
                    <span className="text-accent-primary font-mono text-[10px] tracking-wider mb-1 block uppercase">{item.year}</span>
                    <h4 className="text-base font-semibold mb-0.5 text-text-primary">{item.title}</h4>
                    <p className="text-text-muted text-sm">{item.institution}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-base font-semibold mb-8 flex items-center gap-3 text-text-primary">
                <Award className="text-accent-primary" size={18} /> Certifications
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="border border-border p-4 flex items-center gap-4">
                    <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
                      <Award className="text-accent-primary" size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-0.5 text-text-primary">{cert.title}</h4>
                      <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">{cert.issuer} · {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {skills.map((skill, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold mb-4 text-text-primary uppercase tracking-wider font-mono">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map((item, i) => (
                    <li key={i} className="text-sm text-text-secondary border-b border-border py-2 last:border-b-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="pt-6">
              <h3 className="text-sm font-semibold mb-4 text-text-primary uppercase tracking-wider font-mono">Langues</h3>
              <ul className="space-y-2">
                <li className="text-sm text-text-secondary border-b border-border py-2">Français — Courant</li>
                <li className="text-sm text-text-secondary py-2">Anglais — Professionnel</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
