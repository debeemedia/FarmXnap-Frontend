import { Link } from "react-router-dom";
import { LogoutIcon } from "../Icons";
import styles from "./LayoutControls.module.css";
import { useAuth } from "../../hooks/useAuth";

// 1. Desktop / Sidebar Logout
export function LogoutButton({ className = "" }: { className?: string }) {
    
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={logout}
      className={`${styles.logoutBtn} ${className}`.trim()}
    >
      <LogoutIcon />
      <span>Logout</span>
    </button>
  );
}

// 2. Banner Dismiss
export function DismissButton({
  onDismiss,
  className = "",
}: {
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      className={`${styles.dismissBtn} ${className}`.trim()}
      aria-label="Dismiss banner"
    >
      ✕
    </button>
  );
}

// 3. Header Top Up Link
export function TopUpButton({
  to,
  className = "",
}: {
  to: string;
  className?: string;
}) {
  return (
    <Link to={to} className={`${styles.topUpBtn} ${className}`.trim()}>
      Top Up
    </Link>
  );
}