import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Cinzel, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

// Public site typography, matched to the school's poster
const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://primasinfonia.banezglobal.com"),
  title: {
    default: "Prima Sinfonia Music School — Tacloban City",
    template: "%s | Prima Sinfonia Music School",
  },
  description:
    "Music classes for all ages in Tacloban City: piano, vocals, violin, cello and musical theatre. An officially affiliated London College of Music examination location.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${cinzel.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
