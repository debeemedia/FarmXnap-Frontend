import type React from "react";
import styles from "../pages/Auth.module.css";
import { ErrorMessage } from "./ErrorMessage";
import { Link } from "react-router-dom";
import { BackLink } from "./BackLink";
import { APP_ROUTES } from "../routes";

interface RegistrationLayoutProps {
  icon: React.ReactNode;
  subtitle: string;
  error: string | null;
  children: React.ReactNode;
}

export function RegistrationLayout({
  icon,
  subtitle,
  error,
  children,
}: RegistrationLayoutProps) {
  return (
    <div className="pageWrapper">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>{icon}</div>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {error && <ErrorMessage errorMessage={error} />}

        {children}

        <div className={styles.footer}>
          <p className={styles.authPrompt}>
            Already have an account?{" "}
            <Link to={APP_ROUTES.LOGIN} className={styles.link}>
              Login
            </Link>
          </p>

          <BackLink />
        </div>
      </div>
    </div>
  );
}
