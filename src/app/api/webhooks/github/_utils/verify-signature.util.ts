import { createHmac, timingSafeEqual } from 'crypto';
import { CONFIG } from '@/constants/config.constant';

export function verifyGitHubSignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const hmac = createHmac('sha256', CONFIG.GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return false;
  }
}
