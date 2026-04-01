"use client";

export function CorrectionSession({ onSubmit, durationSec }: { onSubmit: () => void, durationSec: number }) {
  return (
    <div className="bg-[#475569] w-full text-white p-3 shadow-md flex justify-between items-center z-40 sticky top-0 relative border-t border-slate-700">
      <div className="flex items-center justify-between mx-auto w-full px-2 max-w-[1500px]">
        <div className="font-bold text-base md:text-lg font-serif whitespace-nowrap text-amber-300 flex items-center gap-2">
           <i className="fi fi-rr-edit-alt"></i> <span className="hidden sm:inline">교정 진행중</span>
        </div>
        
        <div className="flex-1 flex max-w-2xl bg-slate-800/50 rounded-full px-4 py-2 items-center justify-center text-sm overflow-hidden shadow-inner ml-4 mr-4">
          <span className="text-gray-300 hidden md:inline mr-4">오류를 찾아 클릭하여 알맞게 교정하세요.</span>
          <span className="text-amber-200 font-bold tracking-widest bg-slate-900/50 px-3 py-1 rounded">
            {Math.floor(durationSec / 60).toString().padStart(2, '0')}:{(durationSec % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <button 
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 ml-2"
        >
          제출 및 점수 확인 ✓
        </button>
      </div>
    </div>
  );
}
