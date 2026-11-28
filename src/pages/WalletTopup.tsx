import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import styles from "./WalletTopup.module.css";
import { apiFetch, is4xxApiError } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import type { ApiLink } from "../types/common";

export function WalletTopup() {
  const { data: walletBalanceDetails, error: viewBalanceError } = useQuery({
    queryKey: [QUERY_KEYS.WALLET_BALANCE],
    queryFn: async () => {
      const response = await apiFetch<ViewWalletBalanceResponse>(
        "/wallets/me",
        {
          method: "GET",
          requiresAuth: true,
        },
      );

      return response.data;
    },
    retry: (failureCount, error) => {
      if (is4xxApiError(error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return (
    <section className={styles.container} aria-label="Wallet top up">
      <header className={styles.header}>
        <h2 className={styles.title}>Top Up Wallet</h2>
        <p className={styles.subtitle}>Add funds to your balance</p>
      </header>

      <div className={styles.balanceCard}>
        {viewBalanceError && (
          <ErrorMessage errorMessage={viewBalanceError.message} />
        )}

        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>Available balance</span>
          <strong className={styles.balanceAmount}>
            {walletBalanceDetails
              ? `₦${walletBalanceDetails.available_balance}`
              : "N/A"}
          </strong>
        </div>
        <hr className={styles.divider} />
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabelMuted}>Locked balance</span>
          <span className={styles.balanceAmountMuted}>
            {" "}
            {walletBalanceDetails
              ? `₦${walletBalanceDetails.locked_balance}`
              : "N/A"}
          </span>
        </div>
      </div>

      <div className={styles.amountSection}>
        <label htmlFor="topup-amount" className={styles.label}>
          Amount
        </label>
        <input
          id="topup-amount"
          type="number"
          step="50"
          min="50"
          className={styles.amountInput}
          placeholder="Enter amount"
        />

        <div className={styles.presets} role="group" aria-label="Quick amounts">
          <Button type="button" className={styles.presetBtn}>
            ₦1,000
          </Button>
          <Button type="button" className={styles.presetBtn}>
            ₦2,500
          </Button>
          <Button type="button" className={styles.presetBtn}>
            ₦5,000
          </Button>
          <Button type="button" className={styles.presetBtn}>
            ₦10,000
          </Button>
        </div>
      </div>

      <ErrorMessage errorMessage="error msg here" />
      {/* {initializeTopupError && <ErrorMessage errorMessage={initializeTopupError} />} */}

      <div className={styles.actions}>
        <Button type="button">Continue to Payment</Button>
      </div>
    </section>
  );
}

type ViewWalletBalanceResponse = {
  message: string;
  data: {
    id: string;
    currency: string;
    balance: number;
    locked_balance: number;
    available_balance: number;
    links: Record<string, ApiLink>;
  };
};
