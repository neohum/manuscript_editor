"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/classrooms');
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) router.replace('/');
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setClassrooms(data.classrooms || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    try {
      const res = await fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoomName.trim() })
      });
      if (res.ok) {
        setNewRoomName('');
        fetchClassrooms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-800">학급 관리 센터</h1>
          <p className="text-slate-500 mt-2">새로운 반을 만들고 학생들을 초대하세요.</p>
        </div>
        <Link 
          href="/teacher/problems/new" 
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
        >
          <i className="fi fi-rr-edit-alt"></i> 커스텀 문제 출제
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleCreateClassroom} className="flex gap-4 w-full">
          <input 
            type="text" 
            placeholder="예시) 1학년 2반, 방과후 글쓰기반"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
            disabled={!newRoomName.trim()}
          >
            새 학급 개설하기
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {classrooms.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
            아직 개설된 학급이 없습니다.<br/>위에서 이름을 입력하고 [새 학급 개설하기]를 눌러보세요!
          </div>
        ) : (
          classrooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 group">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{room.name}</h3>
                <div className="text-xs font-semibold text-slate-400 mb-6">
                  생성일: {new Date(room.createdAt).toLocaleDateString()}
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute -top-2 bg-slate-50 px-2 left-2">초대 코드</span>
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-2xl font-black text-indigo-700 tracking-[0.2em]">{room.inviteCode}</span>
                    <button 
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                      title="코드 복사"
                      onClick={() => navigator.clipboard.writeText(room.inviteCode)}
                    >
                      <i className="fi fi-rr-copy text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
              <Link href={`/teacher/classrooms/${room.id}`} className="block bg-slate-50 border-t border-slate-100 px-6 py-3 text-sm font-semibold text-indigo-600 flex justify-between items-center group-hover:bg-indigo-50 cursor-pointer transition-colors">
                학생 관리 들어가기 <span>→</span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
