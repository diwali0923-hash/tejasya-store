import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/notify/sale
 * Sends a push notification via ntfy.sh when a new order is placed.
 *
 * Env vars needed:
 *   NTFY_TOPIC -- your unique ntfy.sh topic (e.g. tejasya-orders-8867)
 */

interface SaleNotification {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
}

function formatMessage(data: SaleNotification): string {
  const itemLines = data.items
    .map((item) => `  • ${item.productName} x${item.quantity} = ₹${item.price * item.quantity}`)
    .join('\n');

  const address = data.shippingAddress
    ? `${data.shippingAddress.city || '?'}, ${data.shippingAddress.state || '?'} - ${data.shippingAddress.pincode || '?'}`
    : 'Pending from Razorpay';

  return [
    `NEW SALE on Tejasya!`,
    ``,
    `Order: ${data.orderId}`,
    `Customer: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Payment: ${data.paymentMethod}`,
    ``,
    `Items:`,
    itemLines,
    ``,
    `Total: Rs ${data.totalAmount}`,
    `Ship to: ${address}`,
    ``,
    `Dashboard: https://www.tejasya.store/admin`
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const data: SaleNotification = await req.json();
    const message = formatMessage(data);

    const ntfyTopic = process.env.NTFY_TOPIC;

    if (!ntfyTopic) {
      return NextResponse.json(
        { success: false, error: 'NTFY_TOPIC not configured' },
        { status: 500 }
      );
    }

    const ntfyRes = await fetch(`https://ntfy.sh/${ntfyTopic}`, {
      method: 'POST',
      headers: {
        'Title': `New Sale: ${data.orderId} - Rs ${data.totalAmount}`,
        'Priority': '5',
        'Tags': 'moneybag,tada',
        'Click': 'https://www.tejasya.store/admin'
      },
      body: message
    });

    if (ntfyRes.ok) {
      return NextResponse.json({ success: true, channel: 'ntfy' });
    } else {
      return NextResponse.json(
        { success: false, error: `ntfy returned ${ntfyRes.status}` },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error('Notification error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
