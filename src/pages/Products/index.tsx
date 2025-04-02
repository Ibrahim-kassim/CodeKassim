import React from "react";
import { ROUTES } from "../../constants/routes";
import { Route } from "react-location";
import Products from "./Products";

const route: Route = {
    path: ROUTES.PRODUCTS,
    element: <Products />,
  };
  
  export default route;
