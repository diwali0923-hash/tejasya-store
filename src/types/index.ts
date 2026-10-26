export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: 'bundle' | 'candles' | 'diyas';
  price: number;
  originalPrice: number;
  discountPercentage: number;
  piecesCount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
  description: string;
  packageDetails: {
    contents: string[];
    packagingNotice: string;
    dispatchTime: string;
    transitAssurance: string;
  };
  meeshoMapping: {
    sku: string;
    url: string;
    cost: number;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  pincode: string;
  houseFlatBuilding: string;
  roadAreaColony: string;
  landmark?: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: CustomerAddress;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    meeshoSkus: string[];
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'ONLINE_TEST';
  paymentStatus: 'pending' | 'completed';
  fulfillmentStatus: 'unfulfilled' | 'ordered_on_meesho' | 'dispatched' | 'delivered';
  meeshoOrderIds?: string;
  notes?: string;
  createdAt: string;
}
