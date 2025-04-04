// src/routes/UserRoutes.ts
import React, { lazy } from "react";
import { ROUTES } from "../constants/routes";
import { Navigate } from "react-router-dom";   
import UserLayout from "../layouts/UserLayout/UserLayout";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Products from "../pages/user/Products";

const LazyHome = lazy(() => import("../pages/user/Home/Home"));
const LazyContact = lazy(() => import("../pages/user/Contact/Contact"));
const LazyAbout = lazy(() => import("../pages/user/About/About"));

export const UserRoutes = {
  path: "/",
  element: React.createElement(UserLayout),
  children: [
    {
      path: ROUTES.HOME,
      element: React.createElement(LazyHome)
    },
    {
      path: ROUTES.CART,
      element: React.createElement(Cart)
    },
    {
      path: ROUTES.CHECKOUT,
      element: React.createElement(Checkout)
    },
    {
      path: ROUTES.CONTACT,
      element: React.createElement(LazyContact)
    },
    {
      path: ROUTES.PRODUCTS,
      element: React.createElement(Products)
    },
    {
      path: ROUTES.ABOUT,
      element: React.createElement(LazyAbout)
    },
    {
      path: "*",
      element: React.createElement(Navigate, { to: ROUTES.HOME, replace: true })
    }
  ]
};
