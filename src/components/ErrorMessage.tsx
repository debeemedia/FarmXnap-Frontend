import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  errorMessage: string;
}

export function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return <div className={styles.errorMessage}>{errorMessage}</div>;
}
