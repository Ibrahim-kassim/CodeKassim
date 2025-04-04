// src/routes/Routes.tsx
import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import UserLayout from "../layouts/UserLayout/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// Lazy load components
const Home = React.lazy(() => import("../pages/user/Home/Home"));
const Contact = React.lazy(() => import("../pages/user/Contact/Contact"));
const About = React.lazy(() => import("../pages/user/About/About"));
const Cart = React.lazy(() => import("../pages/user/Cart"));
const Checkout = React.lazy(() => import("../pages/user/Checkout"));
const Products = React.lazy(() => import("../pages/user/Products"));
const Login = React.lazy(() => import("../pages/LoginPage/Login"));

// Admin components
const Overview = React.lazy(() => import("../pages/Overview/Overview"));
const AdminProducts = React.lazy(() => import("../pages/Products/Products"));
const Catigories = React.lazy(() => import("../pages/Catigories/Catigories"));
const ContactUs = React.lazy(() => import("../pages/ContactUs/ContactUs"));

const LoadingFallback = () => <div>Loading...</div>;

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CART}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CHECKOUT}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Checkout />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.CONTACT}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.PRODUCTS}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.ABOUT}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <About />
            </Suspense>
          }
        />
      </Route>

      {/* Auth Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        }
      />

      {/* Admin Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="overview"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Overview />
            </Suspense>
          }
        />
        <Route
          path="categories"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Catigories />
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AdminProducts />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ContactUs />
            </Suspense>
          }
        />
        <Route
          index
          element={<Navigate to="overview" replace />}
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
