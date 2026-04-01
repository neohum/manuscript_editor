import { ManuscriptEditor } from "@/components/manuscript/ManuscriptEditor";

export default function FreeEditorPage() {
  return (
    <div className="w-full min-h-full py-12 px-8 flex flex-col items-center">
      <div className="w-full max-w-[1500px] flex flex-col gap-6">
        <header className="flex items-center justify-between border-b border-gray-300 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2"><i className="fi fi-rr-edit text-slate-700 mt-1"></i> 원고지 연습 (자유 작성)</h1>
          </div>
          <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
            <i className="fi fi-rr-leaf mr-1"></i> 자유 모드
          </span>
        </header>

        <p className="text-gray-700 leading-relaxed text-sm bg-white p-4 rounded-md shadow-sm border-l-4 border-blue-400">
          이곳에서는 글자수나 주제 제한 없이 원하는 글을 적어볼 수 있습니다.<br/>
          아래 원고지 화면의 아무 곳이나 클릭하시고 키보드로 글자를 입력하세요!
        </p>

        <div className="mt-8 w-full flex justify-center">
          <ManuscriptEditor enableTitleRule={true} />
        </div>
      </div>
    </div>
  );
}
