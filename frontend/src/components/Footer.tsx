import { Mail, Heart } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={18} height={18} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={18} height={18} {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const socialLinks = [
  {
    icon: InstagramIcon,
    label: 'Instagram',
    href: 'https://instagram.com/harshkhetann',
    hoverColor: 'hover:text-pink-400',
    glowColor: 'group-hover:shadow-pink-500/20',
  },
  {
    icon: GithubIcon,
    label: 'GitHub',
    href: 'https://github.com/HarshKhetan20',
    hoverColor: 'hover:text-white',
    glowColor: 'group-hover:shadow-white/10',
  },
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:harshkhetan20@gmail.com',
    hoverColor: 'hover:text-[var(--tertiary)]',
    glowColor: 'group-hover:shadow-[var(--tertiary)]/20',
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-[var(--border)]">
      {/* Subtle gradient glow line at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Main footer grid */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12">
          
          {/* Left — Brand + tagline */}
          <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] rounded-md" />
              <span className="text-lg font-bold text-white">CodeLens AI</span>
            </div>
            <p className="text-sm text-[var(--outline)] max-w-xs leading-relaxed">
              An intelligent code review assistant — analyze, refactor, and ship better code.
            </p>
          </div>

          {/* Center — Quick links */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--outline)]/70">Quick Links</span>
            <div className="flex gap-6 text-sm text-[var(--outline)]">
              <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How it Works</a>
              <a href="#changelog" className="hover:text-white transition-colors duration-200">Changelog</a>
              <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
            </div>
          </div>

          {/* Right — Socials */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--outline)]/70">Connect</span>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href, hoverColor, glowColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`group relative w-10 h-10 rounded-xl bg-[var(--surface-container-high)] border border-[var(--outline)]/10 flex items-center justify-center text-[var(--outline)] ${hoverColor} transition-all duration-300 hover:border-[var(--outline)]/30 hover:-translate-y-0.5 hover:shadow-lg ${glowColor}`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 md:mt-10 pt-6 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--outline)]">
            {/* Copyright */}
            <div className="flex items-center gap-1.5">
              <span>© {currentYear} CodeLens AI. All rights reserved.</span>
            </div>

            {/* Built by */}
            <div className="flex items-center gap-1.5">
              <span>Built with</span>
              <Heart size={12} className="text-red-400 fill-red-400 animate-pulse" />
              <span>by</span>
              <a
                href="https://instagram.com/harshkhetann"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-80 transition-opacity"
              >
                Harsh Khetan
              </a>
            </div>

            {/* Legal */}
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
