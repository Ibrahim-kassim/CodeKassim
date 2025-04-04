import { Product } from "./product.model";

export interface Perfume extends Product {
  brand: string;
  sizes: {
    size: string;
    price: number;
  }[];
  scent: string;
  gender: "Men" | "Women" | "Unisex";
}
