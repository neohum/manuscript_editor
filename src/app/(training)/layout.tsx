"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidePanel } from "@/components/training/SidePanel";

export default function TrainingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Only show sidebar on the editor page for now, as it handles real editor state
  const showSidebar = pathname === "/editor" || pathname === "/editor/";

  return (
    <div className="flex flex-1 w-full bg-[#f8f6f0] overflow-hidden">
      {showSidebar && <SidePanel />}
      <main className="flex-1 overflow-y-auto w-full h-full relative">
        {children}
      </main>
    </div>
  );
}
