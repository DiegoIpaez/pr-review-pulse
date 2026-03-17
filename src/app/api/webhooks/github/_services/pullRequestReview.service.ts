import prismaClient from '@/lib/prismaClient';
import { GitHubReviewState } from '../_contracts/types';
import { getPullRequestType } from '../_utils/getPullRequestType';
import type { PullRequestReviewWebhookPayload } from '../_contracts/schemas/pullRequestReviewWebhook.schema';
import { upsertRepository, upsertUser } from './pullRequest.service';

export async function processPullRequestReview(
  payload: PullRequestReviewWebhookPayload
) {
  const { review, pull_request: pr, repository } = payload;

  const branch = pr.head.ref;
  const isApproved = review.state === GitHubReviewState.Approved;

  return prismaClient.$transaction(
    async (prismaTx) => {
      const [repositoryRecord, creator, reviewer] = await Promise.all([
        upsertRepository({
          name: repository?.name ?? '',
          url: repository?.html_url ?? '',
          prismaTx,
        }),
        upsertUser({
          login: pr?.user?.login ?? '',
          avatarUrl: pr?.user?.avatar_url ?? '',
          htmlUrl: pr?.user?.html_url ?? '',
          prismaTx,
        }),
        upsertUser({
          login: review?.user?.login ?? '',
          avatarUrl: review?.user?.avatar_url ?? '',
          htmlUrl: review?.user?.html_url ?? '',
          prismaTx,
        }),
      ]);

      const pullRequest = await prismaTx.pullRequest.upsert({
        where: {
          number_repository_id: {
            number: pr?.number,
            repository_id: repositoryRecord?.id,
          },
        },
        update: {},
        create: {
          type: getPullRequestType(branch),
          number: pr?.number,
          repository_id: repositoryRecord.id,
          branch,
          state: pr?.state,
          creator_id: creator?.id,
          created_at: new Date(pr?.created_at),
          url: pr?.html_url,
        },
        select: { id: true },
      });

      return prismaTx.pullRequestReview.create({
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
