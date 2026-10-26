import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, receipt, notes } = await req.json();

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

    const options = {
      amount: Math.round(amount * 100), // Razorpay accepts amount in paise
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {}
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      ...order,
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
