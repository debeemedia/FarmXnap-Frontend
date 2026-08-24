import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./components/Home";
import { RoleSelection } from "./components/RoleSelection";
import { APP_ROUTES } from "./routes";

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

        {/* Placeholder for login screen */}
        <Route
          path={APP_ROUTES.LOGIN}
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Login Screen
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
