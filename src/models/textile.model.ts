import { Product } from "./product.model";

export interface Textile extends Product {
  material: string;
  size: {
    size: string;
    price: number;
    currency: string;
  };
  color: string;
  brand: string;
  careInstructions: string;
}
