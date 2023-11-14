import { Outlet, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "./components/AppContext";

const PrivateRoutes = () => {
  let { user, test } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
