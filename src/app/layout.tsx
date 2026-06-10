import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import { clerkAuthProps } from "@/lib/auth-routes";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThumbBoost - YouTube Packaging Intelligence",
  description:
    "CTR-focused thumbnail and title packaging preflight for YouTube creators. Score ideas, generate mobile-first variants, and ship stronger videos.",
  openGraph: {
    title: "ThumbBoost - YouTube Packaging Intelligence",
    description:
      "Score YouTube packaging ideas, generate CTR-focused thumbnail variants, and export mobile-first creator thumbnails.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <ClerkProvider {...clerkAuthProps}>
          <AppProviders>{children}</AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
