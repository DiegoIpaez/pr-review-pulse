'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownViewerProps = {
  content: string;
  collapsedHeight?: string;
};

export function MarkdownViewer({
  content,
  collapsedHeight = '7.5rem',
}: MarkdownViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ maxHeight: isExpanded ? '9999px' : collapsedHeight }}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-foreground/80 prose-strong:text-foreground prose-code:text-sky-400">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent flex items-end justify-start pb-2">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 rounded-full font-mono text-xs tracking-wide text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
          >
            Ver más
            <ChevronDown size={14} />
          </button>
        </div>
      )}
      {isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="mt-2 flex items-center gap-1.5 rounded-full font-mono text-xs tracking-wide text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
        >
          Ver menos
          <ChevronDown
            size={14}
            className="rotate-180 transition-transform duration-300"
          />
        </button>
      )}
    </div>
  );
}
