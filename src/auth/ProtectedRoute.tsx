import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { Role } from "../types";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles = [], children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = user.roles.some((role: Role) =>
    allowedRoles.includes(role)
  );

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
