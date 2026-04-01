"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-rose-100 flex flex-col items-center max-w-lg text-center">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
          <i className="fi fi-rr-triangle-warning"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-4">앗! 오류가 발생했습니다.</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          예상치 못한 문제가 발생했습니다.<br/>
          인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-rose-200"
          >
            다시 시도하기
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
