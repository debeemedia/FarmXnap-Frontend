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
