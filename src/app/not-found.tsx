import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in-up">
      <div className="text-[120px] font-black text-indigo-50 leading-none mb-4 absolute -z-10 select-none">
        404
      </div>
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-lg text-center relative z-10">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
          <i className="fi fi-rr-search-location"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-4">페이지를 찾을 수 없어요.</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          요청하신 페이지의 주소가 잘못되었거나,<br/>
          현재 삭제되어 이용할 수 없는 페이지입니다.
        </p>
        <Link
          href="/"
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5"
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
}
