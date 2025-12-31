import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const OpenRunde = localFont({
  src: [
    {
      path: './OpenRunde-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './OpenRunde-Medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './OpenRunde-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './OpenRunde-Semibold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
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
