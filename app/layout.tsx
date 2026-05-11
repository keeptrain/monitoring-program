import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/app/providers";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Program Prioritas DJPB",
  description: "Platform monitoring program prioritas KKP",
  icons: {
    icon: "/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full antialiased",
        inter.variable,
        geistSans.variable,
        geistMono.variable,
        geistHeading.variable,
      )}
    >
      <body className="bg-background text-foreground min-h-full">
        <Providers>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Providers>
        <Toaster position="top-center" closeButton />
      </body>
    </html>
  );
}
