// src/routes/Routes.tsx

import { Routes, Route } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";


import { UserRoutes } from "./UserRoutes";
import { AuthRoutes } from "./AuthRoutes";

const renderRoutes = (route: any) => (
  <Route path={route.path} element={route.element}>
    {route.children?.map((child: any, index: number) => (
      <Route key={index} path={child.path} element={child.element} />
    ))}
  </Route>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Render User Routes by default */}
      {renderRoutes(UserRoutes)}

      {/* 🔒 Render Admin Routes (Protected) */}
      {renderRoutes(AdminRoutes)}

      {/* 🔒 Render Auth Routes (Protected) */}
      {renderRoutes(AuthRoutes)}

    </Routes>
  );
}
