import { NextResponse } from 'next/server';

/**
 * POST /api/razorpay/promotions/apply
 *
 * Razorpay Magic Checkout calls this when a customer applies a coupon code.
 * Validates the code and returns the discount amount.
 *
 * Note: Razorpay sends the order_id (receipt field), contact, email, and code.
 * We don't have cart contents server-side, so for DIWALI10 (percentage-based),
 * we need the order amount from the Razorpay order. We approximate using the
 * order created earlier.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = (body.code || '').trim().toUpperCase();

    if (code === 'SHUBH300') {
      return NextResponse.json({
        promotion: {
          reference_id: 'promo_shubh300',
          type: 'coupon',
          code: 'SHUBH300',
          value: 30000, // ₹300 in paise
          value_type: 'fixed_amount',
          description: '₹300 off — Shubh Deepavali festive discount'
        }
      });
    }

    if (code === 'DIWALI10') {
      return NextResponse.json({
        promotion: {
          reference_id: 'promo_diwali10',
          type: 'coupon',
          code: 'DIWALI10',
          value: 10,
          value_type: 'percentage',
          description: '10% off — Diwali celebration discount'
        }
      });
    }

    // Invalid coupon
    return NextResponse.json({
      failure_code: 'INVALID_PROMOTION',
      failure_reason: 'This coupon code is not valid. Try SHUBH300 or DIWALI10.'
    });
  } catch (err: unknown) {
    console.error('Apply promotion API error:', err);
    return NextResponse.json(
      { failure_code: 'INVALID_PROMOTION', failure_reason: 'Something went wrong processing the coupon.' },
      { status: 500 }
    );
  }
}
