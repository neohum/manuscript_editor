import Link from 'next/link';

export default function CorrectionPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7] flex flex-col items-center py-20 px-6 font-sans">
      <div className="w-full max-w-3xl bg-white border border-rose-200 rounded-2xl p-12 text-center shadow-sm">
        <span className="text-6xl mb-6 block text-rose-600 drop-shadow-sm"><i className="fi fi-rr-bullseye"></i></span>
        <h1 className="text-3xl font-bold text-slate-800 mb-4 font-serif">오류 교정 퀴즈</h1>
        <p className="text-slate-600 mb-8 text-lg">
          잘못 쓰여진 원고지의 띄어쓰기, 문장부호, 맞춤법을 찾아내 클릭으로 교정하는 퀴즈 모듈입니다.<br/>
          (현재 퀴즈 시스템을 준비 중입니다)
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
