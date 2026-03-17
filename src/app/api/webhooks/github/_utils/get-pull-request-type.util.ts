import { PullRequestType } from '@/generated/prisma/client';

export function getPullRequestType(branch: string): PullRequestType {
  if (
    branch.startsWith('fix/') ||
    branch.startsWith('bug/') ||
    branch.startsWith('bugfix/')
  )
    return PullRequestType.FIX;
  if (branch.startsWith('hotfix/')) return PullRequestType.HOTFIX;
  if (branch.startsWith('release/')) return PullRequestType.RELEASE;
  if (branch.startsWith('refactor/')) return PullRequestType.REFACTOR;
  if (branch.startsWith('chore/')) return PullRequestType.CHORE;
  if (branch.startsWith('docs/')) return PullRequestType.DOCS;
  if (branch.startsWith('test/')) return PullRequestType.TEST;
  if (branch.startsWith('feature/') || branch.startsWith('feat/'))
    return PullRequestType.FEATURE;
  return PullRequestType.NO_TICKET;
}
