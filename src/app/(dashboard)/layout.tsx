import { redirect } from "next/navigation";
import { auth } from "@/../auth";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const { role, name, level, xp } = session.user;

  // Let role specific pages handle redirection if they hit the wrong page
  return (
    <div className="flex h-full w-full bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col items-center py-8">
        <div className="mb-8 flex flex-col items-center">
          <Badge level={level || 1} xp={xp || 0} showXp={true} />
          <h2 className="mt-3 font-bold text-slate-700">{name}님</h2>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-md mt-1">
            {role === "teacher" ? "선생님 계정" : "학습자 계정"}
          </span>
        </div>

        <nav className="flex flex-col w-full px-4 gap-2">
          {role === "teacher" && (
            <Link
              href="/teacher"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
            >
              <i className="fi fi-rr-users-class"></i> 내 학급 관리
            </Link>
          )}
          {role === "student" && (
            <Link
              href="/student"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
            >
              <i className="fi fi-rr-backpack"></i> 내 학습 그룹
            </Link>
          )}

          <div className="my-4 h-px border-t w-full opacity-50"></div>

          <Link href="/" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <i className="fi fi-rr-arrow-left"></i> 워크스페이스
          </Link>
          <Link href="/reports" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <i className="fi fi-rr-chart-pie-alt"></i> 내 성적표
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
