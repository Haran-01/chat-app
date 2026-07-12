export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getJsonHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? getAuthHeaders(token) : {}),
});
