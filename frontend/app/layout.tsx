import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ToastProvider from "@/components/common/Toast/ToastProvider";
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
  title: "메타몽 카페 💜",
  description: "말랑말랑한 메타몽 바리스타가 직접 내려주는 달콤한 커피 타임!",
  icons: {
    icon: "/images/ditto/favicon-ditto.png",
  },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
