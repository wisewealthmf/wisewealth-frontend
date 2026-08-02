import { Navigate } from "react-router-dom";

/**
 * Decodes the JWT payload (no signature verification — that's the server's job).
 * Returns null if the token is missing or malformed.
 */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("adminToken");
  const payload = token ? decodeJwtPayload(token) : null;

  // Require both the session flag AND a valid ADMIN role claim in the token.
  const isAdmin =
    sessionStorage.getItem("adminLoggedIn") === "true" &&
    payload?.isAdmin === true;

  return isAdmin ? children : <Navigate to="/admin" />;
}

export default ProtectedRoute;
