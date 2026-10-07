import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Independent AI Platform",
  description: "Goal-driven AI workspace with its own API and replaceable model layer."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
