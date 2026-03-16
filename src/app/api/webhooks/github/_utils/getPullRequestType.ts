import { PullRequestType } from '@/generated/prisma/client';

export function getPullRequestType(branch: string): PullRequestType {
  if (branch.startsWith('fix/')) return PullRequestType.FIX;
  if (branch.startsWith('bugfix/')) return PullRequestType.BUGFIX;
  if (branch.startsWith('hotfix/')) return PullRequestType.HOTFIX;
  if (branch.startsWith('release/')) return PullRequestType.RELEASE;
  if (branch.startsWith('chore/')) return PullRequestType.CHORE;
  if (branch.startsWith('feature/') || branch.startsWith('feat/'))
    return PullRequestType.FEATURE;
  return PullRequestType.NO_TICKET;
}
