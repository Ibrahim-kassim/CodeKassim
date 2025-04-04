export enum ENTITIES {
  // User Management
  USERS = 'users',
  LOGIN = 'login',
  REGISTER = 'register',

  // Contact Us
  ALL_CONTACTS = 'contacts/all',
  ADD_CONTACT = 'contacts/add',
  ONE_CONTACT = 'contacts/phone/:phone',
  DELETE_CONTACT = 'contacts',
  UPDATE_CONTACT = 'contacts',
  READ_MESSAGE = 'contacts/:contactId/messages/:messageIndex/status',
  DELETE_MESSAGE = 'contacts/:contactId/messages/:messageIndex',

  // Product Management
  ALL_PRODUCTS = 'products/allProducts',
  PRODUCTS_OF_CATEGORY = 'products/:ID',
  CREATE_PRODUCT = 'products/createProduct',
  DELETE_PRODUCT = 'products/deleteProduct',
  UPDATE_PRODUCT = 'products/updateProduct',
  FIND_PRODUCT_BY_NAME = 'products/getProductByName',
  CHANGE_PRODUCT_DESCRIPTION = 'products/changeProductDescription',
  CHANGE_PRODUCT_AVAILABILITY = 'products/changeProductAvailability',
  EDIT_PRODUCT_NAME = 'products/editProductName',

  // Category
  CATEGORIES = 'categories',
  ALL_CATEGORIES = 'categories/allCategories',
  ADD_CATEGORY = 'categories/addCategory',
  DELETE_CATEGORY = 'categories/deleteCategory',
  UPDATE_CATEGORY = 'categories/editCategory',

  // Order Management
  ORDERS = 'orders',
  CART = 'cart',

  // Reviews and Ratings
  REVIEWS = 'reviews',

  // Search and Filters
  SEARCH = 'search',
  FILTER = 'filter',
}
