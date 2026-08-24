import { Link } from "react-router";
import styles from "./Home.module.css";
import { APP_ROUTES } from "../routes";

export function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.brand}>FarmXnap</h1>
      <p className={styles.tagline}>
        AI-powered crop health diagnostics & marketplace for farmers and
        agrodealers.
      </p>

      <div className={styles.actionGroup}>
        {/* Navigates to role selection before signing up */}
        <Link to={APP_ROUTES.SELECT_ROLE} className={styles.btnPrimary}>
          Get Started (Sign Up)
        </Link>

        {/* Navigates directly to login */}
        <Link to={APP_ROUTES.LOGIN} className={styles.btnSecondary}>
          I already have an account (Log In)
        </Link>
      </div>
    </div>
  );
}
