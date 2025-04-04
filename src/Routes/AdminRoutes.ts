// src/routes/AdminRoutes.ts
import React from "react";
import { ROUTES } from "../constants/routes";
import Overview from "../pages/Overview";
import AdminLayout from "../layouts/AdminLayout";
import { Navigate } from "react-router-dom";   
import Catigories from "../pages/Catigories/";
import Products from "../pages/Products/";
import ContactUs from "../pages/ContactUs";

export const AdminRoutes = {
  path: ROUTES.DASHBOARD,    
  element: React.createElement(AdminLayout),
  children: [
    {
      path: "overview",
      element: React.createElement(Overview)
    },
    {
      path: "categories",
      element: React.createElement(Catigories)
    },
    {
      path: "products",
      element: React.createElement(Products)
    },
    {
      path: "contact",
      element: React.createElement(ContactUs)
    },
    {
      path: "",
      element: React.createElement(Navigate, { to: ROUTES.OVERVIEW, replace: true })
    }
  ]
};
