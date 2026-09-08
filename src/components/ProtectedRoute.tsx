import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "../routes";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
