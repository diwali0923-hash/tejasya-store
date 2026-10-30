import { NextRequest, NextResponse } from 'next/server';

/**
 * POST & GET /api/razorpay/shipping-info
 *
 * Razorpay Magic Checkout calls this endpoint to fetch shipping serviceability,
 * COD availability, shipping fees, and COD fees for a customer's address.
 *
 * Tejasya uses Meesho fulfillment (free shipping pan-India),
 * so we return free shipping + COD for all Indian pincodes.
 *
 * Handles both GET (query params) and POST (JSON body) since Razorpay
 * docs are ambiguous about the method used.
 */

const SHIPPING_RESPONSE = {
  id: '1',
  name: 'Free Express Delivery (3-5 days)',
  description: 'Dispatches within 24 hours. Delivered before Diwali.',
  serviceable: true,
  shipping_fee: 0,
  cod: true,
  cod_fee: 0
};

function buildResponse(addresses: any[]) {
  // If addresses array is provided, map each one
  if (addresses && addresses.length > 0) {
    return {
      addresses: addresses.map((addr: any) => ({
        id: addr.id || '0',
        zipcode: addr.zipcode || addr.zip || '',
        state_code: addr.state_code || '',
        country: addr.country || 'IN',
        shipping_methods: [SHIPPING_RESPONSE]
      }))
    };
  }

  // Fallback: return a single default address entry
  // This handles cases where Razorpay sends no addresses array
  // or sends the data in an unexpected format
  return {
    addresses: [
      {
        id: '0',
        zipcode: '000000',
        state_code: '',
        country: 'IN',
        shipping_methods: [SHIPPING_RESPONSE]
      }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[shipping-info] POST body:', JSON.stringify(body));

    const addresses = body.addresses || [];
    const response = buildResponse(addresses);

    console.log('[shipping-info] Response:', JSON.stringify(response));
    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error('[shipping-info] POST error:', err);
    // Even on error, return a valid response so COD still shows
    return NextResponse.json(buildResponse([]));
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    console.log('[shipping-info] GET params:', JSON.stringify(params));

    // Build addresses from query params if present
    const addresses = params.zipcode
      ? [{ id: '0', zipcode: params.zipcode, state_code: params.state_code || '', country: params.country || 'IN' }]
      : [];

    const response = buildResponse(addresses);
    console.log('[shipping-info] Response:', JSON.stringify(response));
    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error('[shipping-info] GET error:', err);
    return NextResponse.json(buildResponse([]));
  }
}
