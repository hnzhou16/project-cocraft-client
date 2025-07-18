import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import MainLayout from "../components/layout/MainLayout";

const outfit = localFont({
  src: '../public/fonts/Outfit-VariableFont_wght.ttf',
  variable: "--font-outfit",
  // create CSS variable under root in globals.css, and automatically create font-profit class
  // :root {
  //   --font-outfit: 'Outfit__VariableFont_wght';
  // }
  // .font-outfit {
  //   font-family: var(--font-outfit);
  // }
  display: "swap", // prevent layout shifts
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
    <html lang="en" suppressHydrationWarning>
    {/* set font outfit variable instead of just classname on body element, so nextjs preload font, better performance,
    and the font becomes available to all child components */}
    <body
      className={`${outfit.variable} font-outfit`}
    >
    <ReduxProvider>
      <MainLayout>{children}</MainLayout>
    </ReduxProvider>
    </body>
    </html>
  );
}
