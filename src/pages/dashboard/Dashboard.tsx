import { useDashboard } from '../../hooks/useDashboard';
import SkeletonCard from '../../components/common/SkeletonCard';
import { useDossiers } from '../../hooks/useDossiers';
import { useProcedures } from '../../hooks/useProcedures';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  MdFolder,
  MdPeople, 
  MdWarning, 
  MdAttachMoney
} from 'react-icons/md';
export default function Dashboard() {
  const { t } = useTranslation();
  const { stats, isLoading, error } = useDashboard();
  const { dossiers } = useDossiers();
  const { procedures } = useProcedures(undefined);
  const navigate = useNavigate();
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
            <h3 className="text-xl font-bold text-white mb-6">{t('dashboard.recentCases')}</h3>
            
            {dossiers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                Aucun dossier
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {dossiers.slice(0, 5).map(dossier => (
                  <div
                    key={dossier.id}
                    onClick={() => navigate(`/dossiers/${dossier.id}`)}
                    className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{dossier.titre}</h4>
                        <p className="text-sm text-slate-400">{dossier.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dossier.statut === 'ouvert' ? 'bg-blue-500/20 text-blue-400' :
                        dossier.statut === 'en_cours' ? 'bg-yellow-500/20 text-yellow-400' :
                        dossier.statut === 'clos' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {t(`dossiers.statut.${dossier.statut}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Zone 2 */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">{t('dashboard.upcomingDeadlines')}</h3>
            
            {(() => {
              // Filtrer les procédures avec date future
              const prochaines = procedures
                .filter(p => p.date_evenement && new Date(p.date_evenement) > new Date())
                .sort((a, b) => new Date(a.date_evenement!).getTime() - new Date(b.date_evenement!).getTime())
                .slice(0, 5);

              return prochaines.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  Aucune échéance prochaine
                </div>
              ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {prochaines.map(procedure => {
                    const dossier = dossiers.find(d => d.id === procedure.id_dossier);
                    const daysUntil = Math.ceil((new Date(procedure.date_evenement!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div
                        key={procedure.id}
                        onClick={() => navigate(`/dossiers/${procedure.id_dossier}`)}
                        className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{procedure.titre}</h4>
                            <p className="text-sm text-slate-400">{dossier?.titre || 'Dossier inconnu'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            daysUntil <= 3 ? 'bg-red-500/20 text-red-400' :
                            daysUntil <= 7 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {daysUntil === 0 ? "Aujourd'hui" :
                            daysUntil === 1 ? 'Demain' :
                            `Dans ${daysUntil} jours`}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500">
                          📅 {new Date(procedure.date_evenement!).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
      </div>
    </div>
  );
}