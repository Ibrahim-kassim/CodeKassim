import { Product } from "./product.model";

export interface Perfume extends Product {
  brand: string;
  sizes: {
    size: string;
    price: number;
    currency: string;
  }[];
  scent: string;
  gender: "Men" | "Women" | "Unisex";
}
