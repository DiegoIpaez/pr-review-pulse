import {
  type Prisma,
  type PrismaClient,
  PullRequestState,
} from '@/generated/prisma/client';
import prismaClient from '@/lib/clients/prisma-client';
import type { PullRequestWebhookPayload } from '../_contracts/schemas/pull-request-webhook.schema';
import { GitHubPullRequestAction } from '../_contracts/types';
import { getPullRequestType } from '../_utils/get-pull-request-type.util';

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

export async function upsertRepository({
  githubId,
  name,
  url,
  description,
  fork,
  privateRepo,
  ownerId,
  createdAt,
  updatedAt,
  pushedAt,
  prismaTx = prismaClient,
}: {
  githubId: number;
  name: string;
  url: string;
  description: string | null;
  fork: boolean;
  privateRepo: boolean;
  ownerId?: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
  prismaTx?: PrismaClient | Prisma.TransactionClient;
}) {
  return prismaTx.repository.upsert({
    where: { github_id: githubId },
    create: {
      github_id: githubId,
      name,
      url,
      description,
      fork,
      private: privateRepo,
      owner_id: ownerId,
      created_at: new Date(createdAt),
      updated_at: new Date(updatedAt),
      pushed_at: pushedAt ? new Date(pushedAt) : null,
    },
    update: {
      name,
      url,
      description,
      fork,
      private: privateRepo,
      owner_id: ownerId,
      updated_at: new Date(updatedAt),
      pushed_at: pushedAt ? new Date(pushedAt) : null,
    },
  });
}

export async function upsertUser({
  githubId,
  login,
  avatarUrl,
  htmlUrl,
  prismaTx = prismaClient,
}: {
  githubId: number;
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  prismaTx?: PrismaClient | Prisma.TransactionClient;
}) {
  return prismaTx.user.upsert({
    where: { github_id: githubId },
    create: {
      github_id: githubId,
      username: login,
      avatar_url: avatarUrl,
      url: htmlUrl,
    },
    update: {
      username: login,
      avatar_url: avatarUrl,
      url: htmlUrl,
    },
  });
}

async function upsertPullRequest({
  payload,
  repositoryId,
  creatorId,
  mergedById,
  prismaTx = prismaClient,
}: {
  payload: PullRequestWebhookPayload;
  repositoryId: number;
  creatorId: number;
  mergedById?: number;
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
      github_id: pr?.id,
    },
    create: {
      github_id: pr?.id,
      number: pr?.number,
      title: pr?.title,
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
      merged_by_id: mergedById ?? null,
    },
    update: {
      number: pr?.number,
      title: pr?.title,
      body: pr?.body,
      url: pr?.html_url,
      state,
      commits: pr?.commits,
      additions: pr?.additions,
      deletions: pr?.deletions,
      changed_files: pr?.changed_files,
      repository_id: repositoryId,
      creator_id: creatorId,
      ...(mergedAt && { merged_at: mergedAt }),
      ...(closedAt && { closed_at: closedAt }),
      ...(mergedById && { merged_by_id: mergedById }),
      ...(action === GitHubPullRequestAction.Reopened && {
        state: PullRequestState.open,
        closed_at: null,
        merged_at: null,
        merged_by_id: null,
      }),
    },
  });
}

export async function processPullRequest(payload: PullRequestWebhookPayload) {
  const { pull_request: pr, repository } = payload;

  return prismaClient.$transaction(
    async (prismaTx) => {
      const owner = await upsertUser({
        githubId: repository?.owner?.id,
        login: repository?.owner?.login ?? '',
        avatarUrl: repository?.owner?.avatar_url ?? '',
        htmlUrl: repository?.owner?.html_url ?? '',
        prismaTx,
      });

      const repo = await upsertRepository({
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
      });

      const creator = await upsertUser({
        githubId: pr?.user?.id,
        login: pr?.user?.login ?? '',
        avatarUrl: pr?.user?.avatar_url ?? '',
        htmlUrl: pr?.user?.html_url ?? '',
        prismaTx,
      });

      const mergedBy =
        pr?.merged_by &&
        (await upsertUser({
          githubId: pr.merged_by.id,
          login: pr.merged_by.login,
          avatarUrl: pr.merged_by.avatar_url,
          htmlUrl: pr.merged_by.html_url,
          prismaTx,
        }));

      const pullRequest = await upsertPullRequest({
        payload,
        repositoryId: repo.id,
        creatorId: creator.id,
        mergedById: mergedBy?.id,
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
