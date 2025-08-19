import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contextApi/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useContext(AuthContext); // make sure loading is in context
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!isLoggedIn || !user) {
    // redirect to login but keep track of where user was
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
