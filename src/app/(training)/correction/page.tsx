"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProblemSummary = {
  id: string;
  level: number;
  title: string;
};

export default function CorrectionPage() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/problems?mode=correction')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          data.sort((a, b) => a.level - b.level);
        }
        setProblems(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-[#fffdf7] font-sans">
      <div className="flex-1 flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-4xl flex flex-col items-center mb-12 cursor-default shrink-0">
        <span className="text-6xl mb-4 block drop-shadow-sm text-amber-600"><i className="fi fi-rr-edit-alt"></i></span>
        <h1 className="text-4xl font-bold text-slate-800 mb-4 font-serif tracking-tight">교정 퀴즈</h1>
        <p className="text-slate-500 text-lg font-medium text-center">
          미리 작성되어 있는 원고지에서 잘못된 맞춤법과 불규칙한 띄어쓰기를 찾아 클릭하여 올바르게 고쳐보세요.
        </p>
      </div>
      
      <div className="w-full max-w-4xl flex-1">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 opacity-60">
            <span className="text-4xl mb-4 text-amber-600"><i className="fi fi-rr-spinner animate-spin"></i></span>
            <span className="text-slate-500 font-medium tracking-wide">문제 세트를 불러오는 중...</span>
          </div>
        ) : problems.length === 0 ? (
          <div className="w-full bg-white border border-amber-200 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-slate-600 mb-8 text-lg">
              (현재 교정 문제 세트가 없습니다)
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold shadow-sm">
                메인으로 돌아가기
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map(p => (
              <Link 
                key={p.id} 
                href={`/correction/${p.id}`}
                className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-amber-300 transition-all duration-300 flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-amber-600 mb-1 block uppercase tracking-wider">Level {p.level}</span>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-700 transition-colors">{p.title}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                  <i className="fi fi-rr-pencil text-sm"></i>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 text-sm text-slate-400 font-medium mb-8">
        <Link href="/" className="hover:text-slate-600 transition-colors underline underline-offset-4">메인으로 돌아가기</Link>
      </footer>
      </div>
    </div>
  );
}
