// src/routes/AdminRoutes.ts
import React from "react";
import { ROUTES } from "../constants/routes";
import { Navigate } from "react-router-dom";   
import UserLayout from "../layouts/UserLayout/UserLayout";
import Home from "../pages/user/Home/";
import Cart from "../pages/user/Cart/";
import Checkout from "../pages/user/Checkout/";
import Contact from "../pages/user/Contact/";
import Products from "../pages/user/Products/";

export const UserRoutes = {
  path: ROUTES.default,    
  element: React.createElement(UserLayout),
  children: [
    Home,   
    Cart,
    Checkout,
    Contact,
    Products,
    {
      path: "",
      element: React.createElement(Navigate, { to: ROUTES.HOME, replace: true }),
    },  
              
  ],
};
