// ============================================================
// WALEED AN Portfolio — /api/assistant
// POST → send message to AI, get reply as Waleed's assistant
// Uses: Grok (primary) → Claude (fallback)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAIResponse, checkRateLimit } from "../../../lib/ai/grok";
import type { AssistantRequest } from "../../../types";

// ------------------------------------------------------------
// POST /api/assistant
// Body: { message: string, history: ChatMessage[] }
// Returns: { reply: string, success: boolean }
// ------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    // ----------------------------------------------------------
    // RATE LIMITING — Protect API keys from abuse
    // Get real IP from Vercel headers
    // ----------------------------------------------------------
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

    const { allowed, remaining } = checkRateLimit(ip, 20, 60_000);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          reply: "Too many messages. Please wait a moment before trying again.",
          error: "Rate limit exceeded",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
          },
        },
      );
    }

    // ----------------------------------------------------------
    // PARSE & VALIDATE BODY
    // ----------------------------------------------------------
    let body: AssistantRequest;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          reply: "Invalid request format.",
          error: "Invalid JSON",
        },
        { status: 400 },
      );
    }

    // Validate message exists
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        {
          success: false,
          reply: "Please send a message.",
          error: "Message is required",
        },
        { status: 400 },
      );
    }

    // Sanitize — trim and cap length
    const message = body.message.trim().slice(0, 500);
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          reply: "Please type something first.",
          error: "Empty message",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------------------------
    // CONTENT FILTER — Block obvious prompt injection attempts
    // ----------------------------------------------------------
    const blocked = [
      "ignore previous instructions",
      "ignore all instructions",
      "you are now",
      "forget your instructions",
      "new persona",
      "act as",
      "jailbreak",
      "dan mode",
    ];

    const lowerMsg = message.toLowerCase();
    const isBlocked = blocked.some((term) => lowerMsg.includes(term));

    if (isBlocked) {
      return NextResponse.json(
        {
          success: true,
          reply:
            "I'm Waleed's portfolio assistant and I'm here to answer questions about his work and skills. What would you like to know?",
        },
        { status: 200 },
      );
    }

    // ----------------------------------------------------------
    // CALL AI — Grok with Claude fallback
    // ----------------------------------------------------------
    const result = await getAIResponse(message, history);

    // ----------------------------------------------------------
    // RETURN RESPONSE
    // ----------------------------------------------------------
    return NextResponse.json(
      {
        success: result.success,
        reply: result.reply,
        error: result.error ?? null,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  } catch (err: unknown) {
    console.error("Assistant API error:", err);
    const msg = err instanceof Error ? err.message : "Server error";

    return NextResponse.json(
      {
        success: false,
        reply:
          "Sorry, I ran into an issue. Please reach out to Waleed directly at waleedancoding@gmail.com",
        error: msg,
      },
      { status: 500 },
    );
  }
}

// ------------------------------------------------------------
// Only POST is allowed on this route
// ------------------------------------------------------------
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 },
  );
}
