// ============================================================
// WALEED AN Portfolio — /api/contact
// POST → validate and save contact form to Supabase
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "../../../lib/ai/grok";
import type { ContactFormData } from "../../../types";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
// ------------------------------------------------------------
// Email validation helper
// ------------------------------------------------------------
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ------------------------------------------------------------
// POST /api/contact
// Body: ContactFormData
// Saves message to Supabase contact_messages table
// ------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    // ----------------------------------------------------------
    // RATE LIMITING — Max 3 contact submissions per 10 minutes
    // Prevents spam from same IP
    // ----------------------------------------------------------
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

    const { allowed } = checkRateLimit(ip, 3, 10 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many submissions. Please wait 10 minutes before trying again.",
        },
        { status: 429 },
      );
    }

    // ----------------------------------------------------------
    // PARSE BODY
    // ----------------------------------------------------------
    let body: ContactFormData;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request format." },
        { status: 400 },
      );
    }

    // ----------------------------------------------------------
    // VALIDATE FIELDS
    // ----------------------------------------------------------
    const { name, email, subject, message } = body;

    // Required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 },
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!subject?.trim()) {
      return NextResponse.json(
        { success: false, message: "Subject is required." },
        { status: 400 },
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message is required." },
        { status: 400 },
      );
    }

    // Length limits
    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, message: "Name is too long (max 100 characters)." },
        { status: 400 },
      );
    }

    if (subject.trim().length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is too long (max 200 characters).",
        },
        { status: 400 },
      );
    }

    if (message.trim().length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is too long (max 2000 characters).",
        },
        { status: 400 },
      );
    }

    // Spam detection — basic honeypot check
    // If body contains 'website' field (hidden in form) → it's a bot
    if ((body as any).website) {
      // Silently succeed to not reveal honeypot to bots
      return NextResponse.json(
        { success: true, message: "Message sent successfully!" },
        { status: 200 },
      );
    }

    // ✅ REPLACE WITH this Resend email sender
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // free Resend sender
      to: "waleedancoding@gmail.com", // your inbox
      subject: `[Portfolio] ${subject.trim()} — from ${name.trim()}`,
      html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7C3AED;">New Contact Form Submission</h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight:bold;">Name</td><td style="padding: 8px;">${name.trim()}</td></tr>
        <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight:bold;">Email</td><td style="padding: 8px;"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
        <tr><td style="padding: 8px; font-weight:bold;">Subject</td><td style="padding: 8px;">${subject.trim()}</td></tr>
        <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight:bold;"></td><td style="padding: 8px;">$.trim() || "Not specified"}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #f5f3ff; border-radius: 8px; border-left: 4px solid #7C3AED;">
        <strong>Message:</strong>
        <p style="margin-top: 8px; line-height: 1.7;">${message.trim().replace(/\n/g, "<br/>")}</p>
      </div>
      <p style="margin-top: 20px; color: #888; font-size: 12px;">Sent from your portfolio contact form</p>
    </div>
  `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to send message. Please email directly at waleedancoding@gmail.com",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message:
          "Message received! Waleed will get back to you within 24 hours.",
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please email waleedancoding@gmail.com directly.",
      },
      { status: 500 },
    );
  }
}

// ------------------------------------------------------------
// GET — not allowed
// ------------------------------------------------------------
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
