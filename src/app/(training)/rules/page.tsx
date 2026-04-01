import Link from 'next/link';
import { ManuscriptViewer } from '@/components/manuscript/ManuscriptViewer';

export default function RulesPage() {
  // To show line-end rules clearly, we use exactly 20-cell padding logic for the bad/good
  const overflowPadding = "행말 규칙을 위한 패딩 글자수 채우기용"; // 20 - 1 = 19 cells

  const rules = [
    {
      title: "1. 띄어쓰기 기본",
      content: "원고지 작성의 기본은 첫 칸을 비우는 들여쓰기와 띄어쓰기입니다. 새로운 문단이 시작될 때마다 첫 줄의 첫 칸은 반드시 비워야 합니다.",
      examples: [
        { type: 'good', text: " 첫 칸을 비우고 시작하는 올바른 예시입니다." },
        { type: 'bad', text: "첫 칸을 안 비우고 시작하는 잘못된 예시입니다." }
      ]
    },
    {
      title: "2. 문장 부호의 위치",
      content: "문장 부호 뒤에는 보통 칸을 띄우지 않습니다. 그러나 물음표(?)와 느낌표(!)는 예외적으로 쓴 후에 반드시 한 칸을 띄웁니다.",
      examples: [
        { type: 'good', text: "여기서 끝. 다음 문장! 그리고 띄웁니다." },
        { type: 'bad', text: "띄어쓰면오류 . 이렇게!안띄워도 오류." }
      ]
    },
    {
      title: "3. 숫자와 알파벳 (2글자 1칸)",
      content: "아라비아 숫자 2글자 또는 의미가 이어지는 알파벳은 한 칸에 2자씩 함께 쓰는 것이 원칙입니다.",
      examples: [
        { type: 'good', text: "올해는 2026년이고, 저는 IT 기업에 다닙니다." },
        { type: 'bad', text: "올해는 2 0 2 6년이고, 저는 I T 기업에 다닙니다." }
      ]
    },
    {
      title: "4. 따옴표와 대화문",
      content: "다른 사람의 말이나 대화를 인용할 때는 줄을 바꾼 뒤, 첫 칸을 비우고 둘째 칸부터 따옴표를 시작합니다.",
      examples: [
        { type: 'good', text: "철수가 이렇게 말했다.\n \"저기요! 길 좀 물을게요!\"" }
      ]
    },
    {
      title: "5. 행말/행두 금지 규칙",
      content: "여는 괄호/따옴표는 줄 끝(20번째 칸)에 쓸 수 없으며 다음 줄 첫 칸에 적어 넘깁니다. 마침표나 닫는 따옴표는 다음 줄 첫 칸에 갈 수 없어 줄 끝 마지막 글자와 한 칸에 함께 씁니다.",
      examples: [
        { type: 'good', text: "오늘 하루는 정말로 보람찼다. 정말 완벽한 하루!" }, // This spans properly if tuned, but let's just show it rendering. Actually "이 글자는 스무번째 칸에 딱 맞춰 끝이 납니다." -> 21 characters long to show overflow
        { type: 'good', text: "글자가 딱 19번째 칸에 오고 다음에 부호가 오면, 마침표는 다음줄로 안가요." } // We'll let ManuscriptViewer automatic formatting show the magic
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 sm:p-12 text-center md:text-left shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center text-4xl text-indigo-600">
              <i className="fi fi-rr-book-alt"></i>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-800 tracking-tight">원고지 작성법 마스터 서재</h1>
              <p className="mt-3 text-slate-500 font-medium text-lg">원고지 앱에서 채점의 기준이 되는 필수적인 국어 규범과 띄어쓰기 룰을 배워보세요.</p>
            </div>
          </div>
        </div>

        {/* Rule Cards */}
        <div className="grid gap-6">
          {rules.map((rule, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-black">
                  {idx + 1}
                </span>
                {rule.title}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 ml-10">
                {rule.content}
              </p>
              
              {/* Examples Map */}
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 space-y-6">
                <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="fi fi-rr-eye text-lg"></i> 작성 예시
                </h4>
                {rule.examples.map((ex, exIdx) => (
                  <div key={exIdx} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      {ex.type === 'good' ? (
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/80 text-emerald-700 text-sm shadow-sm font-bold">
                          <i className="fi fi-rr-check-circle"></i> 올바른 예시
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100/80 text-rose-700 text-sm shadow-sm font-bold">
                          <i className="fi fi-rr-cross-circle"></i> 잘못된 예시
                        </span>
                      )}
                    </div>
                    {/* Render actual manuscript view of the example text */}
                    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto p-2">
                      <ManuscriptViewer text={ex.text} rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 mb-8">
          <Link 
            href="/dictation" 
            className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-xl text-lg group"
          >
            이제 실전 문제 풀러 가기
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
