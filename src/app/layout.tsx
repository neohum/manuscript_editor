import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/common/SiteHeader";
import { auth } from "@/../auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "원고지 박살내기 - 한글 딕테이션 훈련장",
  description: "한국어 맞춤법, 띄어쓰기, 200자 원고지 작성법 훈련 오픈소스 교육 플랫폼",
  openGraph: {
    title: '원고지 박살내기 - 한글 딕테이션 훈련장',
    description: '아이들과 성인을 위한 200자 원고지 작성법, 맞춤법 훈련 플랫폼',
    url: 'https://little-tolstoy.example.com',
    siteName: '원고지 박살내기',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
      </head>
      <body className="h-full flex flex-col m-0 p-0 overflow-hidden">
        <SiteHeader session={session} />
        <div className="flex-1 overflow-auto bg-[#f8f6f0]">
          {children}
        </div>
      </body>
    </html>
  );
}
