import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(
      `Acceso denegado. Rol ${user.role} no permitido para esta ruta.`
    );
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
