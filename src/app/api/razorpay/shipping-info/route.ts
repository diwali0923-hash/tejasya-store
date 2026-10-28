import { NextResponse } from 'next/server';

/**
 * POST /api/razorpay/shipping-info
 *
 * Razorpay Magic Checkout calls this endpoint to fetch shipping serviceability,
 * COD availability, shipping fees, and COD fees for a customer's address.
 *
 * Since Tejasya uses Meesho fulfillment (free shipping pan-India),
 * we return free shipping + COD available for all Indian pincodes.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const addresses = body.addresses || [];

    const responseAddresses = addresses.map((addr: { id: string; zipcode: string; state_code?: string; country: string }) => ({
      id: addr.id,
      zipcode: addr.zipcode,
      state_code: addr.state_code || '',
      country: addr.country || 'IN',
      shipping_methods: [
        {
          id: '1',
          name: 'Free Express Delivery (3-5 days)',
          description: 'Dispatches within 24 hours in shatter-proof packaging. Delivered before Diwali.',
          serviceable: true,
          shipping_fee: 0,
          cod: true,
          cod_fee: 0
        }
      ]
    }));

    return NextResponse.json({ addresses: responseAddresses });
  } catch (err: unknown) {
    console.error('Shipping info API error:', err);
    return NextResponse.json(
      { error: (err as Error)?.message || 'Failed to process shipping info' },
      { status: 500 }
    );
  }
}
