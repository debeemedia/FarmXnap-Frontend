import styles from "./Home.module.css";
import { APP_ROUTES } from "../routes";
import { PlantIcon } from "../components/Icons";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { UserRole } from "../constants/auth";

export function Home() {
  const { token, userRole } = useAuth();

  if (token && userRole) {
    return (
      <Navigate
        to={
          userRole === UserRole.AGRODEALER
            ? APP_ROUTES.AGRODEALER_DASHBOARD
            : APP_ROUTES.FARMER_DASHBOARD
        }
      />
    );
  }

  return (
    <div className="pageWrapper">
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <PlantIcon className={styles.brandIcon} />
        </div>

        <h1 className={styles.brand}>FarmXnap</h1>

        <p className={styles.tagline}>
          Instant crop disease diagnosis and marketplace for farmers and
          agrodealers.
        </p>

        <div className={styles.actionGroup}>
          {/* Navigates to role selection before signing up */}
          <Button linkTo={APP_ROUTES.SELECT_ROLE}>Get Started</Button>

          {/* Navigates directly to login */}
          <Button linkTo={APP_ROUTES.LOGIN} variant="secondary">
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
