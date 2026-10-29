/**
 * Meta Pixel (Facebook Pixel) helper for tracking e-commerce events.
 *
 * Events tracked:
 * - PageView (automatic via base pixel)
 * - ViewContent (product page)
 * - AddToCart (add to cart action)
 * - InitiateCheckout (checkout page load)
 * - Purchase (after successful payment)
 *
 * Pixel ID is hardcoded in layout.tsx base script.
 * These helpers fire standard events after the base script has loaded.
 */

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

function fbq(...args: any[]) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
}

export function trackViewContent(params: {
  contentName: string;
  contentId: string;
  contentType: string;
  value: number;
  currency?: string;
}) {
  fbq('track', 'ViewContent', {
    content_name: params.contentName,
    content_ids: [params.contentId],
    content_type: params.contentType,
    value: params.value,
    currency: params.currency || 'INR'
  });
}

export function trackAddToCart(params: {
  contentName: string;
  contentId: string;
  contentType: string;
  value: number;
  currency?: string;
}) {
  fbq('track', 'AddToCart', {
    content_name: params.contentName,
    content_ids: [params.contentId],
    content_type: params.contentType,
    value: params.value,
    currency: params.currency || 'INR'
  });
}

export function trackInitiateCheckout(params: {
  contentIds: string[];
  numItems: number;
  value: number;
  currency?: string;
}) {
  fbq('track', 'InitiateCheckout', {
    content_ids: params.contentIds,
    num_items: params.numItems,
    value: params.value,
    currency: params.currency || 'INR'
  });
}

export function trackPurchase(params: {
  contentIds: string[];
  numItems: number;
  value: number;
  currency?: string;
}) {
  fbq('track', 'Purchase', {
    content_ids: params.contentIds,
    num_items: params.numItems,
    value: params.value,
    currency: params.currency || 'INR'
  });
}


