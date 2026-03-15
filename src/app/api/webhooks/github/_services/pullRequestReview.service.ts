import prismaClient from '@/lib/prismaClient';
import { PullRequestType } from '@/generated/prisma/enums';
import type { PullRequestReviewWebhookPayload } from '../_contracts/schemas/pullRequestReviewWebhook.schema';
import { GitHubReviewState } from '../_contracts/types';

function getTaskType(branch: string): PullRequestType {
  if (branch.startsWith('fix/')) return PullRequestType.FIX;
  if (branch.startsWith('bugfix/')) return PullRequestType.BUGFIX;
  if (branch.startsWith('hotfix/')) return PullRequestType.HOTFIX;
  if (branch.startsWith('release/')) return PullRequestType.RELEASE;
  if (branch.startsWith('chore/')) return PullRequestType.CHORE;
  if (branch.startsWith('feature/') || branch.startsWith('feat/'))
    return PullRequestType.FEATURE;
  return PullRequestType.NO_TICKET;
}

export async function processPullRequestReview(
  payload: PullRequestReviewWebhookPayload
) {
  const { review, pull_request: pr, repository } = payload;

  const branch = pr.head.ref;
  const isApproved = review.state === GitHubReviewState.Approved;

  return prismaClient.$transaction(
    async (tx) => {
      const [repositoryRecord, creator, reviewer] = await Promise.all([
        tx.repository.upsert({
          where: { name: repository?.name },
          update: {},
          create: { name: repository?.name, url: repository?.html_url },
          select: { id: true },
        }),
        tx.user.upsert({
          where: { username: pr?.user?.login },
          update: {},
          create: {
            username: pr?.user?.login,
            url: pr?.user?.html_url,
            avatar_url: pr?.user?.avatar_url,
          },
          select: { id: true },
        }),
        tx.user.upsert({
          where: { username: review?.user?.login },
          update: {},
          create: {
            username: review?.user?.login,
            url: review?.user?.html_url,
            avatar_url: review?.user?.avatar_url,
          },
          select: { id: true },
        }),
      ]);

      const pullRequest = await tx.pullRequest.upsert({
        where: {
          number_repository_id: {
            number: pr?.number,
            repository_id: repositoryRecord?.id,
          },
        },
        update: {
          branch,
        },
        create: {
          type: getTaskType(branch),
          number: pr?.number,
          repository_id: repositoryRecord.id,
          branch,
          creator_id: creator?.id,
          created_at: new Date(pr?.created_at),
          url: pr?.html_url,
        },
        select: { id: true },
      });

      return tx.pullRequestReview.create({
        data: {
          pull_request_id: pullRequest?.id,
          reviewer_id: reviewer?.id,
          note: (review?.body ?? '')?.trim() || null,
          url: review?.html_url,
          approved_at: isApproved ? new Date(review?.submitted_at) : null,
          reviewed_at: new Date(review?.submitted_at),
        },
      });
    },
    {
      timeout: 15000,
      maxWait: 20000,
    }
  );
}
