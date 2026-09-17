export const APP_ROUTES = {
  HOME: "/",
  SELECT_ROLE: "/select-role",
  SIGNUP_FARMER: "/signup/farmer",
  SIGNUP_AGRODEALER: "/signup/agrodealer",
  LOGIN: "/login",

  FARMER_DASHBOARD: {
    ROOT: "/farmer/dashboard",
    DIAGNOSIS: "/farmer/dashboard", // Default dashboard view is Crop Diagnosis
    WALLET: "/farmer/dashboard/wallet",
    TRANSACTIONS: "/farmer/dashboard/transactions",
    PROFILE: "/farmer/dashboard/profile",
  },

  AGRODEALER_DASHBOARD: { ROOT: "/agrodealer/dashboard" },
} as const;
