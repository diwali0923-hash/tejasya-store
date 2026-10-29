import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/notify/sale
 * Sends a WhatsApp notification (via CallMeBot) + push notification (via ntfy.sh)
 * when a new order is placed.
 *
 * Env vars needed:
 *   CALLMEBOT_API_KEY  -- get from https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *   NOTIFY_PHONE       -- your WhatsApp number with country code, no spaces (e.g. 918867222640)
 *   NTFY_TOPIC         -- a unique topic name for ntfy.sh push notifications (e.g. tejasya-orders)
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
    `🔔 NEW SALE on Tejasya!`,
    ``,
    `Order: ${data.orderId}`,
    `Customer: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Payment: ${data.paymentMethod}`,
    ``,
    `Items:`,
    itemLines,
    ``,
    `Total: ₹${data.totalAmount}`,
    `Ship to: ${address}`,
    ``,
    `Dashboard: https://www.tejasya.store/admin`
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const data: SaleNotification = await req.json();
    const message = formatMessage(data);

    const results: string[] = [];

    // 1. WhatsApp via CallMeBot
    const apiKey = process.env.CALLMEBOT_API_KEY;
    const phone = process.env.NOTIFY_PHONE;

    if (apiKey && phone) {
      try {
        const encoded = encodeURIComponent(message);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`;
        const waRes = await fetch(url, { method: 'GET' });
        if (waRes.ok) {
          results.push('whatsapp: sent');
        } else {
          results.push(`whatsapp: failed (${waRes.status})`);
        }
      } catch (waErr: any) {
        results.push(`whatsapp: error (${waErr.message})`);
      }
    } else {
      results.push('whatsapp: skipped (no API key or phone configured)');
    }

    // 2. Push notification via ntfy.sh (free, no signup)
    const ntfyTopic = process.env.NTFY_TOPIC;

    if (ntfyTopic) {
      try {
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
          results.push('ntfy: sent');
        } else {
          results.push(`ntfy: failed (${ntfyRes.status})`);
        }
      } catch (ntfyErr: any) {
        results.push(`ntfy: error (${ntfyErr.message})`);
      }
    } else {
      results.push('ntfy: skipped (no topic configured)');
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('Notification error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
