// app/layout.tsx or pages/_app.tsx (depending on your Next.js setup)
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SessionAuthProvider from "./components/Providers";

const mont = Montserrat({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Lens Link",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionAuthProvider>
      <html lang="en">
        <body className="layout">{children}</body>
      </html>
    </SessionAuthProvider>
  );
}
