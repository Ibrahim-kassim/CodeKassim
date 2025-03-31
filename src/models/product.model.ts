import {Category} from './category.model';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  categories: Category[];
  cost: {
    cost: number;
    currency: string;
  }[];
  images: string[];
  isAvailable?: boolean;
  specifications: Map<string, string>;
  __v?: number;
}
