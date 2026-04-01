"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ScoreBoard } from '@/components/training/ScoreBoard';
import { calculateScore } from '@/lib/scoring';
import Link from 'next/link';
import { useEditorStore } from '@/stores/editorStore';

export default function ResultPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setText } = useEditorStore();

  useEffect(() => {
    if (sessionId.startsWith('local_')) {
      // Guest User Fallback: Load from Local Storage
      const localData = localStorage.getItem(`guest_session_${sessionId}`);
      if (localData) {
        setData(JSON.parse(localData));
      }
      setLoading(false);
      return;
    }

    // Authenticated User: Load from Database
    fetch(`/api/sessions/${sessionId}`)
      .then(res => res.json())
      .then(json => {
        if (json.session) {
          setData(json);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
     return (
       <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
         <div className="animate-spin border-indigo-600 border-t-4 h-12 w-12 rounded-full mb-4" />
         <p className="font-bold text-gray-500 font-serif">결과를 불러오는 중입니다...</p>
       </div>
     );
  }

  if (!data?.session) {
     return (
       <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
         <p className="text-red-500 font-bold mb-4">해당 학습 결과를 찾을 수 없거나 권한이 없습니다.</p>
         <Link href="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">메인으로 돌아가기</Link>
       </div>
     );
  }

  const { session, errors } = data;
  const targetContent = session.problem?.content || '';
  const submittedContent = session.finalText || '';
  
  const result = calculateScore(targetContent, submittedContent, errors?.length || 0);

  const handleRetry = () => {
    setText(""); // Reset editor side-effect
    if (session.mode === 'correction') {
      router.push(`/correction/${session.problemId}`);
    } else {
      router.push(`/dictation/${session.problemId}`);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center overflow-hidden">
      <ScoreBoard 
        result={result}
        targetContent={targetContent}
        submittedContent={submittedContent}
        onRetry={handleRetry}
        mode={session.mode}
      />
    </div>
  );
}
