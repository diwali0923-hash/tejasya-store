import { Order } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_ORDERS_KEY = 'tejasya_orders_store';

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrder(order: Order) {
  if (typeof window === 'undefined') return;
  try {
    const orders = getLocalOrders();
    orders.unshift(order);
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

export async function saveOrder(order: Order): Promise<{ success: boolean; error?: string }> {
  // Always save locally so local test checkout is fast & visible
  saveLocalOrder(order);

  // If Supabase is configured, also persist to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error: orderError } = await supabase.from('orders').insert({
        id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail || null,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping_fee: order.shippingFee,
        total_amount: order.totalAmount,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        fulfillment_status: order.fulfillmentStatus,
        meesho_order_ids: order.meeshoOrderIds || null,
        notes: order.notes || null,
        created_at: order.createdAt
      });

      if (orderError) throw orderError;

      // Insert address
      const { error: addrError } = await supabase.from('order_addresses').insert({
        order_id: order.id,
        full_name: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        alternate_phone: order.shippingAddress.alternatePhone || null,
        pincode: order.shippingAddress.pincode,
        house_flat_building: order.shippingAddress.houseFlatBuilding,
        road_area_colony: order.shippingAddress.roadAreaColony,
        landmark: order.shippingAddress.landmark || null,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state
      });

      if (addrError) throw addrError;

      // Insert line items
      const itemsPayload = order.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: item.price,
        meesho_skus: item.meeshoSkus
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
      if (itemsError) throw itemsError;

      return { success: true };
    } catch (err: unknown) {
      console.warn('Supabase save failed, stored in local storage:', err);
      return { success: true, error: (err as Error)?.message };
    }
  }

  return { success: true };
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbOrders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_addresses (*),
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (dbOrders && dbOrders.length > 0) {
        return dbOrders.map((row) => ({
          id: row.id,
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          customerEmail: row.customer_email,
          subtotal: Number(row.subtotal),
          discount: Number(row.discount),
          shippingFee: Number(row.shipping_fee),
          totalAmount: Number(row.total_amount),
          paymentMethod: row.payment_method,
          paymentStatus: row.payment_status,
          fulfillmentStatus: row.fulfillment_status,
          meeshoOrderIds: row.meesho_order_ids,
          notes: row.notes,
          createdAt: row.created_at,
          shippingAddress: row.order_addresses?.[0]
            ? {
                fullName: row.order_addresses[0].full_name,
                phone: row.order_addresses[0].phone,
                alternatePhone: row.order_addresses[0].alternate_phone,
                pincode: row.order_addresses[0].pincode,
                houseFlatBuilding: row.order_addresses[0].house_flat_building,
                roadAreaColony: row.order_addresses[0].road_area_colony,
                landmark: row.order_addresses[0].landmark,
                city: row.order_addresses[0].city,
                state: row.order_addresses[0].state
              }
            : {
                fullName: row.customer_name,
                phone: row.customer_phone,
                pincode: '',
                houseFlatBuilding: '',
                roadAreaColony: '',
                city: '',
                state: ''
              },
          items: (row.order_items || []).map((i: any) => ({
            productId: i.product_id,
            productName: i.product_name,
            quantity: i.quantity,
            price: Number(i.price),
            meeshoSkus: i.meesho_skus || []
          }))
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase, falling back to local storage', err);
    }
  }

  return getLocalOrders();
}

export async function updateFulfillmentStatus(
  orderId: string,
  status: Order['fulfillmentStatus'],
  meeshoOrderId?: string
): Promise<boolean> {
  // Update local storage
  if (typeof window !== 'undefined') {
    const orders = getLocalOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          fulfillmentStatus: status,
          meeshoOrderIds: meeshoOrderId || o.meeshoOrderIds
        };
      }
      return o;
    });
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  }

  // Update Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: any = { fulfillment_status: status };
      if (meeshoOrderId) payload.meesho_order_ids = meeshoOrderId;
      await supabase.from('orders').update(payload).eq('id', orderId);
    } catch (err) {
      console.error('Failed to update order status in Supabase', err);
    }
  }

  return true;
}
