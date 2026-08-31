import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { Home } from "./pages/Home";
import { RoleSelection } from "./pages/RoleSelection";
import { APP_ROUTES } from "./routes";
import { Login } from "./pages/Login";
import { FarmerRegistration } from "./pages/FarmerRegistration";
import { UserRole } from "./constants/auth";
import { Construction } from "./components/Construction";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing screen */}
        <Route path={APP_ROUTES.HOME} element={<Home />} />

        {/* Role selection screen */}
        <Route path={APP_ROUTES.SELECT_ROLE} element={<RoleSelection />} />

        <Route
          path={APP_ROUTES.SIGNUP_FARMER}
          element={<FarmerRegistration />}
        />
        {/* Placeholder for Agrodealer signup form */}
        <Route
          path={APP_ROUTES.SIGNUP_AGRODEALER}
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <Construction title="Agrodealer Signup" />
            </div>
          }
        />

        {/* Login screen */}
        <Route path={APP_ROUTES.LOGIN} element={<Login />} />

        {/* Placeholders for dashboards */}
        <Route
          path={APP_ROUTES.FARMER_DASHBOARD}
          element={<ProfileDashboardPlaceholder role={UserRole.FARMER} />}
        />
        <Route
          path={APP_ROUTES.AGRODEALER_DASHBOARD}
          element={<ProfileDashboardPlaceholder role={UserRole.AGRODEALER} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

// Simple temporary component for the placeholder dashboard
function ProfileDashboardPlaceholder({ role }: { role: UserRole }) {
  const location = useLocation();

  // Extract the success message if it exists in location.state
  const successMessage = location.state?.successMessage;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {/* If a success message was passed during navigation, display it */}
      {successMessage && (
        <p style={{ color: "green", marginBottom: "1rem" }}>{successMessage}</p>
      )}
      <Construction
        title={
          (role === UserRole.FARMER ? "Farmer" : "AgroDealer") + " Dashboard"
        }
      />
    </div>
  );
}
