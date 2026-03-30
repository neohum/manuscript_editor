"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useEditorStore } from "@/stores/editorStore";
import { ManuscriptEditor } from "@/components/manuscript/ManuscriptEditor";
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
  
  // UI State
  const [scoreResult, setScoreResult] = useState<any>(null);

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
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitScore = () => {
    if (!problem) return;
    
    // The violation count corresponds to actively tracked rule breaks!
    // Every deduplicated rule error in the array costs points.
    const activeViolationsCount = violations.length;

    const result = calculateScore(problem.content, text, activeViolationsCount);
    setScoreResult(result);
  };

  const handleRetry = () => {
    setScoreResult(null);
    setText(""); // Reset text board
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

      <ScoreBoard 
        result={scoreResult} 
        targetContent={problem.content} 
        submittedContent={text} 
        onRetry={handleRetry} 
      />
    </div>
  );
}
