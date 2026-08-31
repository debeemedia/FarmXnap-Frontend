import React, { useState } from "react";
import { UserInitialization } from "./UserInitialization";
import { RegistrationStep, STORAGE_KEYS, UserRole } from "../constants/auth";
import { apiFetch } from "../services/api";
import type { ApiLink } from "../types/common";
import type { UserInitializationResponse } from "../types/auth";
import { PlantIcon } from "../components/Icons";
import { ErrorMessage } from "../components/ErrorMessage";
import styles from "./Auth.module.css";
import { Button } from "../components/Button";
import { BackLink } from "../components/BackLink";
import { Link, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../routes";
import { LocationSelect } from "../components/LocationSelect";
import { TransactionPinStep } from "./TransactionPinStep";

type FarmerRegistrationResponse = {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      role: UserRole;
    };
    links: Record<string, ApiLink>;
  };
};

export function FarmerRegistration() {
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
    first_name: "",
    last_name: "",
    state: "",
    lga: "",
    address: "",
    primary_crop: "",
  });

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
        role={UserRole.FARMER}
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

    const farmerRegistrationLink = initData.links.create_farmer_profile;

    if (!farmerRegistrationLink) {
      setError(
        "Farmer registration endpoint not provided by server. Please try requesting OTP again.",
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch<FarmerRegistrationResponse>(
        farmerRegistrationLink.href,
        {
          method: farmerRegistrationLink.method,
          body: JSON.stringify(formData),
        },
      );

      // Handle auth storage and navigation on success
      localStorage.setItem(STORAGE_KEYS.FARMXNAP_TOKEN, response.data.token);

      navigate(APP_ROUTES.FARMER_DASHBOARD, {
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
              <PlantIcon className={styles.brandIcon} />
            </div>
            <h1 className={styles.title}>Sign Up</h1>
            <p className={styles.subtitle}>Register as a farmer</p>
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
              <label htmlFor="firstName" className="label">
                First Name
              </label>
              <input
                id="firstName"
                name="first_name"
                type="text"
                className="input"
                placeholder="Emeka"
                value={formData.first_name}
                onChange={handleChange}
              />

              <label htmlFor="lastName" className="label">
                Last Name
              </label>
              <input
                id="lastName"
                name="last_name"
                type="text"
                className="input"
                placeholder="Okafor"
                value={formData.last_name}
                onChange={handleChange}
              />

              <label htmlFor="address" className="label">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="input"
                placeholder="1, Broad Street"
                value={formData.address}
                onChange={handleChange}
              />

              <LocationSelect
                selectedState={formData.state}
                selectedLga={formData.lga}
                onChange={handleChange}
                onStateResetLga={onStateResetLga}
              />

              <label htmlFor="primaryCrop" className="label">
                Primary Crop
              </label>
              <input
                id="primaryCrop"
                name="primary_crop"
                type="text"
                className="input"
                placeholder="Maize"
                value={formData.primary_crop}
                onChange={handleChange}
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
              // Disable if any of the profile fields is not populated
              disabled={!isProfileComplete}
            >
              Next
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
