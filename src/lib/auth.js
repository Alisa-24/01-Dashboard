import { authApiEndpoint } from "./config.js";

const TOKEN_KEY = "token";

export async function Auth(identifier, password) {
  if (!identifier || !password) {
    throw new Error("Identifier and password are required");
  }

  const credentials = btoa(`${identifier}:${password}`);

  const response = await fetch(authApiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Invalid credentials");
  }

  const token = await response.text();
  if (!token) {
    throw new Error("No token received");
  }

  const cleanToken = token.trim().replace(/^"|"$/g, "");
  localStorage.setItem(TOKEN_KEY, cleanToken);
  return cleanToken;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
