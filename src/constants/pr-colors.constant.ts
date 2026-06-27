export const PR_TYPE_COLORS: Record<string, string> = {
  feature: 'bg-green-500',
  fix: 'bg-red-700',
  hotfix: 'bg-orange-500',
  refactor: 'bg-purple-500',
  docs: 'bg-blue-500',
  test: 'bg-yellow-500',
  release: 'bg-pink-500',
  chore: 'bg-gray-500',
  no_ticket: 'bg-slate-500',
};

export const PR_STATE_COLORS: Record<string, string> = {
  open: 'bg-amber-500',
  merged: 'bg-purple-500',
  closed: 'bg-slate-500',
};

export const FALLBACK_COLOR = 'bg-gray-500 dark:bg-gray-400';
