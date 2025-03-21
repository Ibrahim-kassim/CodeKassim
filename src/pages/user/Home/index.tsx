import React from "react";
import { Route } from "react-location";
import { ROUTES } from "../../../constants/routes";
import Home from "./Home";

const route: Route = {
  path: ROUTES.HOME,
  element: <Home />,
};

export default route;
