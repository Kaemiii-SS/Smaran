import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Smaran",
  description: "Dementia Care Game Suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} font-mono antialiased text-text-dark bg-background`}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
