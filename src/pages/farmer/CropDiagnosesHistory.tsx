import { SpannerIcon } from "../../components/Icons";
import styles from "./CropDiagnosesHistory.module.css";

export function CropDiagnosesHistory() {
  return (
    <section className={styles.historySection}>
      <h2 className={styles.historyTitle}>Recent Diagnoses & History</h2>

      {/* TODO: Replace with dynamic history items once endpoint is integrated */}
      <div className={styles.emptyState}>
        <div className={styles.emptyIconCircle}>
          <SpannerIcon className={styles.emptyIcon} />
        </div>
        <p className={styles.emptyText}>Scan history under construction</p>
        <span className={styles.emptySubtext}>
          Your recent crop diagnoses and treatments will appear here soon.
        </span>
      </div>
    </section>
  );
}