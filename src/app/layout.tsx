import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AdminConfigProvider } from "@/context/AdminConfigContext";
import { I18nProvider } from "@/context/I18nContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MjSolar | Premium Solar Energy",
  description: "Pure Solar Energy. Engineered in 72 Hours. Powering premium residences and commercial hubs with the world's highest-efficiency panels.",
  keywords: ["solar panels", "premium solar", "solar energy", "commercial solar", "residential solar", "MjSolar", "solar installation"],
  authors: [{ name: "MjSolar" }],
  openGraph: {
    title: "MjSolar | Premium Solar Energy",
    description: "Pure Solar Energy. Engineered in 72 Hours. Powering premium residences and commercial hubs with the world's highest-efficiency panels.",
    url: "https://mjsolar.com",
    siteName: "MjSolar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MjSolar - Premium Solar Energy",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MjSolar | Premium Solar Energy",
    description: "Pure Solar Energy. Engineered in 72 Hours.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mjsolar.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "MjSolar",
  "image": "https://mjsolar.com/og-image.jpg",
  "url": "https://mjsolar.com",
  "telephone": "+919876543210",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Premium Solar Hub",
    "addressLocality": "Mumbai",
    "postalCode": "400001",
    "addressCountry": "IN"
  },
  "description": "Pure Solar Energy. Engineered in 72 Hours."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-inter bg-obsidian text-slate-light overflow-x-hidden selection:bg-rose selection:text-white">
        <I18nProvider>
          <AdminConfigProvider>
            {children}
          </AdminConfigProvider>
        </I18nProvider>
        
        {/* Global Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-MJSOLAR2026`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MJSOLAR2026', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
