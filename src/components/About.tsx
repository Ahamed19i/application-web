
import React from 'react';
import { motion } from 'motion/react';
import { Calendar, GraduationCap, Briefcase, Award, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const timeline = [
    {
      year: "2024 - Présent",
      title: "Master 2 SRT",
      institution: "AFI-L'UE / MIT Dakar",
      description: "Spécialisation en Systèmes, Réseaux et Télécommunications. Focus sur le Cloud et la Cybersécurité.",
      type: "education"
    },
    {
      year: "2023",
      title: "Stage Ingénieur Réseaux",
      institution: "Tunisie Telecom",
      description: "Maintenance des infrastructures réseaux, configuration de routeurs Cisco et supervision.",
      type: "experience"
    },
    {
      year: "2020 - 2023",
      title: "Licence SRT",
      institution: "Université Centrale de Tunis",
      description: "Bases solides en administration systèmes (Linux/Windows) et réseaux (CCNA).",
      type: "education"
    }
  ];

  const skills = [
    { category: "Systèmes", items: ["Linux (Ubuntu/Debian/CentOS)", "Windows Server", "Active Directory"], level: 90 },
    { category: "Réseaux", items: ["Cisco IOS", "pfSense", "GNS3/Packet Tracer", "VPN/VLAN"], level: 85 },
    { category: "Cloud & DevOps", items: ["Docker", "Kubernetes", "Ansible", "AWS", "CI/CD"], level: 75 }
  ];

  const certifications = [
    { title: "Cisco Networking Basics", issuer: "Cisco Networking Academy", date: "2023" },
    { title: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", date: "2023" },
    { title: "CCNA (En cours)", issuer: "Cisco", date: "2024" }
  ];

  return (
    <section id="about" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <p className="font-mono text-[11px] text-accent-primary uppercase tracking-[0.2em] mb-4">// 01 — Profil</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Mon <span className="text-accent-primary">expertise</span>
        </h2>
        <div className="w-14 h-1 bg-gradient-to-r from-accent-primary to-transparent rounded-full mb-12"></div>
        
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 text-text-secondary leading-relaxed text-base">
            <p>
              Je suis <strong>Ahamed Hassani Mhoma</strong>, ingénieur <strong>M2 Systèmes & Réseaux</strong> spécialisé dans l'administration des infrastructures <strong>Linux/Windows Server</strong>, la virtualisation et le cloud. Mon parcours entre <strong>Tunis et Dakar</strong> m'a forgé une vision internationale solide.
            </p>
            <p>
              Ma philosophie : automatiser ce qui peut l'être, sécuriser ce qui doit l'être. Je m'oriente vers le <strong>DevOps et Cloud Engineering</strong>, avec une couche cybersécurité en développement actif.
            </p>
            <p>
              Expérimenté chez <strong>Sonatel</strong> (groupe Orange, Sénégal) et <strong>Tunisie Télécom</strong>, j'ai une compréhension opérationnelle des environnements télécoms à grande échelle.
            </p>
            
            <div className="pt-8">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                <GraduationCap className="text-accent-primary" size={20} /> Parcours académique
              </h3>
              <div className="space-y-8 border-l border-white/10 ml-2 pl-6 relative">
                {timeline.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-bg border border-accent-primary shadow-[0_0_8px_rgba(0,180,255,0.5)]"></div>
                    <span className="text-accent-primary font-mono text-[10px] tracking-wider mb-1 block uppercase">{item.year}</span>
                    <h4 className="text-base font-bold mb-0.5">{item.title}</h4>
                    <p className="text-text-muted text-sm">{item.institution}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                <Award className="text-accent-primary" size={20} /> Certifications
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="glass p-4 rounded-xl flex items-center gap-4 hover:border-accent-primary/30 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-accent-primary/5 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/10 transition-colors">
                      <Award className="text-accent-primary" size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-0.5">{cert.title}</h4>
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
                <h3 className="text-sm font-bold mb-6 text-text-primary uppercase tracking-wider font-mono">{skill.category}</h3>
                <div className="space-y-6">
                  {skill.items.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-secondary font-mono">{item}</span>
                        <span className="text-text-muted text-[10px] font-mono">{index === 0 ? '90%' : index === 1 ? '85%' : '75%'}</span>
                      </div>
                      <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: index === 0 ? '90%' : index === 1 ? '85%' : '75%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-accent-secondary to-accent-primary"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-6">
              <h3 className="text-sm font-bold mb-4 text-text-primary uppercase tracking-wider font-mono">Langues</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg border border-success/20 text-success bg-success/5 text-[11px] font-mono tracking-wider">🇫🇷 Français — Courant</span>
                <span className="px-3 py-1.5 rounded-lg border border-white/10 text-text-muted bg-white/5 text-[11px] font-mono tracking-wider">🇬🇧 Anglais — Professionnel</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
