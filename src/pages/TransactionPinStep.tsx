import { useState } from "react";
import { sanitizeNumericInput } from "../utils/helpers";
import { ErrorMessage } from "../components/ErrorMessage";
import styles from "./Auth.module.css";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../routes";
import { BackLink } from "../components/BackLink";

interface TransactionPinStepProps {
  pinValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export function TransactionPinStep({
  pinValue,
  onChange,
  onSubmit,
  onBack,
  loading,
}: TransactionPinStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [confirmPin, setConfirmPin] = useState("");

  const isValidPin =
    pinValue.length === 4 && confirmPin.length === 4 && pinValue === confirmPin;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = sanitizeNumericInput(e.target.value, 4);
    onChange(e);

    // Clear error if confirm field matches the new pin
    if (confirmPin && e.target.value === confirmPin) {
      setError(null);
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = sanitizeNumericInput(e.target.value, 4);
    setConfirmPin(e.target.value);

    if (e.target.value && e.target.value !== pinValue) {
      return setError("Transaction PINs do not match!");
    }

    setError(null);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidPin) {
      onSubmit();
    }
  };

  return (
    <div className="pageWrapper">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Set Transaction PIN</h1>
          <p className={styles.subtitle}>
            Create a 4-digit PIN to authorize transactions.
          </p>
        </div>

        {error && <ErrorMessage errorMessage={error} />}

        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="transactionPin" className="label">
              Transaction Pin
            </label>
            <input
              id="transactionPin"
              name="transaction_pin"
              type="password"
              className="input"
              placeholder="••••"
              value={pinValue}
              onChange={handlePinChange}
              maxLength={4}
              inputMode="numeric"
            />

            <label htmlFor="confirmTransactionPin" className="label">
              Confirm Transaction Pin
            </label>
            <input
              id="confirmTransactionPin"
              type="password"
              className="input"
              placeholder="••••"
              value={confirmPin}
              onChange={handleConfirmPinChange}
              maxLength={4}
              inputMode="numeric"
            />
          </div>

          <Button
            type="button"
            variant="text"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>

          <Button
            type="submit"
            disabled={!isValidPin}
            loading={loading}
            loadingText="Submitting..."
          >
            Submit
          </Button>
        </form>

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
