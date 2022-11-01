import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const PersistLogin = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("token")
  return auth?.token? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
