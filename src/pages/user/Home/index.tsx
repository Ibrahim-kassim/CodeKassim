import React from "react";
import { ROUTES } from "../../../constants/routes";
import Home from "./Home";

const route = {
  path: ROUTES.HOME,
  element: React.createElement(Home),
};

export default route;
