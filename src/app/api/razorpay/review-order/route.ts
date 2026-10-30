import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/razorpay/review-order
 * 
 * Razorpay Magic Checkout calls this endpoint for COD orders
 * to let you accept/reject them before processing.
 * 
 * Razorpay sends: { razorpay_order_id, payment_method, amount, ... }
 * We respond with: { action: "proceed" | "cancel" }
 * 
 * Basic auth is required by Razorpay for this endpoint.
 */

const USERNAME = process.env.RTO_REVIEW_USERNAME || 'tejasya';
const PASSWORD = process.env.RTO_REVIEW_PASSWORD || 'tejasya2026';

function verifyBasicAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  const [user, pass] = decoded.split(':');
  return user === USERNAME && pass === PASSWORD;
}

export async function POST(req: NextRequest) {
  // Verify basic auth
  if (!verifyBasicAuth(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="RTO Review"' } }
    );
  }

  try {
    const body = await req.json();

    // Log the review request for debugging
    console.log('RTO Review request:', JSON.stringify(body));

    // For now, accept all orders. You can add logic later to reject
    // suspicious orders based on:
    // - body.payment_method === 'cod' && high risk pincode
    // - repeat customer with RTO history
    // - very high order value COD
    //
    // Razorpay also provides rto_review API to check risk_tier
    // before deciding.

    // Accept the order
    return NextResponse.json({
      action: 'proceed'
    });
  } catch (err: any) {
    console.error('RTO review error:', err);
    // On error, still proceed (don't block orders due to our bug)
    return NextResponse.json({
      action: 'proceed'
    });
  }
}
