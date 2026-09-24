/**
 * Sanitizes an input string to contain only digits and truncates it to a maximum length.
 */
export const sanitizeNumericInput = (
  value: string,
  maxLength: number,
): string => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.slice(0, maxLength);
};

/**
 * Format prices (Naira symbol prefix, comma separated, 2 d.p)
 */
export function formatPrice(
  amount: number | string | null | undefined,
): string {
  const numericValue = typeof amount === "string" ? parseFloat(amount) : amount;

  const currencySymbol = "₦";

  if (
    numericValue === null ||
    numericValue === undefined ||
    isNaN(numericValue)
  ) {
    return `${currencySymbol}0.00`;
  }

  const formattedNumber = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);

  return `${currencySymbol}${formattedNumber}`;
}

/**
 * Helper for Backend-Recommended Rank Labelling for Crop Scans
 */
export const getScanMatchLabel = (rank: number) => {
  if (rank > 2.5) {
    return { label: "Best Match (Exact Chemical)", style: "bestMatch" };
  }

  if (rank > 0.5) {
    return { label: "Recommended for this Crop", style: "recommended" };
  }

  return { label: "General Treatment", style: "general" };
};
