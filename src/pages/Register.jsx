import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password
      });

      setSuccess(
        typeof response.data === "string"
          ? response.data
          : "Registration successful. You can now sign in."
      );
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to create your account. Please check your details and try again."
        );
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
          <div className="brand-mark">E</div>

          <div className="brand-content">
            <p className="eyebrow">EMPLOYEE LEAVE MANAGEMENT</p>
            <h1>
              Employee Leave
              <span>Management.</span>
            </h1>
            <p className="brand-description">
              A modern workspace for employees and managers to manage leave
              requests, approvals and schedules in one place.
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

        <section className="register-panel">
          <div className="login-card register-card">
            <div className="mobile-logo">
              <div className="brand-mark">L</div>
              <span>ELMS</span>
            </div>

            <div className="login-heading">
              <p className="welcome">GET STARTED</p>
              <h2>Create your account</h2>
              <p>Register as an employee to start managing your leave.</p>
            </div>

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="register-username">Username</label>
                <div className="input-wrapper">
                  <UserRound size={18} />
                  <input
                    id="register-username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    minLength={3}
                    maxLength={50}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-email">Email</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-password">Password</label>
                <div className="input-wrapper">
                  <LockKeyhole size={18} />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    maxLength={100}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>
                <div className="input-wrapper">
                  <LockKeyhole size={18} />
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    minLength={6}
                    maxLength={100}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="register-success" role="status">
                  {success}
                </div>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Creating account..." : "Create account"}</span>
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/">Sign in</Link>
            </p>

            <div className="security-note">
              <span className="security-dot"></span>
              Secure access protected by ELMS authentication
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
