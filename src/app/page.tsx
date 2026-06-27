// ============================================================
// WALEED AN Portfolio — Homepage
// Assembles all public sections into one smooth single-page app
// ============================================================

import type { Metadata } from "next";
import Navbar from "../components/public/Navbar";
import Hero from "../components/public/Hero";
import About from "../components/public/About";
import ProjectsSection from "../components/public/ProjectsSection";
import Contact from "../components/public/Contact";
import Footer from "../components/public/Footer";
import AIAssistant from "../components/public/AIAssistant";

// ------------------------------------------------------------
// Page-level metadata — overrides root layout default
// ------------------------------------------------------------
export const metadata: Metadata = {
  title: "Waleed AN — Full-Stack SaaS & AI Developer",
  description:
    "Full-Stack SaaS Developer specializing in AI/LLM integration. " +
    "Builder of SahiScreen, PromptMinds AI, and PakMentor AI. " +
    "Based in Faisalabad, Pakistan. Available for freelance & full-time.",
  alternates: {
    canonical: "https://waleedan.vercel.app",
  },
};

// ------------------------------------------------------------
// Homepage — Server Component (no 'use client' needed here)
// Each child component handles its own client interactivity
// ------------------------------------------------------------
export default function HomePage() {
  return (
    <>
      {/* Fixed navigation — stays on top across all sections */}
      <Navbar />

      {/* ---- Sections in scroll order ---- */}
      <main>
        {/* 1. Hero — first impression, headline + CTA */}
        <Hero />

        {/* 2. About — story, skills, experience timeline */}
        <About />

        {/* 3. Projects — filterable grid with search */}
        <ProjectsSection />

        {/* 4. Contact — form + contact info */}
        <Contact />
      </main>

      {/* Site footer */}
      <Footer />

      {/* Floating AI chat widget — fixed position, always visible */}
      <AIAssistant />
    </>
  );
}
