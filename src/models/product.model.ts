export interface Product {
  _id?: string;
  name: string;
  description: string;
  prices: {
    size?: string;
    color?: string;
    price: number;
  }[];
  categories: string[];
  images: string[];
  isAvailable?: boolean;
}
