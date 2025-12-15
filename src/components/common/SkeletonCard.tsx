export default function SkeletonCard() {
  return (
   <div className="bg-theme-surface border-theme border rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-theme-tertiary rounded-xl"></div>
        <div className="w-12 h-4 bg-theme-tertiary rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-24 h-3 bg-theme-tertiary rounded"></div>
        <div className="w-16 h-8 bg-theme-tertiary rounded"></div>
      </div>
    </div>
  );
}