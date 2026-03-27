export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// returnPath: the path to redirect to after login (default: "/")
export const getLoginUrl = (returnPath: string = "/") => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // If OAuth is not configured, return a fallback
  if (!oauthPortalUrl || !appId) {
    return "/login";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  // Encode both the redirectUri and the returnPath in state
  const stateData = JSON.stringify({ redirectUri, returnPath });
  const state = btoa(stateData);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
