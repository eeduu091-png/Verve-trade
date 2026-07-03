import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verve Trades PropOS",
  description: "Real-time prop firm trading operating system."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
