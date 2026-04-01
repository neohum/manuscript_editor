"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProblemSummary = {
  id: string;
  level: number;
  title: string;
};

export default function DictationPage() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/problems?mode=dictation')
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
        <span className="text-6xl mb-4 block drop-shadow-sm text-emerald-600"><i className="fi fi-rr-headphones"></i></span>
        <h1 className="text-4xl font-bold text-slate-800 mb-4 font-serif tracking-tight">받아쓰기 훈련</h1>
        <p className="text-slate-500 text-lg font-medium text-center">
          제시되는 음성을 듣고 원고지 띄어쓰기와 맞춤법에 올바르게 맞추어 적어보세요.
        </p>
      </div>
      
      <div className="w-full max-w-4xl flex-1">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 opacity-60">
            <span className="text-4xl mb-4 text-emerald-600"><i className="fi fi-rr-spinner animate-spin"></i></span>
            <span className="text-slate-500 font-medium tracking-wide">문제 세트를 불러오는 중...</span>
          </div>
        ) : problems.length === 0 ? (
          <div className="w-full bg-white border border-emerald-200 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-slate-600 mb-8 text-lg">
              (현재 문제 세트가 없습니다)
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
                href={`/dictation/${p.id}`}
                className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-600 mb-1 block uppercase tracking-wider">Level {p.level}</span>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{p.title}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                  <i className="fi fi-rr-play text-sm"></i>
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
