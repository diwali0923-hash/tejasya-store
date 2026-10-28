import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/keep-alive
 * 
 * Pings Supabase with a lightweight query to prevent the free-tier project
 * from sleeping after 7 days of inactivity.
 * 
 * Hook this up to an external cron service (cron-job.org, UptimeRobot, or Vercel Cron)
 * to hit this endpoint every 4-5 days.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Lightweight query — just count orders, minimal data transfer
    const { count, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      ordersCount: count,
      message: 'Supabase pinged successfully — project will not sleep.'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: (err as Error)?.message || 'Ping failed' },
      { status: 500 }
    );
  }
}
