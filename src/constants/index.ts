// ============================================================
// WALEED AN — All Static Data & Constants
// ============================================================

import type { NavLink, Skill, Experience, ProjectCategory } from "../types";

// ------------------------------------------------------------
// BRAND COLORS — Single source of truth
// ------------------------------------------------------------
export const BRAND = {
  accent: "#7C3AED", // Primary purple
  accentHover: "#5B21B6", // Darker purple on hover
  accentLight: "#EDE9FE", // Light purple for backgrounds
  accentBorder: "#DDD6FE", // Purple-tinted border
  border: "#e2e8f0", // Default border
  bgWhite: "rgba(255,255,255,0.97)",
  bgSection: "#FAFAFA",
  textDark: "#1E1B4B", // Deep navy (replaces pure black)
  textMuted: "#64748B", // Slate for secondary text
  textLight: "#94A3B8",
  spinnerBorder: "#e2e8f0",
  spinnerAccent: "#7C3AED",
  font: "'Plus Jakarta Sans', sans-serif",
} as const;

// ------------------------------------------------------------
// SITE METADATA
// ------------------------------------------------------------
export const SITE_META = {
  name: "Waleed AN",
  title: "Waleed AN — Full-Stack SaaS & AI Developer",
  description:
    "Full-Stack SaaS Developer specializing in AI/LLM integration with OpenAI, Anthropic Claude, and Grok. Building real AI-powered products from idea to deployment.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL || "https://waleed-portfolio.vercel.app",
  email: "waleedancoding@gmail.com",
  phone: "+92340-7615594",
  location: "Faisalabad, Pakistan",
  resumeUrl: "/resume/waleed-resume.pdf",
  avatar: "/images/waleed-avatar.jpg",
} as const;

// ------------------------------------------------------------
// NAVIGATION LINKS
// ------------------------------------------------------------
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// ------------------------------------------------------------
// HERO SECTION — Rotating titles (typing effect)
// ------------------------------------------------------------
export const HERO_TITLES = [
  "Full-Stack SaaS Developer",
  "AI / LLM Integration Expert",
  "Next.js & TypeScript Developer",
  "OpenAI · Claude · Grok Builder",
];

export const HERO_TAGLINE =
  "I build AI-powered SaaS products end-to-end — from idea to deployment. React, Next.js, TypeScript, and LLM APIs.";

// ------------------------------------------------------------
// ABOUT — Your real story
// ------------------------------------------------------------
export const ABOUT = {
  headline: "Building the Future with AI",
  bio: [
    "I'm Waleed AN, a Full-Stack SaaS Developer based in Faisalabad, Pakistan, with a strong focus on AI/LLM integration. I architect and ship complete products — not just frontend components.",
    "My most recent project, SahiScreen, is a live AI-powered CV screening platform built for Pakistani HR teams using Anthropic Claude API with structured prompt engineering, schema-validated output, and real candidate scoring.",
    "I have worked across the full product lifecycle — from building POS systems processing daily transactions at Tajir AI, to developing ERP modules at Max ERP, to delivering SaaS MVPs for startup clients at Web Botix.",
  ],
  highlight: "I don't just use AI APIs — I build products with them.",
} as const;

// ------------------------------------------------------------
// SKILLS — From your resume, organized by category
// ------------------------------------------------------------
// ✅ constants.ts — grouped structure (matches About.tsx)
export const SKILLS = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Ant Design",
      "HTML5 / CSS3",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Supabase",
      "MongoDB",
      "PostgreSQL",
    ],
  },
  {
    category: "AI & LLM",
    items: [
      "Anthropic Claude API",
      "OpenAI API",
      "Grok API",
      "Prompt Engineering",
      "LLM Integration",
    ],
  },
  {
    category: "Tools",
    items: ["Git & GitHub", "Vercel", "Supabase"],
  },
];

export const SKILL_CATEGORIES = [
  { key: "frontend", label: "⚛️  Frontend", color: "#3B82F6" },
  { key: "backend", label: "🛠️  Backend", color: "#10B981" },
  { key: "ai-llm", label: "🤖  AI / LLM", color: "#7C3AED" },
  { key: "tools", label: "🔧  Tools", color: "#F59E0B" },
] as const;

