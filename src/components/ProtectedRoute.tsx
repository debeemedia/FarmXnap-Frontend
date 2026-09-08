import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "../routes";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../constants/auth";

export function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles?: UserRole[];
}) {
  const { token, userRole } = useAuth();

  if (!token) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  // If user is logged in but has the wrong role for this route, kick them out to their own dashboard
  if (userRole && allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to={
          userRole === UserRole.AGRODEALER
            ? APP_ROUTES.AGRODEALER_DASHBOARD
            : APP_ROUTES.FARMER_DASHBOARD
        }
        replace
      />
    );
  }

  return <Outlet />;
}
