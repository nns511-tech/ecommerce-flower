export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
}

export interface CartItem extends Product {
    quantity: number;
    greetingCardMessage?: string;
}