import { type NextRequest, NextResponse } from 'next/server';
import { ApiError, apiErrorHandler } from '@/utils/handlers/api-error.handler';
import { pullRequestReviewWebhookSchema } from './_contracts/schemas/pull-request-review-webhook.schema';
import { pullRequestWebhookSchema } from './_contracts/schemas/pull-request-webhook.schema';
import { GitHubEvent, GitHubPullRequestAction } from './_contracts/types';
import { processLabelEvent, syncLabels } from './_services/label.service';
import { processPullRequest } from './_services/pull-request.service';
import { processPullRequestReview } from './_services/pull-request-review.service';
import { verifyGitHubSignature } from './_utils/verify-signature.util';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    if (!verifyGitHubSignature(rawBody, signature))
      throw new ApiError({ status: 401, message: 'Invalid signature' });

    const body = JSON.parse(rawBody);
    const githubEvent = request.headers.get('x-github-event') as GitHubEvent;

    switch (githubEvent) {
      case GitHubEvent.PullRequest: {
        const payload = pullRequestWebhookSchema.parse(body);

        if (
          payload.action === GitHubPullRequestAction.Labeled ||
          payload.action === GitHubPullRequestAction.Unlabeled
        ) {
          const data = await processLabelEvent(payload);
          return NextResponse.json(data, { status: 200 });
        }

        const data = await processPullRequest(payload);

        if (
          payload.action === GitHubPullRequestAction.Opened &&
          payload.pull_request.labels?.length
        ) {
          await syncLabels(data.id, payload.pull_request.labels);
        }

        return NextResponse.json(data, { status: 200 });
      }
      case GitHubEvent.PullRequestReview: {
        const payload = pullRequestReviewWebhookSchema.parse(body);
        const data = await processPullRequestReview(payload);
        return NextResponse.json(data, { status: 200 });
      }
      default:
        return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
