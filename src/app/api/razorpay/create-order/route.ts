import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, receipt, notes, line_items } = await req.json();

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Fallback for testing if Razorpay keys are not yet configured in .env.local
    if (!key_id || !key_secret || key_id.includes('your-key-id')) {
      return NextResponse.json({
        id: `order_mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: receipt || `rec_${Date.now()}`,
        isMock: true,
        key_id: 'rzp_test_mock',
        message: 'Razorpay keys not configured, running in simulation mode'
      });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const amountInPaise = Math.round(amount * 100);

    const baseOptions: any = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
      rto_review: true
    };

    // Magic Checkout requires line_items and line_items_total
    let orderPayload: any = baseOptions;
    if (line_items && Array.isArray(line_items) && line_items.length > 0) {
      orderPayload = {
        ...baseOptions,
        line_items_total: amountInPaise,
        line_items
      };
    }

    const order = await instance.orders.create(orderPayload);

    return NextResponse.json({
      ...(order as unknown as Record<string, unknown>),
      key_id,
      isMock: false
    });
  } catch (err: any) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
