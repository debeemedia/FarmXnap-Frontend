import { SpannerIcon } from "./Icons";
import { BackLink } from "./BackLink";
import styles from "./Construction.module.css";
import { Button } from "./Button";

interface ConstructionProps {
  title?: string;
  description?: string;
  successMessage?: string | null;
  onLogout?: () => void;
}

export function Construction({
  title = "Page Under Construction",
  description = "We're currently building this screen. Check back soon!",
  successMessage,
  onLogout,
}: ConstructionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Render Success Banner inside the card if present */}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <div className={styles.iconWrapper}>
          <SpannerIcon className={styles.icon} />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.actionWrapper}>
          {/* Render Logout Button if onLogout is provided */}
          {onLogout && (
            <Button type="button" variant="primary" onClick={onLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
