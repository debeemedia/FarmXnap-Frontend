export const STORAGE_KEYS = {
  FARMXNAP_TOKEN: "farmxnap_token",
} as const;

export const LoginStep = {
  REQUEST: "REQUEST",
  VERIFY: "VERIFY",
} as const;

export type LoginStep = (typeof LoginStep)[keyof typeof LoginStep];

// User Roles matching the Backend Schema
export const UserRole = {
  FARMER: "farmer",
  AGRODEALER: "agrodealer",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RegistrationStep = {
  PROFILE: "PROFILE",
  TRANSACTION_PIN: "TRANSACTION_PIN",
} as const;

export type RegistrationStep =
  (typeof RegistrationStep)[keyof typeof RegistrationStep];
