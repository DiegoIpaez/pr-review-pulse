import prismaClient from '@/lib/clients/prisma-client';
import type { PullRequestWebhookPayload } from '../_contracts/schemas/pull-request-webhook.schema';
import { type GitHubLabel, GitHubPullRequestAction } from '../_contracts/types';
import { processPullRequest } from './pull-request.service';

export async function processLabelEvent(payload: PullRequestWebhookPayload) {
  const { action, label: labelPayload } = payload;

  if (action === GitHubPullRequestAction.Labeled && labelPayload) {
    const pr = await processPullRequest(payload);

    return prismaClient.$transaction(async (tx) => {
      const labelRecord = await tx.label.upsert({
        where: { github_id: labelPayload.id },
        update: {
          name: labelPayload.name,
          color: labelPayload.color,
          description: labelPayload.description,
        },
        create: {
          github_id: labelPayload.id,
          name: labelPayload.name,
          color: labelPayload.color,
          description: labelPayload.description,
        },
      });

      await tx.pullRequestLabel.upsert({
        where: {
          pull_request_id_label_id: {
            pull_request_id: pr.id,
            label_id: labelRecord.id,
          },
        },
        create: { pull_request_id: pr.id, label_id: labelRecord.id },
        update: {},
      });

      return pr;
    });
  }

  if (action === GitHubPullRequestAction.Unlabeled && labelPayload) {
    const pr = await prismaClient.pullRequest.findUnique({
      where: { github_id: payload.pull_request.id },
      select: { id: true },
    });
    if (!pr) return null;

    const labelRecord = await prismaClient.label.findUnique({
      where: { github_id: labelPayload.id },
      select: { id: true },
    });
    if (!labelRecord) return null;

    await prismaClient.pullRequestLabel.deleteMany({
      where: { pull_request_id: pr.id, label_id: labelRecord.id },
    });
    return null;
  }
}

export async function syncLabels(prId: number, labels: GitHubLabel[]) {
  const records = await Promise.all(
    labels.map((l) =>
      prismaClient.label.upsert({
        where: { github_id: l.id },
        create: {
          github_id: l.id,
          name: l.name,
          color: l.color,
          description: l.description,
        },
        update: {
          name: l.name,
          color: l.color,
          description: l.description,
        },
      })
    )
  );

  await prismaClient.$transaction(async (tx) => {
    await tx.pullRequestLabel.deleteMany({
      where: { pull_request_id: prId },
    });

    await tx.pullRequestLabel.createMany({
      data: records.map((r) => ({
        pull_request_id: prId,
        label_id: r.id,
      })),
    });
  });
}
