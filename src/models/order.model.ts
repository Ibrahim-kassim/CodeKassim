import { Product } from "./product.model";

export interface Order {
    _id?: string;
    clientName: string;
    clientPhone: string;
    products: Product[];
    location: string;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    __v?: number;
}