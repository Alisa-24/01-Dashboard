import { DOMAIN } from "./config";
import { getToken, logout } from "./auth";

export async function graphqlRequest(query, variables = {}) {
  const token = getToken();

  if (!token) {
    window.location.href = "/login";
    throw new Error("Not authenticated (missing token).");
  }

  const response = await fetch(
    `https://${DOMAIN}/api/graphql-engine/v1/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  const json = await response.json();

  if (json.errors) {
    console.error(json.errors);
    logout();
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json.data;
}
