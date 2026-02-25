import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/apiError.handler';
import prismaClient from '@/lib/prismaClient';
import { PullRequestType } from '@/generated/prisma/enums';
import {
  GitHubEvent,
  GitHubReviewState,
  PullRequestReviewWebhookPayload,
} from './_contracts/types';
import { pullRequestReviewWebhookSchema } from './_contracts/schemas/pullRequestReviewWebhook.schema';

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

export async function POST(request: NextRequest) {
  try {
    const githubEvent = request.headers.get('x-github-event') as GitHubEvent;
    if (githubEvent !== GitHubEvent.PullRequestReview) {
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    const body: PullRequestReviewWebhookPayload = await request.json();
    const {
      review,
      pull_request: pr,
      repository,
    } = pullRequestReviewWebhookSchema.parse(body);

    const branch = pr?.head?.ref;
    const isApproved = review?.state === GitHubReviewState.Approved;

    const prData = {
      prNumber: pr?.number,
      branch,
      repositoryName: repository?.name,
      taskType: getTaskType(branch),
      creator: pr?.user?.login,
      reviewer: review?.user?.login,
      note: (review?.body ?? '').trim() || null,
      approvedAt: isApproved ? new Date(review.submitted_at) : null,
      reviewedAt: review?.submitted_at ? new Date(review.submitted_at) : null,
      createdAt: new Date(pr?.created_at),
    };

    const data = await prismaClient.$transaction(async (prismaTx) => {
      const [repository_record, creator, reviewer] = await Promise.all([
        prismaTx.repository.upsert({
          where: { name: prData.repositoryName },
          update: {},
          create: { name: prData.repositoryName },
          select: { id: true },
        }),
        prismaTx.user.upsert({
          where: { username: prData.creator },
          update: {},
          create: { username: prData.creator },
          select: { id: true },
        }),
        prismaTx.user.upsert({
          where: { username: prData.reviewer },
          update: {},
          create: { username: prData.reviewer },
          select: { id: true },
        }),
      ]);

      const pullRequest = await prismaTx.pullRequest.upsert({
        where: {
          number_repository_id: {
            number: prData.prNumber,
            repository_id: repository_record.id,
          },
        },
        update: {
          branch: prData.branch,
        },
        create: {
          type: prData.taskType,
          number: prData.prNumber!,
          repository_id: repository_record.id,
          branch: prData.branch,
          creator_id: creator.id,
          created_at: prData.createdAt!,
        },
        select: { id: true },
      });

      const prReview = await prismaTx.pullRequestReview.create({
        data: {
          pull_request_id: pullRequest.id,
          reviewer_id: reviewer.id,
          note: prData.note,
          approved_at: prData.approvedAt,
          reviewed_at: prData.reviewedAt,
        },
      });
      return prReview;
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
