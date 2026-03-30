"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname();
  
  let subMenu = null;
  if (pathname.startsWith('/dictation')) {
    subMenu = (
      <Link href="/dictation" className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-white">
        <i className="fi fi-rr-headphones"></i> 받아쓰기 모드
      </Link>
    );
  } else if (pathname.startsWith('/rules')) {
    subMenu = (
      <Link href="/rules" className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-white">
        <i className="fi fi-rr-book-alt"></i> 규칙 학습
      </Link>
    );
  } else if (pathname.startsWith('/editor')) {
    subMenu = (
      <Link href="/editor" className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-white">
        <i className="fi fi-rr-edit"></i> 자유 연습
      </Link>
    );
  } else if (pathname.startsWith('/correction')) {
    subMenu = (
      <Link href="/correction" className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-white">
        <i className="fi fi-rr-bullseye"></i> 교정 퀴즈
      </Link>
    );
  }

  return (
    <header className="bg-[#1e293b] w-full text-white p-4 shadow-md z-50 sticky top-0">
      <div className="flex items-center justify-between mx-auto w-full px-2 max-w-[1500px]">
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="logo" className="w-8 h-8 filter brightness-0 invert opacity-90" />
            <span className="font-bold text-lg font-serif tracking-tight">원고지 박살내기</span>
          </Link>
          
          {subMenu && (
            <>
              <div className="h-5 w-px bg-slate-600 opacity-50 hidden sm:block"></div>
              
              <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-300">
                {subMenu}
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
