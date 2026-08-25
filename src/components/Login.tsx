import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { APP_ROUTES } from "../routes";
import { ArrowLeftIcon, PlantIcon } from "./Icons";
import styles from "./Login.module.css";
import { LoginStep, STORAGE_KEYS, UserRole } from "../constants/auth";

// API Response Types matching the backend specs
type ApiLink = {
  method: string;
  href: string;
};

type LoginRequestResponse = {
  message: string;
  data: {
    OTP: string;
    links: Record<string, ApiLink>;
  };
};

type LoginVerifyResponse = {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      role: UserRole;
      phone_number: string;
    };
  };
};

export function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>(LoginStep.REQUEST);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Store the login verification link dynamically
  const [verifyLink, setVerifyLink] = useState<ApiLink | null>(null);

  // Strip non-numeric characters & enforce 10-digit limit
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setPhoneNumber(digitsOnly);
    }
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      return setError("Please enter a valid 10-digit phone number.");
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch<LoginRequestResponse>(
        "/auth/login_request",
        {
          method: "POST",
          body: JSON.stringify({ phone_number: phoneNumber }),
        },
      );

      // Autofill OTP from response (Demo for now)
      if (response.data?.OTP) {
        setOtp(response.data.OTP);
      }

      // Extract HATEOAS link for the login OTP verification step
      const nextLink = response.data?.links?.verify_login;
      if (nextLink) {
        setVerifyLink(nextLink);
      }

      setStep(LoginStep.VERIFY);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to request OTP.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp) {
      return setError("Please enter the OTP.");
    }

    if (!verifyLink) {
      setError(
        "Verification endpoint not provided by server. Please try requesting OTP again.",
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch<LoginVerifyResponse>(verifyLink.href, {
        method: verifyLink.method,
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp: otp,
        }),
      });

      // Persist access token
      localStorage.setItem(STORAGE_KEYS.FARMXNAP_TOKEN, response.data.token);

      // Redirect user to dashboard depending on role
      const role = response.data.user.role;

      if (role === UserRole.FARMER) {
        navigate(APP_ROUTES.FARMER_DASHBOARD);
      } else if (role === UserRole.AGRODEALER) {
        navigate(APP_ROUTES.AGRODEALER_DASHBOARD);
      } else {
        navigate(APP_ROUTES.HOME);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid OTP.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageWrapper">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <PlantIcon className={styles.brandIcon} />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            {step === LoginStep.REQUEST
              ? "Enter your phone number to receive an OTP"
              : `Enter the code sent to +234 ${phoneNumber}`}
          </p>
        </div>

        {error && <div className="errorMessage">{error}</div>}

        {step === LoginStep.REQUEST ? (
          /* Login Request (Step 1) Form */
          <form onSubmit={handleRequestOtp} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number
              </label>
              <div className={styles.phoneInputWrapper}>
                <span className={styles.prefix}>+234</span>
                <input
                  id="phoneNumber"
                  type="tel"
                  className={styles.phoneInput}
                  placeholder="8012345678"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading || phoneNumber.length !== 10}
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        ) : (
          /* Login Verification (Step 2) Form */
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="otp" className={styles.label}>
                One-Time Password (OTP)
              </label>
              <input
                id="otp"
                type="text"
                className={styles.input}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Log In"}
            </button>

            <button
              type="button"
              className={styles.btnText}
              onClick={() => {
                setStep(LoginStep.REQUEST);
                setError(null);
              }}
            >
              Change Phone Number
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <p className={styles.signupPrompt}>
            Don't have an account?{" "}
            <Link to={APP_ROUTES.SELECT_ROLE} className={styles.link}>
              Sign Up
            </Link>
          </p>

          <Link to={APP_ROUTES.HOME} className={styles.backLink}>
            <ArrowLeftIcon className={styles.backIcon} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
