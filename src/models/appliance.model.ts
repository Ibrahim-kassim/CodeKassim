import { Product } from "./product.model";

export interface Appliance extends Product {
  brand: string;
  rooms: string[];
  powerConsumption: string;
  sizes: {
    size: string;
    price: number;
  }[];
  color: string[];
  capacity: string;
  code: string;
}
