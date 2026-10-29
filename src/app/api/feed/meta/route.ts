import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';

const SITE_URL = 'https://www.tejasya.store';

/**
 * Meta Product Catalogue Feed (CSV)
 * Spec: https://www.facebook.com/business/help/120325381656392
 *
 * GET /api/feed/meta
 * Returns CSV with all required + recommended columns for Meta Commerce Manager.
 */
export async function GET() {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'sale_price',
    'link',
    'image_link',
    'additional_image_link',
    'brand',
    'google_product_category',
    'fb_product_category',
    'quantity_to_sell_on_facebook',
    'sale_price_effective_date',
    'item_group_id',
    'gender',
    'age_group',
    'material',
    'custom_label_0',
    'custom_label_1'
  ];

  const rows = PRODUCTS.map((p) => {
    const mainImage = `${SITE_URL}${p.images[0]}`;
    const additionalImages = p.images
      .slice(1)
      .map((img) => `${SITE_URL}${img}`)
      .join(',');

    // Meta requires price in "AMOUNT CURRENCY" format
    const originalPrice = `${p.originalPrice}.00 INR`;
    const salePrice = `${p.price}.00 INR`;

    // Sale runs until Diwali week ends
    const saleDateRange = '2026-10-20T00:00:00+05:30/2026-11-05T23:59:59+05:30';

    // Short description (max 5000 chars for Meta)
    const description = p.description.slice(0, 1000).replace(/"/g, '""');
    const title = p.name.replace(/"/g, '""');

    // Category mapping
    let category = 'Home & Garden > Decor > Candles & Candle Holders';
    let fbCategory = 'home > home decor > candles & holders';
    if (p.category === 'diyas') {
      category = 'Home & Garden > Decor > Candles & Candle Holders';
      fbCategory = 'home > home decor > candles & holders';
    } else if (p.category === 'bundle' || p.category === 'combo') {
      category = 'Home & Garden > Decor > Candles & Candle Holders';
      fbCategory = 'home > home decor > candles & holders';
    }

    return [
      p.id,
      `"${title}"`,
      `"${description}"`,
      'in stock',
      'new',
      originalPrice,
      salePrice,
      `${SITE_URL}/product/${p.slug}`,
      mainImage,
      additionalImages,
      'Tejasya',
      `"${category}"`,
      `"${fbCategory}"`,
      100,
      saleDateRange,
      p.category,
      'unisex',
      'adult',
      p.category === 'diyas' ? 'Clay' : p.category === 'candles' ? 'Glass' : 'Mixed',
      p.category,
      `${p.piecesCount} pieces`
    ].join('\t');
  });

  const csv = [headers.join('\t'), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/tab-separated-values; charset=utf-8',
      'Content-Disposition': 'inline; filename="tejasya-meta-feed.tsv"',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
