import React from 'react';

interface Certification {
  title: string;
  issuer: string;
  year?: string;
  status: 'obtenue' | 'en cours';
}

const CERTIFICATIONS: Certification[] = [
  { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2026', status: 'obtenue' },
  { title: 'Cisco Networking Basics', issuer: 'Cisco Networking Academy', status: 'obtenue' },
  { title: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy', status: 'obtenue' },
  { title: 'CCNA', issuer: 'Cisco', status: 'en cours' },
  { title: 'DevOps', issuer: 'Coursera', status: 'en cours' },
];

export const Certifications: React.FC = () => {
  return (
    <section aria-labelledby="certifications-heading" className="scroll-mt-24">
      <h2
        id="certifications-heading"
        className="text-[12px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-6"
      >
        Certifications
      </h2>

      <ul className="flex flex-wrap gap-3">
        {CERTIFICATIONS.map((cert) => (
          <li
            key={cert.title}
            className="flex-1 min-w-[200px] rounded-xl border border-border bg-bg-secondary/50 px-4 py-3"
          >
            <p className="text-[14px] font-semibold text-text-primary leading-snug">{cert.title}</p>
            <p className="text-[12px] text-text-muted mt-0.5">
              {cert.issuer}{cert.year ? ` · ${cert.year}` : ''}
            </p>
            <span
              className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                cert.status === 'obtenue'
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'bg-text-muted/10 text-text-muted'
              }`}
            >
              {cert.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
