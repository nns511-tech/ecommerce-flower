export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
}

export interface CartItem extends Product {
  quantity: number;
  greetingCard?: string;
}