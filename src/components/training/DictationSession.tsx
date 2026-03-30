"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export function DictationSession({ content, onScoreClick }: { content: string, onScoreClick: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup audio and interval upon unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const playTTS = async () => {
    if (audioRef.current && isPlaying) {
      // Re-trigger from beginning if playing or simply ignore if we just want to stop
      return; 
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: content })
      });

      if (!response.ok) {
        throw new Error("TTS Request failed");
      }

      // Convert MP3 response to an Object URL to play seamlessly
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Stop old audio if any
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      // Create new audio element
      const audio = new Audio(url);
      audioRef.current = audio;

      let playCount = 1;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        if (playCount < 2 && audioRef.current === audio) {
          playCount++;
          setTimeout(() => {
            if (audioRef.current === audio) {
              audio.currentTime = 0;
              audio.play();
            }
          }, 1500); // 1.5 second silence between repetitions
        } else {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        }
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        alert("음원 재생을 실패했습니다.");
        URL.revokeObjectURL(url);
      };

      audio.play();

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsPlaying(false);
      alert("TTS 엔진 연결에 실패했습니다.");
    }
  };

  const startCountdown = () => {
    if (countdown !== null || isPlaying || isLoading) return;
    setCountdown(5);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          playTTS(); // Activate the TTS fetch & play
          return null; 
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setCountdown(null);
  };

  return (
    <>
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            key={countdown} 
            className="text-[15rem] md:text-[20rem] font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"
          >
            {countdown}
          </div>
        </div>
      )}
      
      <div className="bg-[#334155] w-full text-white p-3 shadow-md flex justify-between items-center z-40 sticky top-0 relative border-t border-slate-700">
        <div className="flex items-center justify-between mx-auto w-full px-2 max-w-[1500px]">
          
          <div className="font-bold text-base md:text-lg font-serif whitespace-nowrap text-emerald-400 flex items-center gap-2">
            <i className="fi fi-rr-headphones"></i> <span className="hidden sm:inline">받아쓰기 진행중</span>
          </div>
          
          {/* TTS Audio Controls */}
          <div className="flex-1 max-w-2xl bg-slate-800/50 rounded-full px-4 py-2 flex items-center justify-between text-sm overflow-hidden shadow-inner ml-4 mr-4">
            <span className="text-gray-300 truncate hidden md:inline">정확히 듣고 원고지 규칙대로 기입하세요.</span>
          <div className="flex gap-2 shrink-0">
            {isLoading ? (
              <button 
                disabled
                className="bg-gray-500 text-white rounded-full px-4 py-1.5 font-bold flex items-center gap-1 shadow-sm opacity-50 cursor-not-allowed"
              >
                ⟳ 준비 중...
              </button>
            ) : !isPlaying && countdown === null ? (
              <button 
                onClick={startCountdown}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-4 py-1.5 font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <i className="fi fi-rr-play text-sm mt-0.5"></i> 소리 듣기
              </button>
            ) : (
              <button 
                onClick={stopTTS}
                className="bg-red-500 hover:bg-red-400 text-white rounded-full px-4 py-1.5 font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                ⏹ 정지
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={onScoreClick}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 ml-2"
        >
          제출 및 채점하기 ✓
        </button>
      </div>
    </div>
    </>
  );
}
