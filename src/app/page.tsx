import Link from 'next/link';

export default function Home() {
  const modes = [
    {
      title: "자유 작성 연습",
      description: "형식이나 글자 수 제한 없이 백지 원고지에 마음껏 글을 적어보며 감각을 익혀보세요.",
      href: "/editor",
      icon: <i className="fi fi-rr-edit"></i>,
      theme: "group hover:bg-amber-50 border border-amber-200 shadow-amber-900/5",
      iconBg: "bg-amber-100/60 text-amber-700",
    },
    {
      title: "원고지 규칙 학습",
      description: "문단 들여쓰기, 마침표, 따옴표 위치 등 필수적인 원고지 작성 규칙을 단계별로 배웁니다.",
      href: "/rules",
      icon: <i className="fi fi-rr-book-alt"></i>,
      theme: "group hover:bg-blue-50 border border-blue-200 shadow-blue-900/5",
      iconBg: "bg-blue-100/60 text-blue-700",
    },
    {
      title: "받아쓰기 훈련",
      description: "제시된 문장이나 음성을 듣고, 원고지 규격과 맞춤법에 올바르게 맞추어 적어보세요.",
      href: "/dictation",
      icon: <i className="fi fi-rr-headphones"></i>,
      theme: "group hover:bg-emerald-50 border border-emerald-200 shadow-emerald-900/5",
      iconBg: "bg-emerald-100/60 text-emerald-700",
    },
    {
      title: "오류 교정 퀴즈",
      description: "이미 작성된 잘못된 원고지에서 틀린 맞춤법과 형식을 직접 찾아내고 교정하세요.",
      href: "/correction",
      icon: <i className="fi fi-rr-bullseye"></i>,
      theme: "group hover:bg-rose-50 border border-rose-200 shadow-rose-900/5",
      iconBg: "bg-rose-100/60 text-rose-700",
    }
  ];

  return (
    <div className="flex-1 w-full min-h-full bg-[#fffdf7] flex flex-col items-center py-12 px-6 font-sans">
      <header className="flex flex-col items-center gap-4 mb-16 mt-8 cursor-default">
        <div className="flex items-center gap-4 transition-transform hover:scale-105 duration-300">
          <img src="/logo.svg" alt="로고" className="w-16 h-16 drop-shadow-md" />
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-800 tracking-tight">원고지 박살내기</h1>
        </div>
        <p className="text-lg md:text-xl text-slate-500 font-medium">원고지 사용법과 맞춤법·띄어쓰기를 완벽하게 정복하세요</p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {modes.map((mode) => (
          <Link href={mode.href} key={mode.href}>
            <div className={`h-full bg-white rounded-2xl p-8 flex flex-col gap-5 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ${mode.theme}`}>
              <div className="flex items-center gap-4">
                <div className={`text-2xl w-14 h-14 rounded-xl flex items-center justify-center ${mode.iconBg} transition-transform group-hover:scale-110 duration-300`}>
                  {mode.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{mode.title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed pt-2">
                {mode.description}
              </p>
              
              <div className="mt-auto pt-6 flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                모드 시작하기 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </main>

      <footer className="mt-20 text-sm text-slate-400 font-medium">
        © 2026 Manuscript Trainer Project.
      </footer>
    </div>
  );
}
