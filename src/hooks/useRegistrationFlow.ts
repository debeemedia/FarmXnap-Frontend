import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RegistrationStep, STORAGE_KEYS } from "../constants/auth";
import type {
  ProfileRegistrationResponse,
  UserInitializationResponse,
} from "../types/auth";
import type { APP_ROUTES } from "../routes";
import { apiFetch } from "../services/api";

interface UseRegistrationFlowOptions {
  initialFormData: Record<string, string>;
  linkKey: "create_farmer_profile" | "create_agro_dealer_profile";
  dashboardRoute:
    | typeof APP_ROUTES.FARMER_DASHBOARD
    | typeof APP_ROUTES.AGRODEALER_DASHBOARD;
}

export function useRegistrationFlow({
  initialFormData,
  linkKey,
  dashboardRoute,
}: UseRegistrationFlowOptions) {
  const navigate = useNavigate();

  const [initData, setInitData] = useState<
    UserInitializationResponse["data"] | null
  >(null);
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.PROFILE);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleInitSuccess = (data: UserInitializationResponse["data"]) => {
    setInitData(data);

    setFormData((previousState) => ({
      ...previousState,
      // Autofill OTP from response (Demo for now)
      otp: data.OTP || "",
    }));
  };

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

  const resetPhoneNumber = () => {
    (setInitData(null), setError(null));
  };

  const handleFinalSubmit = async () => {
    if (!initData?.OTP) {
      return setError("Please enter the OTP.");
    }

    const registrationLink = initData.links[linkKey];

    if (!registrationLink) {
      setError(
        "Registration endpoint not provided by server. Please try requesting OTP again.",
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch<ProfileRegistrationResponse>(
        registrationLink.href,
        {
          method: registrationLink.method,
          body: JSON.stringify(formData),
        },
      );

      // Handle auth storage and navigation on success
      localStorage.setItem(STORAGE_KEYS.FARMXNAP_TOKEN, response.data.token);

      navigate(dashboardRoute, {
        // Persist display of the success message on the redirected page. Ensure to handle "successMessage" on the page with e.g useLocation
        state: { successMessage: response.message },
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return {
    initData,
    setInitData,
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
  };
}
