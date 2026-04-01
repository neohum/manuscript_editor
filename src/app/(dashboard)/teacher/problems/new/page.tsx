"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ManuscriptEditor } from '@/components/manuscript/ManuscriptEditor';
import { useEditorStore } from '@/stores/editorStore';
import Link from 'next/link';

export default function NewProblemPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    level: 1,
    mode: 'dictation',
    content: '',
    wrongText: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Use the global editor store for the correct answer content
  const { text: editorText, setText: setEditorText } = useEditorStore();

  useEffect(() => {
    // Clear editor on load
    setEditorText('');
    return () => setEditorText('');
  }, [setEditorText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorText || !editorText.trim()) {
      setMessage('오류: 정답 문장을 원고지에 입력해주세요.');
      return;
    }
    setSaving(true);
    setMessage('');
    
    try {
      const payload = { ...form, content: editorText };
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setMessage('성공적으로 문제가 추가되었습니다.');
        setTimeout(() => router.push('/teacher'), 1500);
      } else {
        const data = await res.json();
        setMessage('오류가 발생했습니다: ' + (data.message || '저장 실패'));
      }
    } catch(err) {
      console.error(err);
      setMessage('네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-800">커스텀 문제 출제</h1>
          <p className="text-slate-500 mt-2">학생들에게 제시할 맞춤형 받아쓰기/교정 퀴즈를 직접 등록하세요.</p>
        </div>
        <Link href="/teacher" className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
          목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">문제 제목</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="예: 3학년 2학기 문학 지문 1"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">문제 유형</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  value={form.mode}
                  onChange={e => setForm({...form, mode: e.target.value})}
                >
                  <option value="dictation">받아쓰기 (듣고 쓰기)</option>
                  <option value="correction">원고지 교정 (틀린 글 고치기)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">권장 레벨 (난이도)</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  value={form.level}
                  onChange={e => setForm({...form, level: parseInt(e.target.value)})}
                >
                  <option value={1}>Lv.1 (초급)</option>
                  <option value={2}>Lv.2 (중급)</option>
                  <option value={3}>Lv.3 (고급)</option>
                  <option value={4}>Lv.4 (최상급)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-2" />

          {form.mode === 'correction' && (
            <div className="animate-fade-in-up">
              <label className="block text-sm font-bold text-rose-600 mb-2">제시될 [틀린 문장] (학생에게 보여질 화면)</label>
              <textarea 
                required 
                className="w-full h-24 px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                placeholder="학생들이 고쳐야 할 일부러 틀린 텍스트를 입력하세요. (띄어쓰기 오류, 맞춤법 오류 등)"
                value={form.wrongText}
                onChange={e => setForm({...form, wrongText: e.target.value})}
              ></textarea>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-sm font-bold text-indigo-700 mb-2">
              최종 [정답 문장] (원고지에 직접 입력)
            </label>
            <p className="text-xs text-slate-500 mb-4">아래 원고지 캔버스를 클릭하고 올바른 띄어쓰기와 맞춤법이 적용된 최종 정답을 바로 입력하세요.</p>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
              <ManuscriptEditor />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
            <div className={`font-bold ${message.includes('성공') ? 'text-emerald-600' : 'text-rose-500'}`}>
              {message}
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors min-w-[160px] flex justify-center items-center shadow-md shadow-indigo-600/20"
            >
              {saving ? <i className="fi fi-rr-spinner animate-spin text-xl"></i> : '문제 출제 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
