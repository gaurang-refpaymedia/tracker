import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contextApi/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return children;
  }
  
  return null;
};

export default ProtectedRoute;
