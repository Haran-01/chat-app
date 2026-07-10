import { API_BASE_URL, getJsonHeaders } from "./api";

export const registerUser = async (authBody) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(authBody),
  });

  const data = await response.json();
  return { response, data };
};

export const loginUser = async (authBody) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(authBody),
  });

  const data = await response.json();
  return { response, data };
};
