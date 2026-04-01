"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/stores/editorStore";
import { ManuscriptEditor } from "@/components/manuscript/ManuscriptEditor";
import { useTimer } from "@/hooks/useTimer";
import { SidePanel } from "@/components/training/SidePanel";
import { DictationSession } from "@/components/training/DictationSession";
import { ScoreBoard } from "@/components/training/ScoreBoard";
import { calculateScore } from "@/lib/scoring";

type Problem = {
  id: string;
  level: number;
  mode: string;
  title: string;
  content: string;
};

export default function DictationWorkspace() {
  const { id } = useParams() as { id: string };
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { durationSec, start, stop } = useTimer();

  // Store 
  const { text, setText, violations } = useEditorStore();

  useEffect(() => {
    // Reset editor on mount
    setText("");

    fetch(`/api/problems/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Problem not found");
        return res.json();
      })
      .then((data) => {
        setProblem(data);
        setLoading(false);
        start(); // Start the timer when loaded
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
    stop(); // Stop the timer

    const activeViolationsCount = violations.length;
    const result = calculateScore(problem.content, text, activeViolationsCount);
    
    try {
      // 1. Create session
      const sessionRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          mode: 'dictation',
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
              mode: 'dictation',
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

      // 2. Format and map active violations to errorLogs schema
      const errors = violations.map(v => ({
        cellIndex: v.cellIndex,
        errorType: v.type,
        wrongText: v.message || '',
        correctText: '' // In dictation, we might not always have the isolated correct character at hand this simply
      }));

      if (errors.length > 0) {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, errors })
        });
      }

      // 3. Redirect to the result scoreboard page
      router.push(`/training/results/${sessionId}`);

    } catch (err) {
      console.error(err);
      alert('학습 결과를 저장하는 도중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-500 font-bold font-serif text-xl animate-pulse">원고지 및 음원 불러오는 중...</div>;
  }

  if (!problem) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-red-500 font-bold font-serif text-xl">문제를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden font-sans relative">
      <DictationSession 
        content={problem.content} 
        onScoreClick={handleSubmitScore} 
      />

      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-lg font-bold text-gray-800">결과 저장 및 채점 중...</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Side Panel for Status and Errors (Moved to Left) */}
        <SidePanel />

        {/* Main Editor Section */}
        <main className="flex-1 overflow-y-auto w-full p-8 md:p-12 pb-32 flex flex-col items-center">
          <div className="max-w-5xl w-full mb-6">
            <h1 className="text-2xl font-bold font-serif text-gray-800">
              {problem.title} 
              <span className="ml-3 text-sm font-sans bg-blue-100 text-blue-800 px-2 py-1 rounded">Lv. {problem.level}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">안내되는 음성을 듣고 원고지 작성 규칙(들여쓰기, 부호, 띄어쓰기 등)에 유의하며 정확하게 작성하세요.</p>
          </div>
          <ManuscriptEditor />
        </main>
      </div>

    </div>
  );
}
