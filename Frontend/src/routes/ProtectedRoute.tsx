// src/routes/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "admin" | "voter"; // optional role restriction
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If not logged in → redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role required but not matched
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow access
  return <>{children}</>;
}