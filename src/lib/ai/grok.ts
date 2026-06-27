// ============================================================
// WALEED AN Portfolio — AI Assistant Client
// Primary:  Grok API (xAI)
// Fallback: Anthropic Claude API
// ============================================================

import { AI_SYSTEM_PROMPT } from "../../constants";
import type { ChatMessage, AssistantResponse } from "../../types";

// ------------------------------------------------------------
// CLIENT SETUP
// ------------------------------------------------------------

// Grok uses OpenAI-compatible API format

// ------------------------------------------------------------
// GROK CLIENT — Primary AI
// Grok uses OpenAI-compatible REST API
// ------------------------------------------------------------
async function askGrok(
  userMessage: string,
  history: ChatMessage[],
): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) throw new Error("Missing env: GROK_API_KEY");

  // Build message history in OpenAI format
  const messages = [
    // System prompt always first
    { role: "system", content: AI_SYSTEM_PROMPT },

    // Previous conversation turns
    ...history.slice(-6).map((msg) => ({
      // Last 6 messages for context
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),

    // Current user message
    { role: "user", content: userMessage },
  ];

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast & cost-effective
        messages,
        max_tokens: 300, // Keep answers concise
        temperature: 0.7, // Balanced creativity
        stream: false,
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Grok API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ------------------------------------------------------------
// CLAUDE FALLBACK — When Grok is unavailable
// ------------------------------------------------------------

// ------------------------------------------------------------
// MAIN EXPORT — Try Grok first, fall back to Claude
// ------------------------------------------------------------
// ✅ REPLACE the entire getAIResponse function with this:
export async function getAIResponse(
  userMessage: string,
  history: ChatMessage[] = [],
): Promise<AssistantResponse> {
  if (!userMessage?.trim()) {
    return {
      reply: "Please type a message first.",
      success: false,
      error: "Empty message",
    };
  }

  const sanitized = userMessage.trim().slice(0, 500);

  try {
    const reply = await askGrok(sanitized, history);
    if (reply) {
      return { reply, success: true };
    }
    throw new Error("Empty response from Grok");
  } catch (error) {
    console.error("Grok failed:", error);
    return {
      reply:
        "I'm having trouble connecting right now. Please reach out to Waleed directly at waleedancoding@gmail.com",
      success: false,
      error: "Grok unavailable",
    };
  }
}

// ------------------------------------------------------------
// RATE LIMITING HELPER
// Simple in-memory store (resets on cold start)
// For production, use Supabase or Redis
// ------------------------------------------------------------
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  maxRequests = 20,
  windowMs = 60_000, // 1 minute window
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(ip);

  // New IP or window expired → reset
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  // Within window
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}
