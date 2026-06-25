const BASE = "/api";

export function getToken() {
  return localStorage.getItem("sp-token");
}

export function setToken(t) {
  if (t) localStorage.setItem("sp-token", t);
  else   localStorage.removeItem("sp-token");
}

async function request(method, path, body) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.error || (data.errors?.[0]?.msg) || `Request failed (${res.status})`;
    const err  = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  put:    (path, body)  => request("PUT",    path, body),
  patch:  (path, body)  => request("PATCH",  path, body),
  delete: (path)        => request("DELETE", path),
};
