export type PaymentMethod = 'CB' | 'PayPal' | 'Wero' | 'Espèces' | 'Mixte';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  category: 'dish' | 'drink' | 'dessert';
}

export interface Order {
  id: string;
  saleCode: string;
  customerFirstName: string;
  sellerName?: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  totalPrice: number;
  createdAt: Date;
}

export interface OrderSummary {
  items: OrderItem[];
  subTotal: number;
  total: number;
  paymentMethod: PaymentMethod | null;
  isValid: boolean;
}
