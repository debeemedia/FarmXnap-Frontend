import { UserInitialization } from "./UserInitialization";
import { RegistrationStep, UserRole } from "../constants/auth";
import { PlantIcon } from "../components/Icons";
import styles from "./Auth.module.css";
import { Button } from "../components/Button";
import { APP_ROUTES } from "../routes";
import { LocationSelect } from "../components/LocationSelect";
import { TransactionPinStep } from "./TransactionPinStep";
import { useRegistrationFlow } from "../hooks/useRegistrationFlow";
import { RegistrationLayout } from "../components/RegistrationLayout";

export function FarmerRegistration() {
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
      first_name: "",
      last_name: "",
      state: "",
      lga: "",
      address: "",
      primary_crop: "",
    },
    dashboardRoute: APP_ROUTES.FARMER_DASHBOARD,
    linkKey: "create_farmer_profile",
  });

  // Conditionally determine which screen to display
  if (!initData) {
    return (
      <UserInitialization
        onSuccess={handleInitSuccess}
        role={UserRole.FARMER}
      />
    );
  }

  // Display the form for gathering profile data
  if (step === RegistrationStep.PROFILE) {
    return (
      <RegistrationLayout
        subtitle="Register as a farmer"
        error={error}
        icon={<PlantIcon className={styles.brandIcon} />}
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
