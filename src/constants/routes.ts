export const ROUTES = {
  // User Routes
  HOME: "/",
  CONTACT: "/contact",
  ABOUT: "/about",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  LOGIN: "/login",
  
  // Admin Routes
  DASHBOARD: "/admin",
  OVERVIEW: "/admin/overview",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CONTACT: "/admin/contact",
  
  default: "/",
} as const;