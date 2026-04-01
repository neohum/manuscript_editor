"use client";

import { useEffect, useState } from 'react';
import { ErrorDistributionChart } from '@/components/training/ErrorDistributionChart';
import { ErrorTrendChart } from '@/components/training/ErrorTrendChart';
import Link from 'next/link';

export default function ReportsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/me')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col w-full">
        <div className="animate-spin border-indigo-600 border-t-4 h-12 w-12 rounded-full mb-4" />
        <p className="font-bold text-gray-500">리포트 데이터를 분석 중입니다...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col w-full text-red-500 font-bold">오류: 데이터를 불러올 수 없습니다.</div>;
  }

  const { trends, distribution } = data;
  
  const totalSessions = trends.length;
  const recentScore = totalSessions > 0 ? trends[trends.length - 1].score : 0;
  const averageScore = totalSessions > 0 ? Math.round(trends.reduce((acc: number, cur: any) => acc + cur.score, 0) / totalSessions) : 0;

  // errorType dictionary localization if needed, since types are currently like 'indentation', 'spelling'
  const typeLabels: Record<string, string> = {
    'indent': '들여쓰기',
    'punctuation': '문장부호',
    'quote': '따옴표',
    'lineEnd': '행말 규칙',
    'spacing': '띄어쓰기',
    'spelling': '맞춤법',
    'numberAlpha': '숫자/영문 표기',
  };

  const localizedDist = distribution.map((d: any) => ({
    ...d,
    type: typeLabels[d.type] || d.type
  }));

  let mostFrequentError = "분석 불가";
  if (localizedDist.length > 0) {
    const highest = localizedDist.reduce((prev: any, current: any) => (prev.count > current.count) ? prev : current);
    mostFrequentError = highest.type;
  } else if (totalSessions > 0) {
    mostFrequentError = "완벽함!";
  }

  return (
    <div className="flex-1 bg-[#f8fafc] overflow-y-auto w-full font-sans min-h-screen">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-800">나의 맞춤법 분석 리포트</h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">최근 훈련 데이터를 기반으로 도출된 성적표입니다.</p>
          </div>
          <Link href="/" className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 text-sm">
            <i className="fi fi-rr-home"></i> 메인 화면으로
          </Link>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
            <span className="text-slate-400 font-bold text-sm mb-1 tracking-wider">최근 종합 점수</span>
            <div className="text-4xl font-black text-slate-800">{recentScore}<span className="text-2xl text-slate-400 font-medium ml-1">점</span></div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
            <span className="text-slate-400 font-bold text-sm mb-1 tracking-wider">최근 {totalSessions}회 평균 성적</span>
            <div className="text-4xl font-black text-indigo-600">{averageScore}<span className="text-2xl text-indigo-300 font-medium ml-1">점</span></div>
          </div>
          <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 shadow-sm flex flex-col justify-center">
            <span className="text-rose-400 font-bold text-sm mb-1 tracking-wider">가장 취약한 항목</span>
            <div className="text-2xl font-black text-rose-700 md:text-3xl break-keep">{mostFrequentError}</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ErrorTrendChart data={trends} />
          <ErrorDistributionChart data={localizedDist} />
        </div>

      </div>
    </div>
  );
}
