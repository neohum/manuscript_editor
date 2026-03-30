import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7] flex flex-col items-center py-20 px-6 font-sans">
      <div className="w-full max-w-3xl bg-white border border-blue-200 rounded-2xl p-12 text-center shadow-sm">
        <span className="text-6xl mb-6 block text-blue-600 drop-shadow-sm"><i className="fi fi-rr-book-alt"></i></span>
        <h1 className="text-3xl font-bold text-slate-800 mb-4 font-serif">원고지 규칙 학습</h1>
        <p className="text-slate-600 mb-8 text-lg">
          들여쓰기, 마침표, 따옴표 등 원고지 작성 규칙을 단계별로 학습할 수 있는 교육 모듈입니다.<br/>
          (현재 준비 중입니다)
        </p>
        <Link href="/">
          <button className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold shadow-sm">
            메인으로 돌아가기
          </button>
        </Link>
      </div>
    </div>
  );
}
