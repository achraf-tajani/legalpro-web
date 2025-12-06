export default function SkeletonCard() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
        <div className="w-12 h-4 bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-24 h-3 bg-slate-800 rounded"></div>
        <div className="w-16 h-8 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
}