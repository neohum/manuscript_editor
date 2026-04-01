"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/stores/editorStore";
import { ManuscriptEditor } from "@/components/manuscript/ManuscriptEditor";
import { useTimer } from "@/hooks/useTimer";
import { SidePanel } from "@/components/training/SidePanel";
import { CorrectionSession } from "@/components/training/CorrectionSession";
import { calculateScore } from "@/lib/scoring";

type Problem = {
  id: string;
  level: number;
  mode: string;
  title: string;
  content: string;
  errorHints: { tips: string[], wrongText: string };
};

export default function CorrectionWorkspace() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { durationSec, start, stop } = useTimer();
  const { text, setText, violations } = useEditorStore();

  useEffect(() => {
    fetch(`/api/problems/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Problem not found");
        return res.json();
      })
      .then((data) => {
        setProblem(data);
        setText(data.errorHints?.wrongText || ""); // Initialize with wrong text
        setLoading(false);
        start();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitScore = async () => {
    if (!problem || isSubmitting) return;
    setIsSubmitting(true);
    stop();

    const activeViolationsCount = violations.length;
    const result = calculateScore(problem.content, text, activeViolationsCount);
    
    try {
      const sessionRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          mode: 'correction',
          score: result.score,
          durationSec,
          finalText: text
        })
      });

      if (!sessionRes.ok) {
        if (sessionRes.status === 401) {
          // Guest User Fallback: Save to Local Storage (Web Local DB)
          const localSessionId = `local_${Date.now()}`;
          
          const localErrors = violations.map(v => ({
            cellIndex: v.cellIndex,
            errorType: v.type,
            wrongText: v.message || ''
          }));

          const pseudoSession = {
            session: {
              id: localSessionId,
              problemId: problem.id,
              mode: 'correction',
              score: result.score,
              durationSec,
              finalText: text,
              problem: problem
            },
            errors: localErrors
          };

          localStorage.setItem(`guest_session_${localSessionId}`, JSON.stringify(pseudoSession));
          router.push(`/training/results/${localSessionId}`);
          return;
        }
        
        throw new Error('Session creation failed');
      }

      const sessionData = await sessionRes.json();
      const sessionId = sessionData.session.id;

      const errors = violations.map(v => ({
        cellIndex: v.cellIndex,
        errorType: v.type,
        wrongText: v.message || '',
        correctText: ''
      }));

      if (errors.length > 0) {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, errors })
        });
      }

      router.push(`/training/results/${sessionId}`);
    } catch (err) {
      console.error(err);
      alert('학습 결과를 저장하는 도중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-500 font-bold font-serif text-xl animate-pulse">문제를 불러오는 중...</div>;
  }

  if (!problem) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-red-500 font-bold font-serif text-xl">문제를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden font-sans relative">
      <CorrectionSession 
        durationSec={durationSec}
        onSubmit={handleSubmitScore} 
      />

      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600 mb-4"></div>
            <p className="text-lg font-bold text-gray-800">결과 저장 및 채점 중...</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <SidePanel />

        <main className="flex-1 overflow-y-auto w-full p-8 md:p-12 pb-32 flex flex-col items-center">
          <div className="max-w-5xl w-full mb-6">
            <h1 className="text-2xl font-bold font-serif text-gray-800">
              {problem.title} 
              <span className="ml-3 text-sm font-sans bg-amber-100 text-amber-800 px-2 py-1 rounded">Lv. {problem.level}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">제시된 원고지에는 맞춤법과 띄어쓰기 오류가 있습니다. 잘못된 부분을 찾아 올바르게 고쳐보세요!</p>
          </div>
          <ManuscriptEditor />
        </main>
      </div>
    </div>
  );
}
