import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const OpenRunde = localFont({
  src: [
    {
      path: '../public/fonts/OpenRunde-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/OpenRunde-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/OpenRunde-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/OpenRunde-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-openrunde',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Placer",
  description: "Your Education Ai-fied",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${OpenRunde} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
