export default function SkeletonTable() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-slate-900/30 rounded-xl">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
          <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
        </div>
      ))}
    </div>
  );
}