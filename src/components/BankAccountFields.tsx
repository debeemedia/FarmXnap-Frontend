import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { sanitizeNumericInput } from "../utils/helpers";

interface BankAccountFieldsProps {
  selectedBankCode: string;
  bankAccountNumber: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onBankAccountVerified: (accountName: string) => void;
}

type Bank = {
  id: number;
  name: string;
  code: string;
  // Other fields returned by the backend not needed
};

type ListBanksResponse = {
  data: Array<Bank>;
};

type VerifyBankAccountResponse = {
  data: {
    account_name: string;
    account_number: string;
  };
};

export function BankAccountFields({
  onChange,
  selectedBankCode,
  bankAccountNumber,
  onBankAccountVerified,
}: BankAccountFieldsProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankAccountName, setBankAccountName] = useState("");
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [verifyingBankAccount, setVerifyingBankAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => {
      let isMounted = true;

      (async () => {
        setLoadingBanks(true);
        setError(null);

        try {
          const response = await apiFetch<ListBanksResponse>("/banks", {
            method: "GET",
          });

          if (isMounted) {
            setBanks(response.data);
          }
        } catch (error) {
          if (isMounted) {
            setError(
              error instanceof Error ? error.message : "Failed to list banks.",
            );
          }
        } finally {
          if (isMounted) {
            setLoadingBanks(false);
          }
        }
      })();

      return () => {
        isMounted = false;
      };
    },
    [] /** Run only once when the component mounts */,
  );

  useEffect(
    () => {
      let isMounted = true;

      if (!selectedBankCode || bankAccountNumber.length !== 10) {
        setBankAccountName("");
        onBankAccountVerified("");
        return;
      }

      (async () => {
        try {
          setVerifyingBankAccount(true);
          setError(null);

          const response = await apiFetch<VerifyBankAccountResponse>(
            "/banks/verify",
            {
              method: "POST",
              body: JSON.stringify({
                bank_code: selectedBankCode,
                bank_account_number: bankAccountNumber,
              }),
            },
          );

          if (isMounted) {
            const verifiedAccountName = response.data.account_name;
            setBankAccountName(verifiedAccountName);
            onBankAccountVerified(verifiedAccountName);
          }
        } catch (error) {
          if (isMounted) {
            setBankAccountName("");
            onBankAccountVerified("");
            setError(
              error instanceof Error ? error.message : "Failed to verify bank.",
            );
          }
        } finally {
          if (isMounted) {
            setVerifyingBankAccount(false);
          }
        }
      })();

      return () => {
        isMounted = false;
      };
    },
    [
      selectedBankCode,
      bankAccountNumber,
    ] /** Run anytime any time the bank code or account number changes */,
  );

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.target.value = sanitizeNumericInput(e.target.value, 10);
    onChange(e);
  };

  return (
    <div className="inputGroup">
      {error && <p className="errorText">{error}</p>}

      <label htmlFor="bankCode" className="label">
        Bank
      </label>
      <select
        id="bankCode"
        name="bank_code"
        className="input"
        value={selectedBankCode}
        onChange={onChange}
        disabled={loadingBanks}
      >
        <option value="">
          {loadingBanks ? "Loading banks..." : "Select Bank"}
        </option>
        {(banks ?? []).map((bank) => (
          <option key={bank.id} value={bank.code}>
            {bank.name}
          </option>
        ))}
      </select>

      <label htmlFor="bankAccountNumber" className="label">
        Bank Account Number
      </label>
      <input
        id="bankAccountNumber"
        name="bank_account_number"
        type="text"
        className="input"
        placeholder="0022290533"
        value={bankAccountNumber}
        onChange={handleAccountNumberChange}
      />

      {/* For the user's visual feedback */}
      <label htmlFor="bankAccountName" className="label">
        Bank Account Name
      </label>
      <input
        id="bankAccountName"
        type="text"
        className="input"
        value={bankAccountName}
        disabled
        placeholder={verifyingBankAccount ? "Verifying..." : ""}
      />
    </div>
  );
}
