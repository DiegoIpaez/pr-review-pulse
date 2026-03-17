import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { GitHubEvent } from './_contracts/types';
import { pullRequestWebhookSchema } from './_contracts/schemas/pull-request-webhook.schema';
import { pullRequestReviewWebhookSchema } from './_contracts/schemas/pull-request-review-webhook.schema';
import { processPullRequest } from './_services/pull-request.service';
import { processPullRequestReview } from './_services/pull-request-review.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const githubEvent = request.headers.get('x-github-event') as GitHubEvent;

    switch (githubEvent) {
      case GitHubEvent.PullRequest: {
        const payload = pullRequestWebhookSchema.parse(body);
        const data = await processPullRequest(payload);
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
