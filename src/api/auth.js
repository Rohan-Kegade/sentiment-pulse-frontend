import { api, setToken } from "./client";

export async function register({ name, email, password, tenantName }) {
  const data = await api.post("/auth/register", { name, email, password, tenantName });
  setToken(data.token);
  return data;
}

export async function login({ email, password }) {
  const data = await api.post("/auth/login", { email, password });
  setToken(data.token);
  return data;
}

export function logout() {
  setToken(null);
}

export async function fetchMe() {
  return api.get("/auth/me");
}

export async function updateProfile(patch) {
  return api.patch("/auth/me", patch);
}
