"use client";

// ============================================================
// WALEED AN Portfolio — Contact Section
// Form with validation, honeypot spam protection, API submission
// ============================================================

import { useState } from "react";
import { Input, Select, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  MessageOutlined,
  SendOutlined,
  GithubOutlined,
  LinkedinOutlined,
  WhatsAppOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { SITE_META } from "../../constants";
import type { ContactFormData } from "../../types";

const { TextArea } = Input;

// ------------------------------------------------------------
// Budget options for the select dropdown
// ------------------------------------------------------------
const BUDGET_OPTIONS = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1500", label: "$500 – $1,500" },
  { value: "1500-5000", label: "$1,500 – $5,000" },
  { value: "5000-plus", label: "$5,000+" },
  { value: "not-sure", label: "Not sure yet" },
  { value: "full-time", label: "Full-time role" },
];

// ------------------------------------------------------------
// Contact info cards shown on the left
// ------------------------------------------------------------
const CONTACT_CARDS = [
  {
    icon: <MailOutlined />,
    label: "Email",
    value: SITE_META.email,
    href: `mailto:${SITE_META.email}`,
  },
  {
    icon: <WhatsAppOutlined />,
    label: "WhatsApp",
    value: SITE_META.phone,
    href: `https://wa.me/923407615594`,
  },

  {
    icon: <LinkedinOutlined />,
    label: "LinkedIn",
    value: "Waleed AN",
    href: "https://www.linkedin.com/in/waleed-an-02204a316/",
  },
];

// ------------------------------------------------------------
// Form field error type
// ------------------------------------------------------------
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

// ------------------------------------------------------------
// Validate form fields client-side before submitting
// ------------------------------------------------------------
function validateForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = "Your name is required";

  if (!data.email.trim()) errors.email = "Your email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address";

  if (!data.subject.trim())
    errors.subject = "A subject helps Waleed prioritize";

  if (!data.message.trim()) errors.message = "Please write your message";
  else if (data.message.trim().length < 20)
    errors.message = "Message too short — add a bit more detail";

  return errors;
}

// ------------------------------------------------------------
// Contact Component
// ------------------------------------------------------------
export default function Contact() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    budget: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ----------------------------------------------------------
  // Field change handler — clears field error on change
  // ----------------------------------------------------------
  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ----------------------------------------------------------
  // Submit handler
  // ----------------------------------------------------------
  const handleSubmit = async () => {
    // Client-side validation
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors above", { duration: 3000 });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: "", // honeypot field — always empty from real users
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success("Message sent! Waleed will reply within 24 hours.", {
          duration: 5000,
        });
      } else {
        toast.error(data.message || "Something went wrong. Please try again.", {
          duration: 5000,
        });
      }
    } catch {
      toast.error(`Failed to send. Email directly: ${SITE_META.email}`, {
        duration: 6000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------------
  // Field style helper — adds red border on error
  // ----------------------------------------------------------
  const fieldStyle = (field: keyof ContactFormData): React.CSSProperties => ({
    borderRadius: "10px",
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    borderColor: errors[field] ? "#ef4444" : "#e2e8f0",
  });

  // ----------------------------------------------------------
  // Render — Success State
  // ----------------------------------------------------------
  if (submitted) {
    return (
      <section
        id="contact"
        style={{
          padding: "6rem 1.5rem",
          background: "#FAFAFA",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <CheckCircleFilled
            style={{
              fontSize: "3.5rem",
              color: "var(--accent)",
              marginBottom: "1.25rem",
              display: "block",
            }}
          />
          <h3
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
              marginBottom: "0.75rem",
            }}
          >
            Message Received!
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            Thanks for reaching out. Waleed typically responds within 24 hours.
            In the meantime, feel free to explore his projects or connect on
            LinkedIn.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
                budget: "",
              });
            }}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              borderRadius: "10px",
              borderColor: "var(--accent)",
              color: "var(--accent)",
            }}
          >
            Send Another Message
          </Button>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------
  // Render — Form State
  // ----------------------------------------------------------
  return (
    <section
      id="contact"
      style={{
        padding: "6rem 1.5rem",
        background: "#FAFAFA",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* -------------------------------------------------- */}
        {/* Section Header                                      */}
        {/* -------------------------------------------------- */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Get In Touch
          </span>
          <h2
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--text-primary)",
              letterSpacing: "-1px",
              margin: "0 0 1rem",
            }}
          >
            Let&apos;s Build Something Together
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Have a project in mind? Looking to hire? I&apos;m open to freelance
            work and full-time opportunities.
          </p>
        </div>

        {/* -------------------------------------------------- */}
        {/* Two-column layout: Info | Form                      */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* ---- Left: Contact Info ---- */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.4px",
                marginBottom: "1.5rem",
              }}
            >
              Contact Details
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {CONTACT_CARDS.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  //   target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--accent-light)";
                    el.style.boxShadow = "0 4px 16px rgba(124,58,237,0.1)";
                    el.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "#e2e8f0";
                    el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                    el.style.transform = "translateX(0)";
                  }}
                >
                  {/* Icon */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "var(--accent-light)",
                      color: "var(--accent)",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </span>

                  {/* Label + value */}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        marginBottom: "0.1rem",
                      }}
                    >
                      {card.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.1px",
                      }}
                    >
                      {card.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ---- Right: Contact Form ---- */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
              }}
            >
              {/* Name + Email row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "1rem",
                }}
              >
                {/* Name */}
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
                    Your Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <Input
                    prefix={
                      <UserOutlined style={{ color: "var(--text-muted)" }} />
                    }
                    placeholder="Muhammad Ali"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    status={errors.name ? "error" : ""}
                    style={{ ...fieldStyle("name"), height: "42px" }}
                  />
                  {errors.name && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "#ef4444",
                        margin: "0.3rem 0 0",
                      }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                    Email Address <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <Input
                    prefix={
                      <MailOutlined style={{ color: "var(--text-muted)" }} />
                    }
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    status={errors.email ? "error" : ""}
                    style={{ ...fieldStyle("email"), height: "42px" }}
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
              </div>

              {/* Subject */}
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
                  Subject <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <Input
                  placeholder="e.g. AI SaaS project collaboration"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  status={errors.subject ? "error" : ""}
                  style={{ ...fieldStyle("subject"), height: "42px" }}
                />
                {errors.subject && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "#ef4444",
                      margin: "0.3rem 0 0",
                    }}
                  >
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
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
                  Message <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <TextArea
                  //   prefix={<MessageOutlined />}
                  placeholder="Tell me about your project — what you're building, your timeline, and how I can help..."
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  status={errors.message ? "error" : ""}
                  rows={5}
                  maxLength={2000}
                  showCount
                  style={{
                    ...fieldStyle("message"),
                    resize: "vertical",
                    lineHeight: 1.65,
                  }}
                />
                {errors.message && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "#ef4444",
                      margin: "0.3rem 0 0",
                    }}
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot — hidden from real users, visible to bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  height: 0,
                }}
              />

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                loading={submitting}
                icon={<SendOutlined />}
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
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
