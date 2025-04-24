import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import MainLayout from "../components/layout/MainLayout";

const outfit = localFont({
  src: '../public/fonts/Outfit-VariableFont_wght.ttf',
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoCraft - Crafting Spaces, Together",
  description: "Connect with home builders, share your work, and get inspired",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-outfit antialiased`}
      >
        <ReduxProvider>
          <MainLayout>{children}</MainLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
