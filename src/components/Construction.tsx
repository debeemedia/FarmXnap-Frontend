import { BackLink } from "./BackLink";
import styles from "./Construction.module.css";
import { SpannerIcon } from "./Icons";

interface ConstructionProps {
  title?: string;
  description?: string;
}

export function Construction({
  title = "Page Under Construction",
  description = "We're currently building this screen. Check back soon!",
}: ConstructionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <SpannerIcon className={styles.icon} />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.actionWrapper}>
          <BackLink />
        </div>
      </div>
    </div>
  );
}
