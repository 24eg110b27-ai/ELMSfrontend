import assert from "node:assert/strict";
import test from "node:test";

import { buildApiBaseUrl, isPublicAuthRequest } from "./apiConfig.js";

test("buildApiBaseUrl preserves the API prefix without trailing slashes", () => {
  assert.equal(
    buildApiBaseUrl("https://backend.example.com/api/"),
    "https://backend.example.com/api"
  );
});

test("buildApiBaseUrl adds the API prefix to backend origins", () => {
  assert.equal(
    buildApiBaseUrl("https://backend.example.com/"),
    "https://backend.example.com/api"
  );
});

test("auth endpoints are public and other API endpoints are protected", () => {
  assert.equal(isPublicAuthRequest("/auth/login"), true);
  assert.equal(isPublicAuthRequest("/auth/register"), true);
  assert.equal(isPublicAuthRequest("/api/auth/login"), true);
  assert.equal(isPublicAuthRequest("https://backend.example.com/api/auth/register"), true);
  assert.equal(isPublicAuthRequest("/employee/leaves"), false);
});
