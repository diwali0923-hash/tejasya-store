import { NextResponse } from 'next/server';

/**
 * POST /api/razorpay/fetch-order
 *
 * After Magic Checkout payment completes, fetch the full Razorpay order
 * to get the customer's shipping address, contact, and chosen shipping method.
 * This data is only available on the server (requires key_secret for auth).
 */
export async function POST(req: Request) {
  try {
    const { razorpay_order_id } = await req.json();

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const res = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${key_id}:${key_secret}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Razorpay fetch order failed:', errText);
      return NextResponse.json({ error: 'Failed to fetch order from Razorpay' }, { status: res.status });
    }

    const order = await res.json();

    return NextResponse.json(order);
  } catch (err: unknown) {
    console.error('Fetch order error:', err);
    return NextResponse.json(
      { error: (err as Error)?.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
