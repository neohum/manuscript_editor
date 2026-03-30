import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/common/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "원고지 박살내기",
  description: "한국어 맞춤법, 띄어쓰기, 200자 원고지 작성법 훈련 에디터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
      </head>
      <body className="h-full flex flex-col m-0 p-0 overflow-hidden">
        <SiteHeader />
        <div className="flex-1 overflow-auto bg-[#f8f6f0]">
          {children}
        </div>
      </body>
    </html>
  );
}
