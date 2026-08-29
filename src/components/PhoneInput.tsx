import styles from "./PhoneInput.module.css";

interface PhoneInputProps {
  phoneNumber: string;
  onChange: (value: string) => void; // Receives `setPhoneNumber`
}

export function PhoneInput({ phoneNumber, onChange }: PhoneInputProps) {
  // Strip non-numeric characters & enforce 10-digit limit
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      onChange(digitsOnly);
    }
  };

  return (
    <div className="inputGroup">
      <label htmlFor="phoneNumber" className="label">
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
  );
}
