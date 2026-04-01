"use client";

import { useMemo } from 'react';
import { exportToCsv } from '@/lib/utils/csvExport';

interface StudentStat {
  id: string;
  name: string;
  level: number;
  xp: number;
  joinedAt: string;
  totalSessions: number;
  avgScore: number;
  recentScore: number;
  recentActivity: string | null;
}

interface Props {
  students: StudentStat[];
  classroomName: string;
}

export function StudentErrorTable({ students, classroomName }: Props) {
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => b.totalSessions - a.totalSessions);
  }, [students]);

  const handleDownload = () => {
    const rows = sortedStudents.map(s => ({
      이름: s.name,
      레벨: s.level,
      '누적 경험치': s.xp,
      '총 학습 횟수': s.totalSessions,
      '평균 점수': s.avgScore + '점',
      '최근 점수': s.recentScore + '점',
      '가입 날짜': new Date(s.joinedAt).toLocaleDateString(),
      '최근 활동': s.recentActivity ? new Date(s.recentActivity).toLocaleString() : '활동 없음'
    }));

    exportToCsv(`${classroomName}_학생리포트_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 font-serif">학급 통합 리포트</h3>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors border border-emerald-200"
        >
          <i className="fi fi-rr-file-download text-lg"></i>
          CSV 다운로드
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-500 font-medium">
              <th className="px-4 py-3 bg-slate-50 whitespace-nowrap">학생 이름</th>
              <th className="px-4 py-3 bg-slate-50 whitespace-nowrap">계급 (Lv/XP)</th>
              <th className="px-4 py-3 bg-slate-50 whitespace-nowrap text-center">학습 횟수</th>
              <th className="px-4 py-3 bg-slate-50 whitespace-nowrap text-center">평균 점수</th>
              <th className="px-4 py-3 bg-slate-50 whitespace-nowrap text-center">최근 점수</th>
              <th className="px-4 py-3 bg-slate-50 whitespace-nowrap text-right">최근 활동</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                  아직 가입한 학생이 없거나 학습 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              sortedStudents.map((s, idx) => (
                <tr key={s.id} className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-4 py-4 font-bold text-slate-800">{s.name}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
                      Lv.{s.level} <span className="opacity-50">|</span> {s.xp}xp
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-600">{s.totalSessions}회</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`font-black ${s.avgScore >= 90 ? 'text-emerald-500' : s.avgScore >= 70 ? 'text-indigo-500' : 'text-rose-500'}`}>
                      {s.avgScore}점
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-600">{s.recentScore}점</td>
                  <td className="px-4 py-4 text-right text-xs text-slate-400">
                    {s.recentActivity ? new Date(s.recentActivity).toLocaleString() : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
