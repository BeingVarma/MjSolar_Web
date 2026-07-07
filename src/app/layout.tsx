import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AdminConfigProvider } from "@/context/AdminConfigContext";

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
      <body className="min-h-full flex flex-col font-inter bg-obsidian text-slate-light overflow-x-hidden selection:bg-rose selection:text-white">
        <AdminConfigProvider>
          {children}
        </AdminConfigProvider>
      </body>
    </html>
  );
}
