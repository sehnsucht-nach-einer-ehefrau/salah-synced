import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/components/LocationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salah Synced",
  description: "A simple scheduling app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LocationProvider>
          <main className="flex items-center justify-center min-h-screen">
            {children}
          </main>
        </LocationProvider>
      </body>
    </html>
  );
}
