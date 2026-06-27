import { type NextRequest, NextResponse } from 'next/server';
import { CONFIG } from '@/constants/config.constant';
import logger from '@/lib/logger';
import { processAllDailyReports } from '../../daily-reports/daily-reports.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (authHeader !== `Bearer ${CONFIG.CRON_SECRET}`) {
      logger.warn('Unauthorized attempt to trigger daily reports cron');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Trigger processing (don't wait for it to finish if it takes too long,
    // but in serverless we should probably await or use a queue)
    // For now, we await it as it shouldn't take more than a few seconds for a small/medium team.
    await processAllDailyReports();

    return NextResponse.json({
      message: 'Daily reports processed successfully',
    });
  } catch (error) {
    logger.error('Error processing daily reports cron:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
