import { useState } from "react";
import { UserInitialization } from "./UserInitialization";
import { RegistrationStep, UserRole } from "../constants/auth";
import { APP_ROUTES } from "../routes";
import styles from "./Auth.module.css";
import { StoreIcon } from "../components/Icons";
import { LocationSelect } from "../components/LocationSelect";
import { Button } from "../components/Button";
import { TransactionPinStep } from "./TransactionPinStep";
import { BankAccountFields } from "../components/BankAccountFields";
import { useRegistrationFlow } from "../hooks/useRegistrationFlow";
import { RegistrationLayout } from "../components/RegistrationLayout";

export function AgroDealerRegistration() {
  const {
    initData,
    step,
    setStep,
    error,
    setError,
    loading,
    formData,
    handleInitSuccess,
    handleChange,
    onStateResetLga,
    isProfileComplete,
    resetPhoneNumber,
    handleFinalSubmit,
  } = useRegistrationFlow({
    initialFormData: {
      otp: "",
      transaction_pin: "",
      business_name: "",
      business_address: "",
      state: "",
      lga: "",
      cac_registration_number: "",
      bank_code: "", // Supply the code that corresponds to the bank name the user selects.
      bank_account_number: "",
    },
    dashboardRoute: APP_ROUTES.AGRODEALER_DASHBOARD,
    linkKey: "create_agro_dealer_profile",
  });

  const [bankAccountName, setBankAccountName] = useState("");

  // Conditionally determine which screen to display
  if (!initData) {
    return (
      <UserInitialization
        onSuccess={handleInitSuccess}
        role={UserRole.AGRODEALER}
      />
    );
  }

  // Display the form for gathering profile data
  if (step === RegistrationStep.PROFILE) {
    return (
      <RegistrationLayout
        subtitle="Register as an agrodealer"
        error={error}
        icon={<StoreIcon className={styles.brandIcon} />}
      >
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

          <Button type="button" variant="text" onClick={resetPhoneNumber}>
            Change Phone Number
          </Button>
        </form>
      </RegistrationLayout>
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
