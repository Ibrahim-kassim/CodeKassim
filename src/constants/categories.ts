export interface Category {
  title: string;
  items: {
    name: string;
    path: string;
  }[];
}

export const productCategories: Category[] = [
  {
    title: "Electronics",
    items: [
      { name: "Phones & Tablets", path: "/category/phones" },
      { name: "Computers", path: "/category/computers" },
      { name: "Accessories", path: "/category/accessories" },
      { name: "Gaming", path: "/category/gaming" }
    ]
  },
  {
    title: "Fashion",
    items: [
      { name: "Men's Wear", path: "/category/men" },
      { name: "Women's Wear", path: "/category/women" },
      { name: "Kids", path: "/category/kids" },
      { name: "Shoes", path: "/category/shoes" }
    ]
  },
  {
    title: "Home & Garden",
    items: [
      { name: "Furniture", path: "/category/furniture" },
      { name: "Kitchen", path: "/category/kitchen" },
      { name: "Home Decor", path: "/category/decor" },
      { name: "Garden", path: "/category/garden" }
    ]
  },
  {
    title: "Sports",
    items: [
      { name: "Fitness", path: "/category/fitness" },
      { name: "Outdoor", path: "/category/outdoor" },
      { name: "Equipment", path: "/category/equipment" },
      { name: "Sports Clothing", path: "/category/clothing" }
    ]
  }
];
