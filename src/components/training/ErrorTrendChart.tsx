"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ErrorTrendChart({ data }: { data: { date: string; score: number, mode: string }[] }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-400 bg-gray-50 rounded-xl font-medium border border-gray-100">충분한 학습 기록이 없습니다.</div>;
  }

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-center font-bold text-gray-700 mb-2 font-serif text-lg">최근 성적 성장 추이 (최대 20건)</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#94a3b8'}} tickLine={false} axisLine={false} width={40} />
          <Tooltip 
            formatter={(val: any) => [`${val}점`, '취득 점수']}
            wrapperStyle={{ outline: 'none' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '500' }}/>
          <Line 
            type="monotone" 
            dataKey="score" 
            name="종합 채점 점수" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
