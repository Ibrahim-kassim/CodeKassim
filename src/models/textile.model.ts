import { Product } from "./product.model";

export interface Textile extends Product {
  material: string;
  sizes: {
    size: string;
    price: number;
  }[];
  color: string[];
  brand: string;
  code: string; 
  careInstructions: string;
}
