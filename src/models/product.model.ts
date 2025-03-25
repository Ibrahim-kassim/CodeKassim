export interface Product {
  _id?: string;
  name: string;
  description: string;
  categories: string[];
  images: string[];
  isAvailable?: boolean;
  specifications: Map<string, string>;
}
