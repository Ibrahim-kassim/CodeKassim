
import { ROUTES } from "../../constants/routes";
import { Route } from "react-location";
import Overview from "./Overview";



const route: Route = {
  path: ROUTES.OVERVIEW,
  element: <Overview />,
};

export default route;
