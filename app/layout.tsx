import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FureverCare AI — Rescue Injured Animals Faster",
  description:
    "AI-powered animal rescue platform connecting citizens with nearby rescue NGOs in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
