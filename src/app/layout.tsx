import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://celpipwritingpractice.com"),
  title: {
    default: "CELPIP Writing Practice | Practice CELPIP Writing with AI Evaluation",
    template: "%s | CELPIP Writing Practice",
  },
  description:
    "Practice CELPIP writing tasks (Email and Survey Response) with AI evaluation. Timer, 10 example questions per task, and progress tracking. Best, worst, and average scores.",
  keywords: ["CELPIP", "writing", "practice", "English", "exam", "evaluation", "Task 1", "Task 2"],
  openGraph: {
    title: "CELPIP Writing Practice",
    description: "Free AI-powered CELPIP writing practice with instant feedback. Timer, 20 practice questions, and progress tracking.",
    type: "website",
    siteName: "CELPIP Writing Practice",
    locale: "en_US",
    url: "https://celpipwritingpractice.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CELPIP Writing Practice",
    description: "Free AI-powered CELPIP writing practice with instant feedback.",
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
      </body>
    </html>
  );
}
