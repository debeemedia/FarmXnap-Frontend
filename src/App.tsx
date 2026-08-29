import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { RoleSelection } from "./pages/RoleSelection";
import { APP_ROUTES } from "./routes";
import { Login } from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing screen */}
        <Route path={APP_ROUTES.HOME} element={<Home />} />

        {/* Role selection screen */}
        <Route path={APP_ROUTES.SELECT_ROLE} element={<RoleSelection />} />

        {/* Placeholders for signup forms */}
        <Route
          path={APP_ROUTES.SIGNUP_FARMER}
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Farmer Signup Form
            </div>
          }
        />
        <Route
          path={APP_ROUTES.SIGNUP_AGRODEALER}
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Agrodealer Signup Form
            </div>
          }
        />

        {/* Login screen */}
        <Route path={APP_ROUTES.LOGIN} element={<Login />} />

        {/* Placeholders for dashboards */}
        <Route
          path={APP_ROUTES.FARMER_DASHBOARD}
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Farmer Dashboard
            </div>
          }
        />
        <Route
          path={APP_ROUTES.AGRODEALER_DASHBOARD}
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Agrodealer Dashboard
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
