"use strict";

const params = new URLSearchParams(window.location.search);
const requestedReturn = params.get("return") || "/";
let destination = new URL("/", window.location.origin);

try {
  const candidate = new URL(requestedReturn, window.location.origin);
  if (candidate.origin === window.location.origin) destination = candidate;
} catch {
  destination = new URL("/", window.location.origin);
}

destination.searchParams.set("_siteUpdated", String(Date.now()));
window.location.replace(destination.href);
