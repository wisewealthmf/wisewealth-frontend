import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import "./LoginAdmin.css";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      const token = data.accessToken || data.access_token;
      if (!token) {
        throw new Error("No access token received");
      }

      // Decode the JWT payload to verify the role before granting access.
      // Full signature verification happens server-side on every request.
      let payload = null;
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        payload = JSON.parse(atob(base64));
      } catch {
        throw new Error("Invalid token format");
      }

      if (!payload?.isAdmin) {
        throw new Error("Access denied: admin privileges required");
      }

      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminToken", token);
      navigate("/admin/home");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin}>
        <h3>Admin Login</h3>

        {error && <p style={{ color: "red", marginBottom: "8px" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginAdmin;
