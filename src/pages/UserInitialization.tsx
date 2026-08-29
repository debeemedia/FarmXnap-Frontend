import { useState } from "react";
import { apiFetch } from "../services/api";
import { ErrorMessage } from "../components/ErrorMessage";
import { PhoneInput } from "../components/PhoneInput";
import type { ApiLink } from "../types/common";
import styles from "./Auth.module.css";
import { PlantIcon, StoreIcon } from "../components/Icons";
import { UserRole } from "../constants/auth";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../routes";
import { BackLink } from "../components/BackLink";
import { Button } from "../components/Button";

type UserInitializationResponse = {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      phone_number: string;
    };
    OTP: string;
    links: Record<string, ApiLink>;
  };
};

interface UserInitializationProps {
  onSuccess: ({ userId, otp }: { userId: string; otp: string }) => void;
  role: UserRole;
}

export function UserInitialization({
  onSuccess,
  role,
}: UserInitializationProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      return setError("Please enter a valid 10-digit phone number.");
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch<UserInitializationResponse>("/users", {
        method: "POST",
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      if (response.data?.OTP) {
        // Pass the otp and other details up to the parent component
        onSuccess({
          userId: response.data.user.id,
          otp: response.data.OTP,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to request OTP.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const Icon = role === UserRole.FARMER ? PlantIcon : StoreIcon;

  return (
    <div className="pageWrapper">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon className={styles.brandIcon} />
          </div>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>
            Enter your phone number to receive an OTP
          </p>
        </div>

        {error && <ErrorMessage />}

        <form onSubmit={handleRequestOtp} className="form">
          <PhoneInput phoneNumber={phoneNumber} onChange={setPhoneNumber} />

          <Button
            type="submit"
            loading={loading}
            loadingText="Sending OTP..."
            disabled={phoneNumber.length !== 10}
          >
            Continue
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
