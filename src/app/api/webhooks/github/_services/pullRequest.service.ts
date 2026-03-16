import {
  Prisma,
  PrismaClient,
  PullRequestState,
} from '@/generated/prisma/client';
import prismaClient from '@/lib/prismaClient';
import { getPullRequestType } from '../_utils/getPullRequestType';
import { GitHubPullRequestAction } from '../_contracts/types';
import type { PullRequestWebhookPayload } from '../_contracts/schemas/pullRequestWebhook.schema';

function resolvePRState(
  action: GitHubPullRequestAction,
  merged: boolean
): PullRequestState {
  if (action === GitHubPullRequestAction.Closed && merged) {
    return PullRequestState.merged;
  }
  if (action === GitHubPullRequestAction.Closed) {
    return PullRequestState.closed;
  }
  return PullRequestState.open;
}

async function upsertRepository({
  name,
  url,
  prismaTx = prismaClient,
}: {
  name: string;
  url: string;
  prismaTx?: PrismaClient | Prisma.TransactionClient;
}) {
  return prismaTx.repository.upsert({
    where: { name },
    create: { name, url },
    update: { url },
  });
}

async function upsertUser({
  login,
  avatarUrl,
  htmlUrl,
  prismaTx = prismaClient,
}: {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  prismaTx?: PrismaClient | Prisma.TransactionClient;
}) {
  return prismaTx.user.upsert({
    where: { username: login },
    create: {
      username: login,
      avatar_url: avatarUrl,
      url: htmlUrl,
    },
    update: {
      avatar_url: avatarUrl,
      url: htmlUrl,
    },
  });
}

async function upsertPullRequest({
  payload,
  repositoryId,
  creatorId,
  prismaTx = prismaClient,
}: {
  payload: PullRequestWebhookPayload;
  repositoryId: number;
  creatorId: number;
  prismaTx?: PrismaClient | Prisma.TransactionClient;
}) {
  const { action, pull_request: pr } = payload;

  const state = resolvePRState(action, pr?.merged);
  const type = getPullRequestType(pr?.head?.ref ?? '');

  const mergedAt =
    pr?.merged && pr?.merged_at ? new Date(pr.merged_at) : undefined;
  const closedAt =
    action === GitHubPullRequestAction.Closed && pr?.closed_at
      ? new Date(pr.closed_at)
      : undefined;

  return prismaTx.pullRequest.upsert({
    where: {
      number_repository_id: {
        number: pr?.number,
        repository_id: repositoryId,
      },
    },
    create: {
      number: pr?.number,
      body: pr?.body,
      url: pr?.html_url,
      branch: pr?.head?.ref,
      type,
      state,
      commits: pr?.commits,
      additions: pr?.additions,
      deletions: pr?.deletions,
      changed_files: pr?.changed_files,
      created_at: new Date(pr?.created_at),
      merged_at: mergedAt ?? null,
      closed_at: closedAt ?? null,
      repository_id: repositoryId,
      creator_id: creatorId,
    },
    update: {
      body: pr?.body,
      url: pr?.html_url,
      state,
      commits: pr?.commits,
      additions: pr?.additions,
      deletions: pr?.deletions,
      changed_files: pr?.changed_files,
      ...(mergedAt && { merged_at: mergedAt }),
      ...(closedAt && { closed_at: closedAt }),
      ...(action === GitHubPullRequestAction.Reopened && {
        state: PullRequestState.open,
        closed_at: null,
        merged_at: null,
      }),
    },
  });
}

export async function processPullRequest(payload: PullRequestWebhookPayload) {
  const { pull_request: pr, repository } = payload;

  return prismaClient.$transaction(
    async (prismaTx) => {
      const [repo, creator] = await Promise.all([
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
      ]);

      const pullRequest = await upsertPullRequest({
        payload,
        repositoryId: repo.id,
        creatorId: creator.id,
        prismaTx,
      });

      return pullRequest;
    },
    {
      timeout: 15000,
      maxWait: 20000,
    }
  );
}
