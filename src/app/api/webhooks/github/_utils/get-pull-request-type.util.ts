import { PullRequestType } from '@/generated/prisma/client';

export function getPullRequestType(branch: string): PullRequestType {
  if (
    branch.startsWith('fix/') ||
    branch.startsWith('bug/') ||
    branch.startsWith('bugfix/')
  )
    return PullRequestType.fix;
  if (branch.startsWith('hotfix/')) return PullRequestType.hotfix;
  if (branch.startsWith('release/')) return PullRequestType.release;
  if (branch.startsWith('refactor/')) return PullRequestType.refactor;
  if (branch.startsWith('chore/')) return PullRequestType.chore;
  if (branch.startsWith('docs/')) return PullRequestType.docs;
  if (branch.startsWith('test/')) return PullRequestType.test;
  if (branch.startsWith('feature/') || branch.startsWith('feat/'))
    return PullRequestType.feature;
  return PullRequestType.no_ticket;
}
