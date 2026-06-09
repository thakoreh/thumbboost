import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThumbAI - AI YouTube Thumbnail Generator",
  description:
    "Trend-adaptive SaaS thumbnail generator for creators. Generate, edit, score, and export YouTube thumbnails with AI.",
  openGraph: {
    title: "ThumbAI - AI YouTube Thumbnail Generator",
    description:
      "Create vibrant YouTube thumbnails with AI, trend signals, quick editing, and high-res exports.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
