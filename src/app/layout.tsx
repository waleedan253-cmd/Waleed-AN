// ============================================================
// WALEED AN Portfolio — Root Layout
// Wraps every page: fonts, metadata, toast notifications
// ============================================================

import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { SITE_META } from "../constants";
import PageLoader from "../components/public/PageLoader";

// ------------------------------------------------------------
// METADATA — SEO & Social sharing
// This appears in Google search results and social previews
// ------------------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: SITE_META.title,
    template: `%s | ${SITE_META.name}`, // "Projects | Waleed AN"
  },
  description: SITE_META.description,
  keywords: [
    "Waleed AN",
    "Full Stack Developer Pakistan",
    "AI Developer Faisalabad",
    "Next.js Developer Pakistan",
    "LLM Integration Developer",
    "SaaS Developer",
    "Anthropic Claude Developer",
    "OpenAI Developer",
    "React Developer Pakistan",
    "Freelance Developer Pakistan",
  ],
  authors: [{ name: SITE_META.name, url: SITE_META.url }],
  creator: SITE_META.name,

  // Open Graph — Facebook, LinkedIn, WhatsApp previews
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_META.url,
    siteName: SITE_META.name,
    title: SITE_META.title,
    description: SITE_META.description,
    images: [
      {
        url: `${SITE_META.url}/og-image.png`, // Add this image to /public later
        width: 1200,
        height: 630,
        alt: `${SITE_META.name} — Full-Stack SaaS & AI Developer`,
      },
    ],
  },

  // Twitter/X card
  twitter: {
    card: "summary_large_image",
    title: SITE_META.title,
    description: SITE_META.description,
    images: [`${SITE_META.url}/og-image.png`],
  },

  // Canonical URL — prevents duplicate content issues
  alternates: {
    canonical: SITE_META.url,
  },

  // Favicon

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-32x32.png",
  },

  // Robots — allow indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

// ------------------------------------------------------------
// VIEWPORT — Mobile optimization
// ------------------------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7C3AED", // Purple browser chrome on mobile
};

// ------------------------------------------------------------
// ROOT LAYOUT COMPONENT
// ------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        {/* Structured Data — tells Google you are a developer */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Waleed AN",
              jobTitle: "Full-Stack SaaS Developer",
              description: SITE_META.description,
              url: SITE_META.url,
              email: SITE_META.email,
              telephone: SITE_META.phone,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Faisalabad",
                addressCountry: "PK",
              },
              knowsAbout: [
                "Next.js",
                "React",
                "TypeScript",
                "AI Integration",
                "LLM APIs",
                "Anthropic Claude",
                "OpenAI",
                "Grok",
                "Supabase",
                "SaaS Development",
              ],
              sameAs: ["https://sahihrx.com"],
            }),
          }}
        />
      </head>

      <body>
        <PageLoader />
        {/* Global toast notifications — used across entire app */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            },
            success: {
              iconTheme: {
                primary: "#7C3AED",
                secondary: "#EDE9FE",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#FEE2E2",
              },
            },
          }}
        />

        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
