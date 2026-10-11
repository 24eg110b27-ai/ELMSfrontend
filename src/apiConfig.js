export function buildApiBaseUrl(baseUrl) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  return normalizedBaseUrl.endsWith("/api")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`;
}

export function isPublicAuthRequest(url = "") {
  const pathname = new URL(url, "http://localhost").pathname.replace(/\/$/, "");
  return [
    "/auth/login",
    "/auth/register",
    "/api/auth/login",
    "/api/auth/register"
  ].includes(pathname);
}
