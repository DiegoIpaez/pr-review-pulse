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
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-background/5 backdrop-blur-sm border border-foreground/10 text-sm">
      <span className="text-muted-foreground">
        © {new Date().getFullYear()} DiegoIpaez
      </span>
      <span className="text-muted-foreground/40">·</span>
      {LINKS.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          {icon}
        </a>
      ))}
    </footer>
  );
}
