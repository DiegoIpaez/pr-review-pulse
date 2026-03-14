import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/apiError.handler';
import {
  GitHubEvent,
  type PullRequestReviewWebhookPayload,
} from './_contracts/types';
import { pullRequestReviewWebhookSchema } from './_contracts/schemas/pullRequestReviewWebhook.schema';
import { processPullRequestReview } from './_services/pullRequestReview.service';

export async function POST(request: NextRequest) {
  try {
    const githubEvent = request.headers.get('x-github-event') as GitHubEvent;
    if (githubEvent !== GitHubEvent.PullRequestReview) {
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    const body: PullRequestReviewWebhookPayload = await request.json();
    const payload = pullRequestReviewWebhookSchema.parse(body);

    const data = await processPullRequestReview(payload);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
