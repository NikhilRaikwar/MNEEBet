import type { Metadata } from "next";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MNEEBet | THE ARENA",
  description: "High-stakes peer-to-peer betting protocol.",
  openGraph: {
    title: "MNEEBet | THE ARENA",
    description: "High-stakes peer-to-peer betting protocol.",
    images: [
      {
        url: "/mneebet.png",
        width: 1200,
        height: 630,
        alt: "MNEEBet Arena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MNEEBet | THE ARENA",
    description: "High-stakes peer-to-peer betting protocol.",
    images: ["/mneebet.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="dark">
        <body
          className={`${syne.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#050505] text-[#e0e0e0] selection:bg-[#ccff00] selection:text-black`}
        >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
