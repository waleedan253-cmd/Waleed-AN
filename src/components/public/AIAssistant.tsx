"use client";

// ============================================================
// WALEED AN Portfolio — AI Assistant Widget
// Floating "Ask Waleed" chat powered by Grok/Claude API
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Input, Button } from "antd";
import type { InputRef } from "antd";
import {
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

// ------------------------------------------------------------
// Quick prompt suggestions shown before first message
// ------------------------------------------------------------
const SUGGESTIONS = [
  "What projects has Waleed built?",
  "What is his tech stack?",
  "Is he available for freelance?",
  "Tell me about SahiScreen",
];

// ------------------------------------------------------------
// Format timestamp → "2:34 PM"
// ------------------------------------------------------------
function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ------------------------------------------------------------
// Typing indicator — three bouncing dots
// ------------------------------------------------------------
function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.6rem 0.9rem",
        background: "#f1f5f9",
        borderRadius: "12px 12px 12px 3px",
        width: "fit-content",
        maxWidth: "80px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--accent)",
            display: "block",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}

// ------------------------------------------------------------
// Single message bubble
// ------------------------------------------------------------
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "0.5rem",
        marginBottom: "0.75rem",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: isUser ? "#e2e8f0" : "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "0.75rem",
          color: isUser ? "var(--text-secondary)" : "#fff",
        }}
      >
        {isUser ? <UserOutlined /> : <RobotOutlined />}
      </div>

      {/* Bubble + time */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          maxWidth: "80%",
          gap: "0.2rem",
        }}
      >
        <div
          style={{
            padding: "0.6rem 0.9rem",
            borderRadius: isUser ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
            background: isUser ? "var(--accent)" : "#f1f5f9",
            color: isUser ? "#fff" : "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            fontWeight: 400,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
          }}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// AIAssistant Component
// ------------------------------------------------------------
export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<InputRef>(null);

  // ----------------------------------------------------------
  // Auto-scroll to latest message
  // ----------------------------------------------------------
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  // ----------------------------------------------------------
  // Focus input when chat opens
  // ----------------------------------------------------------
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasOpened(true);
    }
  }, [open]);

  // ----------------------------------------------------------
  // Send message to API
  // ----------------------------------------------------------
  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.reply ?? "Sorry, I had trouble responding. Please try again.",
        time: formatTime(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `I ran into an issue. Please reach out directly at waleedancoding@gmail.com`,
          time: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // Handle Enter key
  // ----------------------------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div className="ai-widget">
      {/* ---------------------------------------------------- */}
      {/* Chat Panel                                            */}
      {/* ---------------------------------------------------- */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 0.75rem)",
            right: 0,
            width: "min(360px, calc(100vw - 2rem))",
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: "480px",
            animation: "slideUp 0.25s ease",
          }}
        >
          {/* ------------------------------------------------ */}
          {/* Panel Header                                      */}
          {/* ------------------------------------------------ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem 1.25rem",
              background: "var(--accent)",
              flexShrink: 0,
            }}
          >
            {/* Bot avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <RobotOutlined />
            </div>

            {/* Title + status */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#fff",
                  letterSpacing: "-0.2px",
                }}
              >
                Ask Waleed AI
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 500,
                }}
              ></div>
            </div>

            {/* Clear + Close buttons */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  title="Clear chat"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    borderRadius: "6px",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    padding: "0.2rem 0.5rem",
                  }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "0.25rem 0.4rem",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CloseOutlined />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Messages area                                     */}
          {/* ------------------------------------------------ */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              scrollbarWidth: "thin",
              scrollbarColor: "#e2e8f0 transparent",
            }}
          >
            {/* Welcome message — shown before any messages */}
            {messages.length === 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.75rem",
                      color: "#fff",
                    }}
                  >
                    <RobotOutlined />
                  </div>
                  <div
                    style={{
                      padding: "0.6rem 0.9rem",
                      borderRadius: "12px 12px 12px 3px",
                      background: "#f1f5f9",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      color: "var(--text-primary)",
                      maxWidth: "80%",
                    }}
                  >
                    👋 Hi! I&apos;m Waleed&apos;s AI assistant. Ask me anything
                    about his skills, projects, or availability!
                  </div>
                </div>

                {/* Quick suggestion buttons */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    paddingLeft: "36px",
                  }}
                >
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      style={{
                        background: "var(--accent-light)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: "999px",
                        padding: "0.3rem 0.75rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--accent)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "var(--accent)";
                        el.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "var(--accent-light)";
                        el.style.color = "var(--accent)";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation messages */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "0.75rem",
                    color: "#fff",
                  }}
                >
                  <LoadingOutlined spin />
                </div>
                <TypingIndicator />
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* ------------------------------------------------ */}
          {/* Input area                                        */}
          {/* ------------------------------------------------ */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexShrink: 0,
              background: "#fff",
            }}
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Waleed..."
              disabled={loading}
              maxLength={500}
              style={{
                borderRadius: "10px",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                borderColor: "#e2e8f0",
                flex: 1,
              }}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              icon={loading ? <LoadingOutlined spin /> : <SendOutlined />}
              style={{
                background:
                  input.trim() && !loading ? "var(--accent)" : "#f1f5f9",
                borderColor:
                  input.trim() && !loading ? "var(--accent)" : "#e2e8f0",
                color: input.trim() && !loading ? "#fff" : "var(--text-muted)",
                borderRadius: "10px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Floating trigger button                               */}
      {/* ---------------------------------------------------- */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--accent)",
          border: "none",
          color: "#fff",
          fontSize: "1.4rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
          transition: "all 0.25s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.transform = open
            ? "rotate(90deg) scale(1.08)"
            : "scale(1.08)";
          el.style.boxShadow = "0 6px 28px rgba(124,58,237,0.55)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.transform = open ? "rotate(90deg)" : "scale(1)";
          el.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)";
        }}
      >
        {open ? <CloseOutlined /> : <RobotOutlined />}

        {/* Unread dot — shown before first open */}
        {!hasOpened && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#22C55E",
              border: "2px solid #fff",
            }}
          />
        )}
      </button>

      {/* ---------------------------------------------------- */}
      {/* Slide-up animation                                    */}
      {/* ---------------------------------------------------- */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
