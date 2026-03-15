import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SignalWeaver - Deterministic AI Governance",
  description: "Policy-governance layer for AI agents. Truth Anchors, Gate Engine, Decision Trace, and Counterfactual Replay for enterprise AI compliance.",
  keywords: ["AI governance", "EU AI Act", "policy engine", "AI compliance", "deterministic AI"],
  authors: [{ name: "SignalWeaver" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SignalWeaver - Deterministic AI Governance",
    description: "Policy-governance layer for AI agents. Built for enterprise compliance.",
    url: "https://signalweaver.com",
    siteName: "SignalWeaver",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
