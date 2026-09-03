import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";
import { Link } from "react-router-dom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  loading?: boolean;
  loadingText?: string;
  linkTo?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  loadingText = "Please wait...",
  disabled,
  children,
  className = "",
  linkTo,
  ...props
}: ButtonProps) {
  const variantClass = styles[variant] || styles.primary;
  const combinedClass = `${styles.btn} ${variantClass} ${className}`.trim();

  return linkTo ? (
    <Link to={linkTo} className={combinedClass}>
      {children}
    </Link>
  ) : (
    <button className={combinedClass} disabled={disabled || loading} {...props}>
      {loading ? loadingText : children}
    </button>
  );
}
