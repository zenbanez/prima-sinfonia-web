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
  applicationName: "Prima Sinfonia Music School",
  // Link previews on Facebook, Messenger, Viber and X. The share image and
  // the icons are the files beside this layout (opengraph-image.png,
  // twitter-image.png, icon.png, apple-icon.png, favicon.ico).
  openGraph: {
    type: "website",
    siteName: "Prima Sinfonia Music School",
    locale: "en_PH",
    title: "Prima Sinfonia Music School — Tacloban City",
    description:
      "Music classes for all ages in Tacloban City: piano, vocals, violin, cello and musical theatre. An officially affiliated London College of Music examination location.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prima Sinfonia Music School — Tacloban City",
    description:
      "Music classes for all ages in Tacloban City: piano, vocals, violin, cello and musical theatre.",
  },
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