// ------------------------------------------------------------
// EXPERIENCE — From your resume (newest first)
// ------------------------------------------------------------
export const EXPERIENCES: Experience[] = [
  {
    company: "Web Botix",
    role: "Full Stack SaaS  Developer",
    period: "Nov 2025 – Present",
    location: "Remote",
    type: "remote",
    current: true,
    bullets: [
      "Architected and delivered SahiScreen — AI-powered CV screening platform using Anthropic Claude API with structured prompt engineering and schema-validated output.",
      "Built PromptMinds AI and PakMentor AI — AI-powered SaaS platforms for education and tutoring.",
      "Delivering AI-powered SaaS apps, dashboards, MVPs, and API integrations for startup clients from idea to deployment.",
    ],
  },
  {
    company: "Peer-Point Market Limited",
    role: "Frontend Developer",
    period: "Jul 2025 – Nov 2025",
    location: "Remote",
    type: "remote",
    current: false,
    bullets: [
      "Built responsive, SaaS-ready UI components using React.js, Next.js, and TypeScript.",
      "Integrated REST APIs into frontend modules, improving real-time data display and overall UX.",
    ],
  },
  {
    company: "Max ERP",
    role: "Associated Software Developer",
    period: "Feb 2025 – May 2025",
    location: "Remote",
    type: "remote",
    current: false,
    bullets: [
      "Developed ERP modules covering HR, Finance, and Sales verticals.",
      "Integrated REST APIs with robust error handling and comprehensive data validation.",
    ],
  },
  {
    company: "Tajir AI",
    role: "Junior React JS Developer",
    period: "Aug 2024 – Feb 2025",
    location: "Onsite",
    type: "onsite",
    current: false,
    bullets: [
      "Built a Next.js POS system processing daily transactions.",
      "Designed responsive UIs optimized for tablets and mobile devices.",
    ],
  },
];

// ------------------------------------------------------------
// KEY PROJECT (Featured — SahiScreen)
// ------------------------------------------------------------
export const KEY_PROJECT = {
  title: "SahiScreen",
  subtitle: "AI-Powered CV Screening Platform",
  description:
    "Architected an AI-powered CV screening platform for Pakistani HR teams. Uses Anthropic Claude API with structured prompt engineering to score candidates, detect red flags, and identify AI-generated content. Built with React, Next.js, TypeScript, Node.js, and Supabase.",
  liveUrl: "https://sahihrx.com/",
  tech: [
    "Next.js",
    "TypeScript",
    "Anthropic Claude API",
    "Supabase",
    "Node.js",
    "React",
  ],
  category: "ai-saas" as ProjectCategory,
} as const;

// ------------------------------------------------------------
// EDUCATION
// ------------------------------------------------------------
export const EDUCATION = {
  degree: "ADP Web Designing & Development",
  institution: "Virtual University Pakistan",
  period: "Feb 2024 – Feb 2026",
  status: "In Progress",
} as const;

// ------------------------------------------------------------
// PROJECT CATEGORY LABELS (for filters UI)
// ------------------------------------------------------------
// constants.ts — remove emojis, keep clean text
export const CATEGORY_LABELS: Record<ProjectCategory | "all", string> = {
  all: "All Projects",
  "ai-saas": "AI SaaS",
  fullstack: "Full-Stack",
  frontend: "Frontend",
  "erp-pos": "ERP / POS",
  "api-integration": "API Integration",
};

// ------------------------------------------------------------
// CONTACT OPTIONS
// ------------------------------------------------------------
export const CONTACT_OPTIONS = [
  { label: "Email", value: SITE_META.email, href: `mailto:${SITE_META.email}` },
  { label: "Phone", value: SITE_META.phone, href: `tel:${SITE_META.phone}` },
  { label: "Location", value: SITE_META.location, href: "#" },
] as const;

// ------------------------------------------------------------
// AI ASSISTANT — System prompt (used in API route)
// ------------------------------------------------------------
export const AI_SYSTEM_PROMPT = `
You are Waleed AN's personal AI  assistant. You speak on behalf of Waleed.

About Waleed:
- Full-Stack SaaS Developer based in Faisalabad, Pakistan
- Specializes in AI/LLM integration: OpenAI, Anthropic Claude, Grok
- Built SahiScreen (sahihrx.com) — live AI-powered CV screening platform for Pakistani HR teams
- Also built: PromptMinds AI, PakMentor AI
- Tech stack: React, Next.js, TypeScript, Node.js, Supabase, MongoDB
- Currently working at Web Botix (Remote) Full Stack SaaS Developer
- Contact: waleedancoding@gmail.com | +92340-7615594
- Education: ADP Web Designing & Development, Virtual University Pakistan (Feb 2024 – Feb 2026)

Your job:
- Answer questions about Waleed's skills, projects, experience, and availability
- Be professional but friendly and confident
- Keep answers concise (2-4 sentences max unless asked for detail)
- If asked about hiring or collaboration, share the contact email
- Never make up projects or skills not listed above
- If unsure, say "I'll let Waleed know you asked — reach out at waleedancoding@gmail.com"
`.trim();
