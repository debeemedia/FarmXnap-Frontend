import { states, lgas } from "nigerian-states-and-lgas";
import type React from "react";
import { useMemo } from "react";

interface LocationSelectProps {
  selectedState: string;
  selectedLga: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStateResetLga: () => void;
}

export function LocationSelect({
  selectedState,
  selectedLga,
  onChange,
  onStateResetLga,
}: LocationSelectProps) {
  const allStates = states();

  // Runs only when selectedState changes
  const lgasForState = useMemo(() => {
    return selectedState ? lgas(selectedState) || [] : [];
  }, [selectedState]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    onStateResetLga(); // IMPORTANT: Clear the existing lga value immediately to prevent submission of a previous state's lga for a new state.
  };

  return (
    <div className="inputGroup">
      <label htmlFor="state" className="label">
        State
      </label>
      <select
        id="state"
        name="state"
        className="input"
        value={selectedState}
        onChange={handleStateChange}
      >
        <option value="">Select State</option>
        {allStates.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <label htmlFor="lga" className="label">
        LGA
      </label>
      <select
        id="lga"
        name="lga"
        className="input"
        value={selectedLga}
        onChange={onChange}
        disabled={!selectedState}
      >
        <option value="">Select LGA</option>
        {lgasForState.map((lga) => (
          <option key={lga} value={lga}>
            {lga}
          </option>
        ))}
      </select>
    </div>
  );
}
