import { authApiEndpoint, DOMAIN } from "./config.js";

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
    throw new Error(errorData.error || "Invalid credentials");
  }

  const token = await response.text();
  if (!token) {
    throw new Error("No token received");
  }

  const cleanToken = token.trim().replace(/^"|"$/g, "");
  localStorage.setItem(TOKEN_KEY, cleanToken);
  const userData = await getUserData(); 
  localStorage.setItem("username", userData.login);
  localStorage.setItem("userId", userData.id);

  // Dispatch auth change event
  window.dispatchEvent(new Event("authChange"));

  return cleanToken;
}

async function getUserData() {
  const res = await fetch(`https://${DOMAIN}/api/graphql-engine/v1/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
    body: JSON.stringify({
      query: `
        {
          user {
            id
            login
          }
        }
      `,
    }),
  });

  const data = await res.json();

  if (!data.data || !data.data.user || data.data.user.length === 0) {
    console.error("GraphQL error:", data);
    throw new Error("Failed to fetch user data");
  }

  return data.data.user[0];
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  
  window.dispatchEvent(new Event("authChange"));
}

export function isAuthenticated() {
  return !!getToken();
}