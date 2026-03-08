
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
    { category: "Cloud & DevOps", items: ["Docker", "Kubernetes", "Ansible", "AWS", "CI/CD"], level: 75 },
    { category: "Cybersécurité", items: ["Kali Linux", "Wireshark", "Hardening", "Nmap"], level: 70 },
    { category: "Développement", items: ["Python", "Bash", "React", "Node.js"], level: 65 }
  ];

  const certifications = [
    { title: "Cisco Networking Basics", issuer: "Cisco Networking Academy", date: "2023" },
    { title: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", date: "2023" },
    { title: "CCNA (En cours)", issuer: "Cisco", date: "2024" }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <span className="text-accent-primary">01.</span> À Propos
          <div className="h-px bg-white/10 flex-grow"></div>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-2 space-y-6 text-white/70 leading-relaxed text-base">
            <p>
              Je suis <span className="text-white font-bold">Ahamed Hassani M'homa</span>, un passionné d'informatique originaire des Comores et basé à Dakar. 
              Mon parcours académique et mes expériences m'ont permis de forger une expertise polyvalente allant de l'administration système à la mise en place d'architectures Cloud complexes.
            </p>
            <p>
              Mon objectif est de devenir un expert capable de concevoir des infrastructures résilientes, automatisées et hautement sécurisées. 
              Je crois fermement que le <span className="text-accent-primary">DevOps</span> et le <span className="text-accent-secondary">Cloud</span> sont les piliers de l'innovation technologique actuelle.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-accent-primary" size={18} />
                <span>Autonome & Rigoureux</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-accent-primary" size={18} />
                <span>Esprit d'Analyse</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-accent-primary" size={18} />
                <span>Veille Technologique</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-accent-primary" size={18} />
                <span>Travail d'Équipe</span>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-accent-primary to-accent-secondary opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-accent-primary/20">
              <img 
                src="https://picsum.photos/seed/ahamed/600/600" 
                alt="Ahamed Hassani M'homa" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="grid md:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <GraduationCap className="text-accent-primary" /> Parcours
          </h3>
          <div className="space-y-12 border-l-2 border-white/10 ml-4 pl-8 relative">
            {timeline.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-bg border-2 border-accent-primary"></div>
                <div className="glass p-6 rounded-xl hover:border-accent-primary/30 transition-colors">
                  <span className="text-accent-primary font-mono text-sm mb-2 block">{item.year}</span>
                  <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                  <p className="text-accent-secondary text-sm mb-3">{item.institution}</p>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <Award className="text-accent-secondary" /> Compétences
          </h3>
          <div className="space-y-8">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-mono font-bold">{skill.category}</span>
                  <span className="text-white/40 text-sm">{skill.level}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                  ></motion.div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {skill.items.map((item, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10 text-white/60">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <h3 className="text-2xl font-bold mb-10">Certifications</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className="glass p-6 rounded-xl flex items-start gap-4 hover:glow-secondary transition-all group">
              <div className="w-12 h-12 rounded-lg bg-accent-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-accent-secondary/20 transition-colors">
                <Award className="text-accent-secondary" />
              </div>
              <div>
                <h4 className="font-bold mb-1">{cert.title}</h4>
                <p className="text-xs text-white/40 mb-2">{cert.issuer}</p>
                <span className="text-[10px] font-mono text-accent-secondary">{cert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
