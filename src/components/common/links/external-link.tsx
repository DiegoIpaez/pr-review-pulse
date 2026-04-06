import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

type ExternalLinkProps = {
  href?: string | null;
  children: React.ReactNode;
};

export default function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <div className="flex items-center gap-3">
      <a
        href={href ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-medium hover:underline hover:text-primary transition-colors"
      >
        {children}
        {href && <ExternalLinkIcon className="w-3.5 h-3.5 opacity-60" />}
      </a>
    </div>
  );
}
