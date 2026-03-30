"use client";

import { useEditorStore } from '@/stores/editorStore';
import { ErrorExplanationPopup } from './ErrorExplanationPopup';

export function SidePanel() {
  const { text, cursorCell, errorCells, violations } = useEditorStore();
  
  const charCount = text.length;
  const noSpaceCount = text.replace(/\s/g, '').length;
  const errCount = errorCells.size;

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col font-sans h-full shadow-sm">
      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold mb-4 font-serif text-gray-800 border-b pb-2">작성 현황</h2>
        
        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span>공백 포함</span>
            <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">{charCount} 자</span>
          </div>
          <div className="flex justify-between items-center">
            <span>공백 제외</span>
            <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">{noSpaceCount} 자</span>
          </div>
          <div className="flex justify-between items-center">
            <span>현재 위치</span>
            <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">
              {cursorCell !== null ? `${cursorCell + 1}칸` : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center text-red-600 mt-2">
            <span className="font-medium">감지된 오류</span>
            <span className="font-mono font-bold bg-red-50 text-red-700 px-2 py-1 rounded">{errCount} 건</span>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-[#fcf9f2] p-4 rounded-lg border border-[#e6decb]">
        <h3 className="font-bold mb-3 text-sm text-[#8c7345]">💡 원고지 작성 기본 규칙</h3>
        <ul className="text-xs text-gray-700 list-inside flex flex-col gap-2">
          <li className="flex gap-2">
            <span>📝</span> <span>문단 시작 시 첫 칸은 <strong>비웁니다.</strong> (들여쓰기)</span>
          </li>
          <li className="flex gap-2">
            <span>📝</span> <span>숫자 두 자리나 영문 알파벳 소문자 두 글자는 <strong>한 칸에 함께</strong> 씁니다.</span>
          </li>
          <li className="flex gap-2">
            <span>📝</span> <span>마침표(.)나 쉼표(,) 등은 원칙적으로 구석에 기입하며, 행의 <strong>첫 칸에 올 수 없습니다.</strong></span>
          </li>
        </ul>
      </div>

      <ErrorExplanationPopup cursorCell={cursorCell} violations={violations} />
      </div>

      <div className="p-6 pt-4 border-t border-gray-100 bg-white flex flex-col gap-3 shrink-0">
        <button 
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-md shadow-sm transition-all text-sm"
          onClick={() => alert("MVP 자유 작성 환경입니다. 임시 저장되었습니다.")}
        >
          진행 상태 임시저장
        </button>
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-sm transition-all text-sm"
          onClick={() => alert("MVP 자유 작성 환경에서는 제출이 불가능합니다.")}
        >
          작성 완료 / 제출
        </button>
      </div>
    </aside>
  );
}
