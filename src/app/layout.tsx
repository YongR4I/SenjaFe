import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Senja — Smart Workplace Solutions",
  description:
    "Technology solutions that connect people, spaces, and ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
