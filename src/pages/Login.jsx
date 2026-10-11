import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await api.post("/auth/login", {
        username: username.trim(),
        password
      });

      const {
        token,
        role,
        username: loggedInUsername
      } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", loggedInUsername);
      localStorage.setItem("role", role);

      window.location.href =
  role === "MANAGER" ? "/manager" : "/dashboard";

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (err.response?.status === 403) {
        setError("Sign in was forbidden. Please refresh and try again.");
      } else if (err.response?.status === 400) {
        setError("Please enter a valid username and password.");
      } else if (err.response) {
        setError("Sign in is temporarily unavailable. Please try again later.");
      } else {
        setError("Unable to connect to the server");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="login-shell">

        <section className="brand-panel">

          <div className="brand-mark">
            E
          </div>

          <div className="brand-content">

            <p className="eyebrow">
              EMPLOYEE LEAVE MANAGEMENT
            </p>

            <h1>
              Employee Leave 
              <span>Management.</span>
            </h1>

            <p className="brand-description">
              A modern workspace for employees and managers to
              manage leave requests, approvals and schedules in one place.
            </p>

            <div className="brand-features">

              <div>
                <strong>01</strong>
                <span>Simple leave applications</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Fast manager approvals</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Clear leave tracking</span>
              </div>

            </div>

          </div>

          <div className="brand-footer">
            <span>ELMS</span>
            <span>Employee Leave Management System</span>
          </div>

        </section>

        <section className="login-panel">

          <div className="login-card">

            <div className="mobile-logo">

              <div className="brand-mark">
                L
              </div>

              <span>ELMS</span>

            </div>

            <div className="login-heading">

              <p className="welcome">
                WELCOME BACK
              </p>

              <h2>
                Sign in to ELMS
              </h2>

              <p>
                Enter your credentials to access your workspace.
              </p>

            </div>

            <form onSubmit={handleLogin}>

              <div className="input-group">

                <label>
                  Username or email
                </label>

                <div className="input-wrapper">

                  <Mail size={18} />

                  <input
                    type="text"
                    placeholder="Username or email"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="input-group">

                <div className="password-label">

                  <label>
                    Password
                  </label>

                  <button type="button">
                    Forgot password?
                  </button>

                </div>

                <div className="input-wrapper">

                  <LockKeyhole size={18} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </span>

                {!loading && (
                  <ArrowRight size={19} />
                )}

              </button>

            </form>

            <p className="auth-switch">
              New to ELMS? <Link to="/register">Create an account</Link>
            </p>

            <div className="security-note">

              <span className="security-dot"></span>

              Secure access protected by
              ELMS authentication

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Login;