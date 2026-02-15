import type { Metadata } from "next";
import { CommandMenu } from "@/components/command-menu";
import { SiteEffects } from "@/components/site-effects";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://whyujjwal.com"),
  title: {
    default: "Ujjwal Raj | AI Engineer | Backend Systems | Agent Specialist",
    template: "%s | whyujjwal",
  },
  description:
    "AI Engineer specializing in production RAG systems, autonomous agents, and LLM infrastructure.",
  openGraph: {
    title: "Ujjwal Raj | AI Engineer",
    description:
      "I build things that work, break things that do not, and write about all of it.",
    url: "https://whyujjwal.com",
    siteName: "whyujjwal",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "why ujjwal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ujjwal Raj | AI Engineer",
    description: "Production AI systems, build logs, and writing.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        <CommandMenu />
        <SiteEffects />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
