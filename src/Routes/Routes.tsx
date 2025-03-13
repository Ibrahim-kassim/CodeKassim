// src/routes/Routes.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";
import { UserRoutes } from "./UserRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { ProtectedRoute } from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound/NotFound";

const renderRoutes = (route: any, isProtected: boolean = false) => (
  <Route 
    path={route.path} 
    element={isProtected ? (
      <ProtectedRoute>{route.element}</ProtectedRoute>
    ) : route.element}
  >
    {route.children?.map((child: any, index: number) => (
      <Route 
        key={index} 
        path={child.path} 
        element={isProtected ? (
          <ProtectedRoute>{child.element}</ProtectedRoute>
        ) : child.element} 
      />
    ))}
  </Route>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Render User Routes by default */}
      {renderRoutes(UserRoutes)}

      {/* Render Admin Routes (Protected) */}
      {renderRoutes(AdminRoutes, true)}

      {/* Render Auth Routes (Public) */}
      {renderRoutes(AuthRoutes)}

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
