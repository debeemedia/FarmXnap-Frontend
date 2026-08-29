import { Link } from "react-router";
import styles from "./Home.module.css";
import { APP_ROUTES } from "../routes";
import { PlantIcon } from "../components/Icons";

export function Home() {
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
          <Link to={APP_ROUTES.SELECT_ROLE} className={styles.btnPrimary}>
            Get Started
          </Link>

          {/* Navigates directly to login */}
          <Link to={APP_ROUTES.LOGIN} className={styles.btnSecondary}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
