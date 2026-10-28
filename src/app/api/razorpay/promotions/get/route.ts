import { NextResponse } from 'next/server';

/**
 * POST /api/razorpay/promotions/get
 *
 * Razorpay Magic Checkout calls this to fetch available promotions/coupons
 * to display inside the checkout modal.
 */
export async function POST() {
  return NextResponse.json({
    promotions: [
      {
        code: 'SHUBH300',
        summary: '₹300 off on orders above ₹999',
        description: 'Festive special — flat ₹300 off on a minimum cart value of ₹999. Auto-applied at checkout.'
      },
      {
        code: 'DIWALI10',
        summary: '10% off on total cart value',
        description: 'Celebrate Diwali with 10% off on your entire order. No minimum cart value.'
      }
    ]
  });
}
