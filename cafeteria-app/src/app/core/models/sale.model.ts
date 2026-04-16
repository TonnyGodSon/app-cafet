export interface SaleItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  category: 'dish' | 'drink' | 'dessert';
}

export interface Sale {
  id: string;
  saleCode: string;
  date: Date;
  sellerName: string;
  dishes: SaleItemWithSpecs[];
  drinks: SaleItemWithSpecs[];
  desserts: SaleItemWithSpecs[];
  createdAt: Date;
  status: 'open' | 'closed';
}

export interface SaleItemWithSpecs {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface SaleDisplay extends Sale {
  totalRevenue: number;
}
