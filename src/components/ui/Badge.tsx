import React from 'react';

type BadgeProps = {
  level: number;
  xp: number;
  showXp?: boolean;
};

export function Badge({ level, xp, showXp = false }: BadgeProps) {
  const getBadgeStyle = (lvl: number) => {
    if (lvl >= 10) return { icon: '👑', name: '마스터', color: 'bg-yellow-500 text-yellow-950 border-yellow-400' };
    if (lvl >= 8) return { icon: '🦅', name: '독수리', color: 'bg-purple-500 text-purple-50 border-purple-400' };
    if (lvl >= 6) return { icon: '⛰️', name: '거산', color: 'bg-stone-600 text-stone-50 border-stone-500' };
    if (lvl >= 4) return { icon: '🌲', name: '거목', color: 'bg-emerald-600 text-emerald-50 border-emerald-500' };
    if (lvl >= 2) return { icon: '🌿', name: '풀잎', color: 'bg-lime-500 text-lime-950 border-lime-400' };
    return { icon: '🌱', name: '새싹', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  const style = getBadgeStyle(level);
  
  // Calculate XP ratio to next level
  const baseLevelXp = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const currentLevelXp = xp - baseLevelXp;
  const progressRatio = Math.min(100, Math.max(0, (currentLevelXp / 500) * 100));

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border shadow-sm ${style.color}`}
        title={`누적 경험치: ${xp} XP`}
      >
        <span>{style.icon}</span>
        <span>Lv.{level} {style.name}</span>
      </div>
      
      {showXp && (
        <div className="w-full flex items-center justify-center gap-2 mt-1 px-1">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden min-w-[60px] max-w-[100px]">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{currentLevelXp}/500</span>
        </div>
      )}
    </div>
  );
}
