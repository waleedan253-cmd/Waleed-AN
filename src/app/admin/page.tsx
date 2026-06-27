"use client";

// ============================================================
// WALEED AN Portfolio — Admin Login Page
// Supabase email/password auth with redirect on success
// ============================================================

import { useState } from "react";
import { Input, Button } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useRedirectIfAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

// ------------------------------------------------------------
// Admin Login Component
// ------------------------------------------------------------
export default function AdminLoginPage() {
  const { login, loading: authLoading } = useRedirectIfAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  // ----------------------------------------------------------
  // Client-side validation
  // ----------------------------------------------------------
  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  // ----------------------------------------------------------
  // Submit login
  // ----------------------------------------------------------
  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const result = await login(email.trim(), password);

    if (!result.success) {
      toast.error(result.error ?? "Login failed. Check your credentials.", {
        duration: 4000,
      });
    }
    // On success → useRedirectIfAuth automatically redirects to /admin/dashboard

    setSubmitting(false);
  };

  // ----------------------------------------------------------
  // Handle Enter key
  // ----------------------------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  // ----------------------------------------------------------
  // Show loading while checking existing session
  // ----------------------------------------------------------
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid var(--accent-light)",
            borderTop: "3px solid var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Render — Login Form
  // ----------------------------------------------------------
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(160deg, #ffffff 0%, #f5f3ff 50%, #ede9fe 100%)",
        padding: "1.5rem",
      }}
    >
      {/* ---------------------------------------------------- */}
      {/* Login Card                                            */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 40px rgba(124,58,237,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Purple header strip */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.2)",
              marginBottom: "0.75rem",
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            <RobotOutlined />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "1.3rem",
              color: "#fff",
              letterSpacing: "-0.5px",
              margin: "0 0 0.25rem",
            }}
          >
            Waleed AN
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.75)",
              margin: 0,
            }}
          >
            Portfolio Admin Panel
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: "2rem" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            {/* Email field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                  letterSpacing: "-0.1px",
                }}
              >
                Email Address
              </label>
              <Input
                prefix={<MailOutlined style={{ color: "var(--text-muted)" }} />}
                placeholder="waleedancoding@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((p) => ({ ...p, email: undefined }));
                }}
                onKeyDown={handleKeyDown}
                status={errors.email ? "error" : ""}
                autoComplete="email"
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  borderColor: errors.email ? "#ef4444" : "#e2e8f0",
                }}
              />
              {errors.email && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "#ef4444",
                    margin: "0.3rem 0 0",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                  letterSpacing: "-0.1px",
                }}
              >
                Password
              </label>
              <Input
                prefix={<LockOutlined style={{ color: "var(--text-muted)" }} />}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.9rem",
                    }}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                }
                type={showPass ? "text" : "password"}
                placeholder="Your admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: undefined }));
                }}
                onKeyDown={handleKeyDown}
                status={errors.password ? "error" : ""}
                autoComplete="current-password"
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  borderColor: errors.password ? "#ef4444" : "#e2e8f0",
                }}
              />
              {errors.password && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "#ef4444",
                    margin: "0.3rem 0 0",
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              onClick={handleLogin}
              loading={submitting}
              size="large"
              style={{
                background: "var(--accent)",
                borderColor: "var(--accent)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.9rem",
                borderRadius: "10px",
                height: "48px",
                letterSpacing: "-0.2px",
                boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
                marginTop: "0.25rem",
              }}
            >
              {submitting ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
          </div>

          {/* Security note */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1rem",
              background: "#f8f9fa",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            <LockOutlined
              style={{
                color: "var(--accent)",
                fontSize: "0.85rem",
                flexShrink: 0,
              }}
            />
            Secured by Supabase Auth. Only authorized admins can access this
            panel.
          </div>
        </div>

        {/* Back to portfolio link */}
        <div
          style={{
            textAlign: "center",
            padding: "0 2rem 1.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <a
            href="/"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
