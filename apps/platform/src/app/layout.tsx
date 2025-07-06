import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/lib/trpc/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Civalgo",
  description: "Civalgo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-zinc-100 ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <NuqsAdapter>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
