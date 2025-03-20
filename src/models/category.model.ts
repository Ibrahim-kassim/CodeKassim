export interface Category {
  _id: string;
  name: string;
  parentCategory: string | null;
  attributes: string[];
  __v?: number;
  message?: string;
}

export interface CategoryResponse {
  message: string;
  category: Category;
}