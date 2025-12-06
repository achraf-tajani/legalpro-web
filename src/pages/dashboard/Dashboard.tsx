import { useDashboard } from '../../hooks/useDashboard';
import SkeletonCard from '../../components/common/SkeletonCard';
import { useTranslation } from 'react-i18next';
import { 
  MdFolder,
  MdPeople, 
  MdWarning, 
  MdAttachMoney,
  MdFolderOpen,
  MdCalendarToday
} from 'react-icons/md';
export default function Dashboard() {
  const { t } = useTranslation();
  const { stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.title')}</h1>
          <p className="text-slate-400">{t('dashboard.subtitle')}</p>
        </div>

        {/* Skeleton Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Skeleton Content Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 h-64 animate-pulse">
            <div className="w-32 h-5 bg-slate-800 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-slate-800 rounded"></div>
              <div className="w-3/4 h-4 bg-slate-800 rounded"></div>
              <div className="w-5/6 h-4 bg-slate-800 rounded"></div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 h-64 animate-pulse">
            <div className="w-32 h-5 bg-slate-800 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-slate-800 rounded"></div>
              <div className="w-3/4 h-4 bg-slate-800 rounded"></div>
              <div className="w-5/6 h-4 bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.title')}</h1>
          <p className="text-slate-400">{t('dashboard.subtitle')}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.title')}</h1>
        <p className="text-slate-400">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              <MdFolder className="text-3xl text-white" />
            </div>
            <span className="text-xs text-green-400"></span>
          </div>
          <p className="text-slate-400 text-sm mb-1">{t('dashboard.dossiersActifs')}</p>
          <p className="text-3xl font-bold text-white">{stats?.dossiersActifs ?? 0}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl">
              <MdPeople className="text-3xl text-white" />
            </div>
            <span className="text-xs text-green-400"></span>
          </div>
          <p className="text-slate-400 text-sm mb-1">{t('dashboard.totalClients')}</p>
          <p className="text-3xl font-bold text-white">{stats?.totalClients ?? 0}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
              <MdWarning className="text-3xl text-white" />
            </div>
            <span className="text-xs text-red-400"></span>
          </div>
          <p className="text-slate-400 text-sm mb-1">{t('dashboard.tachesUrgentes')}</p>
          <p className="text-3xl font-bold text-white">{stats?.tachesUrgentes ?? 0}</p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-2xl">
              <MdAttachMoney className="text-3xl text-white" />
            </div>
            <span className="text-xs text-slate-500"></span>
          </div>
          <p className="text-slate-400 text-sm mb-1">{t('dashboard.facturesImpayees')}</p>
          <p className="text-3xl font-bold text-white">{stats?.facturesImpayees ?? 0}</p>
        </div>
      </div>

      {/* Content Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone 1 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.dossiersRecents')}</h3>
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3"><MdFolderOpen className="text-6xl text-slate-700" /></div>
            <p>Données à venir...</p>
          </div>
        </div>

        {/* Zone 2 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.prochaines')}</h3>
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-3"><MdCalendarToday className="text-6xl text-slate-700" /></div>
            <p>Données à venir...</p>
          </div>
        </div>
      </div>
    </div>
  );
}