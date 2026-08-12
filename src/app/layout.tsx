import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Finance Suite",
  description: "Enterprise accounting and finance platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
