export default function SkeletonTable() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-theme-tertiary rounded-xl">
          <div className="w-12 h-12 bg-theme-secondary rounded-lg flex-shrink-0" style={{ opacity: 0.5 }}></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-theme-secondary rounded w-3/4" style={{ opacity: 0.5 }}></div>
            <div className="h-3 bg-theme-secondary rounded w-1/2" style={{ opacity: 0.5 }}></div>
          </div>
          <div className="w-20 h-6 bg-theme-secondary rounded-full" style={{ opacity: 0.5 }}></div>
          <div className="w-20 h-6 bg-theme-secondary rounded-full" style={{ opacity: 0.5 }}></div>
        </div>
      ))}
    </div>
  );
}