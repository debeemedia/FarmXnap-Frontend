import { useState } from "react";
import { UserInitialization } from "./UserInitialization";
import { UserRole } from "../constants/auth";

export function FarmerRegistration() {
  const [initData, setInitData] = useState<{
    userId: string;
    otp: string;
  } | null>(null);

  // Conditionally determine which screen to display
  if (!initData) {
    return (
      <UserInitialization
        onSuccess={({ userId, otp }) => {
          setInitData({ userId, otp });
        }}
        role={UserRole.FARMER}
      />
    );
  }

  // todo
  return (
    <div>
      <p>Farmer profile form</p>
      <p>otp {initData.otp}</p>
      <p>userid {initData.userId}</p>
    </div>
  );
}
