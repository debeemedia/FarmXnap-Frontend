import { Link } from "react-router-dom";
import styles from "./BackLink.module.css";
import { ArrowLeftIcon } from "./Icons";
import { APP_ROUTES } from "../routes";

export function BackLink() {
  return (
    <Link to={APP_ROUTES.HOME} className={styles.backLink}>
      <ArrowLeftIcon className={styles.backIcon} />
      <span>Back to Home</span>
    </Link>
  );
}
