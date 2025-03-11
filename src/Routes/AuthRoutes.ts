// src/routes/AdminRoutes.ts
import React from "react";
import { ROUTES } from "../constants/routes";

import { Navigate } from "react-router-dom";   
import Login from "../pages/LoginPage/";
import GuestLayout from "../layouts/GuestLayout";

export const AuthRoutes = {
  path: ROUTES.Auth,      // "/dashboard"
  element: React.createElement(GuestLayout),
    // ✅ Correct JSX usage
  children: [
    Login,
    {
      path: "",
      element: React.createElement(Navigate, { to: ROUTES.LOGIN, replace: true }),
    },  
              
  ],
};
