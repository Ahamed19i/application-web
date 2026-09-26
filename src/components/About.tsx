
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="a-propos" aria-labelledby="a-propos-heading" className="scroll-mt-24">
      <div className="lg:hidden sticky top-0 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-border">
        <h2 id="a-propos-heading" className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary">À propos</h2>
      </div>
      <h2 className="hidden lg:block text-[13px] font-semibold uppercase tracking-[0.15em] text-text-primary mb-10">
        À propos
      </h2>

      <div className="space-y-5 text-[15px] sm:text-[16px] text-text-secondary leading-relaxed max-w-[640px] [&_a]:text-text-primary [&_a]:underline [&_a]:decoration-transparent hover:[&_a]:decoration-accent-primary [&_a]:underline-offset-4 [&_a]:transition-colors">
        {/* TODO(Ahamed): qui je suis et ce qui m'a amené à l'infrastructure. */}
        <p>TODO(Ahamed) : qui je suis et ce qui m'a amené à l'infrastructure.</p>
        {/* TODO(Ahamed): ce que je fais en ce moment. */}
        <p>TODO(Ahamed) : ce que je fais en ce moment.</p>
        {/* TODO(Ahamed): ce que je fais en dehors de l'informatique. */}
        <p>TODO(Ahamed) : ce que je fais en dehors de l'informatique.</p>
      </div>
    </section>
  );
};
