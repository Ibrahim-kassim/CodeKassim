export interface Category {
  _id?: string;
  name: string;
  parentCategory: string | null;
  attributes: string[];
  __v?: number;
  message?: string;
}