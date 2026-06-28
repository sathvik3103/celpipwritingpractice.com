import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "Free CELPIP writing practice for Email and Survey tasks with AI feedback, timer, and progress tracking.";

export const metadata: Metadata = {
  metadataBase: new URL("https://celpipwritingpractice.com"),
  title: {
    default: "CELPIP Writing Practice",
    template: "%s | CELPIP Writing Practice",
  },
  description: siteDescription,
  keywords: ["CELPIP", "writing", "practice", "English", "exam", "evaluation", "Task 1", "Task 2"],
  openGraph: {
    title: "CELPIP Writing Practice",
    description: siteDescription,
    type: "website",
    siteName: "CELPIP Writing Practice",
    locale: "en_US",
    url: "https://celpipwritingpractice.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CELPIP Writing Practice",
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
