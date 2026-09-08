import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { APP_ROUTES } from "../routes";

export function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
