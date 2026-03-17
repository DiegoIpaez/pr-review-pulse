import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/apiError.handler';
import { GitHubEvent } from './_contracts/types';
import { pullRequestWebhookSchema } from './_contracts/schemas/pullRequestWebhook.schema';
import { pullRequestReviewWebhookSchema } from './_contracts/schemas/pullRequestReviewWebhook.schema';
import { processPullRequest } from './_services/pullRequest.service';
import { processPullRequestReview } from './_services/pullRequestReview.service';

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
