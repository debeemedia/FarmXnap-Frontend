import { Link } from "react-router";
import { APP_ROUTES } from "../routes";
import { PlantIcon, StoreIcon, ArrowLeftIcon } from "./Icons";
import styles from "./RoleSelection.module.css";

export function RoleSelection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Join FarmXnap</h1>
        <p className={styles.subtitle}>Select your account type to continue</p>
      </div>

      <div className={styles.grid}>
        {/* Farmer Option */}
        <Link to={APP_ROUTES.SIGNUP_FARMER} className={styles.card}>
          <div className={styles.iconWrapper}>
            <PlantIcon className={styles.icon} />
          </div>
          <h2 className={styles.roleTitle}>I am a Farmer</h2>
          <p className={styles.roleDescription}>
            Snap a photo of a sick crop, get instant AI diagnosis, and order
            treatment from verified agrodealers.
          </p>
        </Link>

        {/* Agrodealer Option */}
        <Link to={APP_ROUTES.SIGNUP_AGRODEALER} className={styles.card}>
          <div className={styles.iconWrapper}>
            <StoreIcon className={styles.icon} />
          </div>
          <h2 className={styles.roleTitle}>I am an Agrodealer</h2>
          <p className={styles.roleDescription}>
            List agricultural inputs, manage orders and get paid.
          </p>
        </Link>
      </div>

      <Link to={APP_ROUTES.HOME} className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
