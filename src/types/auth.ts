import type { UserRole } from "../constants/auth";
import type { ApiLink } from "./common";

export type UserInitializationResponse = {
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

export type ProfileRegistrationResponse = {
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
