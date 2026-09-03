import { STORAGE_KEYS } from "../constants/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;

type RequestOptions = RequestInit & {
  requiresAuth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { requiresAuth = false, headers, ...restOptions } = options;

  // 1. Construct Request Headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // 2. Attach Opaque Access Token (OAT) if required
  if (requiresAuth) {
    const token = localStorage.getItem(STORAGE_KEYS.FARMXNAP_TOKEN);
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // 4. Perform request
  const response = await fetch(
    // If path is from HATEOAS links (which are already prefixed)
    path.startsWith(API_PREFIX)
      ? `${BASE_URL}${path}`
      : // If endpoint paths
        `${BASE_URL}${API_PREFIX}${path}`,
    {
      ...restOptions,
      headers: requestHeaders,
    },
  );

  // 4. Handle HTTP Errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Auto-clear auth token on 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.FARMXNAP_TOKEN);
      /**
       * @todo: Add global redirect logic
       */
    }

    const errorMessage =
      errorData.error || errorData.errors?.[0] || "An error occurred";
    throw new Error(errorMessage);
  }

  // 5. Parse and return JSON
  return response.json() as Promise<T>;
}
