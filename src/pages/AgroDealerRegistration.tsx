import React, { useState } from "react";
import type {
  ProfileRegistrationResponse,
  UserInitializationResponse,
} from "../types/auth";
import { UserInitialization } from "./UserInitialization";
import { RegistrationStep, STORAGE_KEYS, UserRole } from "../constants/auth";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { APP_ROUTES } from "../routes";
import styles from "./Auth.module.css";
import { StoreIcon } from "../components/Icons";
import { ErrorMessage } from "../components/ErrorMessage";
import { LocationSelect } from "../components/LocationSelect";
import { Button } from "../components/Button";
import { BackLink } from "../components/BackLink";
import { TransactionPinStep } from "./TransactionPinStep";
import { BankAccountFields } from "../components/BankAccountFields";

export function AgroDealerRegistration() {
  const navigate = useNavigate();

  const [initData, setInitData] = useState<
    UserInitializationResponse["data"] | null
  >(null);
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.PROFILE);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    otp: "",
    transaction_pin: "",
    business_name: "",
    business_address: "",
    state: "",
    lga: "",
    cac_registration_number: "",
    bank_code: "", // Supply the code that corresponds to the bank name the user selects.
    bank_account_number: "",
  });

  const [bankAccountName, setBankAccountName] = useState("");

  // Conditionally determine which screen to display
  if (!initData) {
    return (
      <UserInitialization
        onSuccess={(data) => {
          setInitData(data);

          setFormData((previousState) => ({
            ...previousState,
            // Autofill OTP from response (Demo for now)
            otp: data.OTP || "",
          }));
        }}
        role={UserRole.AGRODEALER}
      />
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((previousState) => ({
      ...previousState,
      [name]: value, // Dynamically update the matching key in formData. NB: Ensure that the `name` attribute for the inputs matches the corresponding formData key.
    }));
  };

  const onStateResetLga = () => {
    setFormData((previousState) => ({
      ...previousState,
      lga: "",
    }));
  };

  const isProfileComplete = Object.entries(formData)
    .filter(([key]) => key !== "transaction_pin")
    .every(([_, value]) =>
      typeof value === "string" ? value.trim() !== "" : Boolean(value),
    );

  const handleFinalSubmit = async () => {
    if (!initData.OTP) {
      return setError("Please enter the OTP.");
    }

    const agroDealerRegistrationLink =
      initData.links.create_agro_dealer_profile;

    if (!agroDealerRegistrationLink) {
      setError(
        "AgroDealer registration endpoint not provided by server. Please try requesting OTP again.",
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch<ProfileRegistrationResponse>(
        agroDealerRegistrationLink.href,
        {
          method: agroDealerRegistrationLink.method,
          body: JSON.stringify(formData),
        },
      );

      // Handle auth storage and navigation on success
      localStorage.setItem(STORAGE_KEYS.FARMXNAP_TOKEN, response.data.token);

      navigate(APP_ROUTES.AGRODEALER_DASHBOARD, {
        // Persist display of the success message on the redirected page. Ensure to handle "successMessage" on the page with e.g useLocation
        state: { successMessage: response.message },
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  // Display the form for gathering profile data
  if (step === RegistrationStep.PROFILE) {
    return (
      <div className="pageWrapper">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <StoreIcon className={styles.brandIcon} />
            </div>
            <h1 className={styles.title}>Sign Up</h1>
            <p className={styles.subtitle}>Register as an agrodealer</p>
          </div>
          {error && <ErrorMessage errorMessage={error} />}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Set the next step
              setStep(RegistrationStep.TRANSACTION_PIN);
            }}
            className="form"
          >
            <div className="inputGroup">
              <label htmlFor="businessName" className="label">
                Business Name
              </label>
              <input
                id="businessName"
                name="business_name"
                type="text"
                className="input"
                placeholder="EMOK Enterprises"
                value={formData.business_name}
                onChange={handleChange}
              />

              <label htmlFor="businessAddress" className="label">
                Business Address
              </label>
              <input
                id="businessAddress"
                name="business_address"
                type="text"
                className="input"
                placeholder="1, Broad Street"
                value={formData.business_address}
                onChange={handleChange}
              />

              <LocationSelect
                selectedState={formData.state}
                selectedLga={formData.lga}
                onChange={handleChange}
                onStateResetLga={onStateResetLga}
              />

              <label htmlFor="cacRegistrationNumber" className="label">
                CAC Registration Number
              </label>
              <input
                id="address"
                name="cac_registration_number"
                type="text"
                className="input"
                placeholder="RC 1234567"
                value={formData.cac_registration_number}
                onChange={handleChange}
              />

              <BankAccountFields
                onChange={handleChange}
                selectedBankCode={formData.bank_code}
                bankAccountNumber={formData.bank_account_number}
                onBankAccountVerified={setBankAccountName}
              />

              <label htmlFor="otp" className="label">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                className="input"
                readOnly
                value={formData.otp}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              // Disable if any of the profile fields is not populated or if the bank account is not verified
              disabled={!isProfileComplete || !bankAccountName}
            >
              Next
            </Button>

            <Button
              type="button"
              variant="text"
              onClick={() => {
                setInitData(null);
                setError(null);
              }}
            >
              Change Phone Number
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
  } else {
    // Display the screen for setting transaction pin
    return (
      <TransactionPinStep
        pinValue={formData.transaction_pin}
        onChange={handleChange}
        onSubmit={handleFinalSubmit}
        onBack={() => {
          setError(null);
          setStep(RegistrationStep.PROFILE);
        }}
        loading={loading}
      />
    );
  }
}
