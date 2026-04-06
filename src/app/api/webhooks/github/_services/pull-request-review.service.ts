import prismaClient from '@/lib/clients/prisma-client';
import { GitHubReviewState } from '../_contracts/types';
import { getPullRequestType } from '../_utils/get-pull-request-type.util';
import type { PullRequestReviewWebhookPayload } from '../_contracts/schemas/pull-request-review-webhook.schema';
import { upsertRepository, upsertUser } from './pull-request.service';

export async function processPullRequestReview(
  payload: PullRequestReviewWebhookPayload
) {
  const { review, pull_request: pr, repository } = payload;

  const branch = pr.head.ref;
  const isApproved = review.state === GitHubReviewState.Approved;

  return prismaClient.$transaction(
    async (prismaTx) => {
      const owner = await upsertUser({
        githubId: repository?.owner?.id,
        login: repository?.owner?.login ?? '',
        avatarUrl: repository?.owner?.avatar_url ?? '',
        htmlUrl: repository?.owner?.html_url ?? '',
        prismaTx,
      });

      const [repositoryRecord, creator, reviewer] = await Promise.all([
        upsertRepository({
          githubId: repository?.id,
          name: repository?.name ?? '',
          url: repository?.html_url ?? '',
          description: repository?.description ?? null,
          fork: repository?.fork ?? false,
          privateRepo: repository?.private ?? false,
          ownerId: owner?.id,
          createdAt: repository?.created_at ?? '',
          updatedAt: repository?.updated_at ?? '',
          pushedAt: repository?.pushed_at ?? null,
          prismaTx,
        }),
        upsertUser({
          githubId: pr?.user?.id,
          login: pr?.user?.login ?? '',
          avatarUrl: pr?.user?.avatar_url ?? '',
          htmlUrl: pr?.user?.html_url ?? '',
          prismaTx,
        }),
        upsertUser({
          githubId: review?.user?.id,
          login: review?.user?.login ?? '',
          avatarUrl: review?.user?.avatar_url ?? '',
          htmlUrl: review?.user?.html_url ?? '',
          prismaTx,
        }),
      ]);

      const pullRequest = await prismaTx.pullRequest.upsert({
        where: {
          github_id: pr?.id,
        },
        update: {},
        create: {
          github_id: pr?.id,
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

      return prismaTx.pullRequestReview.upsert({
        where: {
          github_id: review?.id,
        },
        create: {
          github_id: review?.id,
          pull_request_id: pullRequest?.id,
          reviewer_id: reviewer?.id,
          body: (review?.body ?? '')?.trim() || null,
          url: review?.html_url,
          approved_at: isApproved ? new Date(review?.submitted_at) : null,
          submitted_at: new Date(review?.submitted_at),
          state: review?.state,
        },
        update: {
          pull_request_id: pullRequest?.id,
          reviewer_id: reviewer?.id,
          body: (review?.body ?? '')?.trim() || null,
          url: review?.html_url,
          approved_at: isApproved ? new Date(review?.submitted_at) : null,
          submitted_at: new Date(review?.submitted_at),
          state: review?.state,
        },
      });
    },
    {
      timeout: 15000,
      maxWait: 20000,
    }
  );
}
