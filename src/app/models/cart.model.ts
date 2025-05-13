export interface CartItem {
  productId: any; // or use a better type if you have Product interface
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}
