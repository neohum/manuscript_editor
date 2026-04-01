"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ErrorDistributionChart({ data }: { data: { type: string; count: number }[] }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-400 bg-gray-50 rounded-xl font-medium border border-gray-100">충분한 오답 기록이 없습니다.</div>;
  }

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-center font-bold text-gray-700 mb-2 font-serif text-lg">오류 취약점 분포</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="count"
            nameKey="type"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(val: any) => [`${val}회`, '오류 발견']}
            wrapperStyle={{ outline: 'none' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '500' }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
