import { GithubIcon, LinkedInIcon } from './icons';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/DiegoIpaez',
    icon: <GithubIcon />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/diego-ivan-paez-baa513219/',
    icon: <LinkedInIcon />,
  },
];

export default function FloatingFooter() {
  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm">
      <span className="text-white/60">
        © {new Date().getFullYear()} DiegoIpaez
      </span>
      <span className="text-white/20">·</span>
      {LINKS.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-white/40 hover:text-white/90 transition-colors"
        >
          {icon}
        </a>
      ))}
    </footer>
  );
}
