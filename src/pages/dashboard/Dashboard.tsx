export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              📁
            </div>
            <span className="text-xs text-slate-500">+12%</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Dossiers Actifs</p>
          <p className="text-3xl font-bold text-white">--</p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl">
              👥
            </div>
            <span className="text-xs text-slate-500">+8%</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Clients</p>
          <p className="text-3xl font-bold text-white">--</p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <span className="text-xs text-red-400">Urgent</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Tâches Urgentes</p>
          <p className="text-3xl font-bold text-white">--</p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
            <span className="text-xs text-slate-500">-3%</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Factures Impayées</p>
          <p className="text-3xl font-bold text-white">--</p>
        </div>
      </div>

      {/* Content Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone 1 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Dossiers Récents</h3>
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">📂</div>
            <p>Données à venir...</p>
          </div>
        </div>

        {/* Zone 2 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Prochaines Échéances</h3>
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3">📅</div>
            <p>Données à venir...</p>
          </div>
        </div>
      </div>
    </div>
  );
}