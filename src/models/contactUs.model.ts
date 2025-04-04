export interface ContactUs {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    messages: {
        text: string;
        isRead: boolean;
        createdAt: string;
      }[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }