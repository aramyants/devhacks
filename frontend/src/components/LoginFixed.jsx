import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginFixed({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 3) {
      errors.password = "Password must be at least 3 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    clearError();

    try {
      console.log("Attempting login with:", { email, password });
      const result = await login(email, password);
      console.log("Login result:", result);

      if (!result.success) {
        console.error("Login failed:", result.error);
      } else {
        console.log("Login successful!");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoLogin = async (demoEmail) => {
    setIsSubmitting(true);
    clearError();
    setEmail(demoEmail);
    setPassword("demo123");

    try {
      console.log("Demo login with:", {
        email: demoEmail,
        password: "demo123",
      });
      const result = await login(demoEmail, "demo123");
      console.log("Demo login result:", result);

      if (!result.success) {
        console.error("Demo login failed:", result.error);
      } else {
        console.log("Demo login successful!");
      }
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-fixed">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon-fixed">🏢</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                className={`auth-input ${validationErrors.email ? "error" : ""}`}
                disabled={loading || isSubmitting}
              />
              <span className="input-icon">📧</span>
            </div>
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                className={`auth-input ${validationErrors.password ? "error" : ""}`}
                disabled={loading || isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || isSubmitting}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {validationErrors.password && (
              <span className="field-error">{validationErrors.password}</span>
            )}
          </div>

          {error && (
            <div className="auth-error-fixed">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn-fixed"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? (
              <>
                <span className="loading-spinner-fixed"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or try demo accounts</span>
        </div>

        <div className="demo-accounts-fixed">
          <button
            type="button"
            className="demo-btn-fixed admin"
            onClick={() => demoLogin("admin@saas.com")}
            disabled={loading || isSubmitting}
          >
            <span className="demo-icon">👑</span>
            <div>
              <div className="demo-title">Admin Demo</div>
              <div className="demo-desc">Full system access</div>
            </div>
          </button>

          <button
            type="button"
            className="demo-btn-fixed owner"
            onClick={() => demoLogin("owner@acme.com")}
            disabled={loading || isSubmitting}
          >
            <span className="demo-icon">🏢</span>
            <div>
              <div className="demo-title">Company Owner</div>
              <div className="demo-desc">Acme Corp</div>
            </div>
          </button>

          <button
            type="button"
            className="demo-btn-fixed owner"
            onClick={() => demoLogin("owner@globex.com")}
            disabled={loading || isSubmitting}
          >
            <span className="demo-icon">🌐</span>
            <div>
              <div className="demo-title">Company Owner</div>
              <div className="demo-desc">Globex Ltd</div>
            </div>
          </button>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">Don't have an account?</p>
          <button
            type="button"
            className="auth-switch-btn-fixed"
            onClick={onSwitchToRegister}
            disabled={loading || isSubmitting}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
