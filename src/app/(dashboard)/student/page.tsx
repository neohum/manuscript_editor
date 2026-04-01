"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentDashboard() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
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

  const handleJoinClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || joinCode.length < 6) {
      setMessage('정확한 6자리 초대 코드를 입력해주세요.');
      return;
    }
    
    try {
      setMessage('');
      const res = await fetch('/api/classrooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: joinCode.trim() })
      });
      const data = await res.json();
      
      if (res.ok) {
        setJoinCode('');
        setMessage('✅ 성적으로 학급에 가입되었습니다!');
        fetchClassrooms();
      } else {
        setMessage('❌ ' + (data.message || '가입 실패'));
      }
    } catch (err) {
      console.error(err);
      setMessage('서버 통신 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-800">내 학습 그룹</h1>
          <p className="text-slate-500 mt-2">선생님께 받은 초대 코드로 학급에 입장하세요.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4">
        <h3 className="text-lg font-bold text-slate-700">새 학급 가입하기</h3>
        <form onSubmit={handleJoinClassroom} className="flex flex-col sm:flex-row gap-4 w-full">
          <input 
            type="text" 
            placeholder="초대 코드 6자리 입력"
            maxLength={6}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono font-bold text-center sm:text-left focus:ring-2 focus:ring-indigo-500 outline-none uppercase tracking-widest"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button 
            type="submit" 
            className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
            disabled={!joinCode.trim()}
          >
            입장하기
          </button>
        </form>
        {message && <div className={`text-sm font-bold ${message.includes('가입 성공') ? 'text-emerald-600' : 'text-rose-500'}`}>{message}</div>}
      </div>

      <div className="pt-4 space-y-4">
        <h3 className="text-lg font-bold text-slate-700">내가 가입한 학급 목록</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
              아직 가입한 학급이 없습니다.<br/>위에서 초대 코드를 입력해 보세요.
            </div>
          ) : (
            classrooms.map((room) => (
              <Link href="/editor" key={room.id} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex items-center justify-between group hover:shadow-lg hover:-translate-y-1 transition-all">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                    <i className="fi fi-rr-backpack text-indigo-500"></i> {room.name}
                  </h4>
                  <div className="text-xs font-semibold text-slate-400 mt-2">
                    가입일: {new Date(room.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors cursor-pointer" title="원고지 글쓰기로 가기">
                  <i className="fi fi-rr-angle-right"></i>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
