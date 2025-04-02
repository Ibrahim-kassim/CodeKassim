import React from 'react';
import { ROUTES } from '../../constants/routes';
import { Route } from 'react-location';
import Login from './Login';

const route: Route = {
  path: ROUTES.LOGIN,
  element: <Login />,
};

export default route;
