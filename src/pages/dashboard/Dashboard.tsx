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
      <div className="space-y-4 sm:space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary mb-2">{t('dashboard.title')}</h1>
          <p className="text-theme-secondary text-sm sm:text-base">{t('dashboard.subtitle')}</p>
        </div>

        {/* Skeleton Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Skeleton Content Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6 h-64 animate-pulse">
            <div className="w-32 h-5 bg-theme-tertiary rounded mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-theme-tertiary rounded"></div>
              <div className="w-3/4 h-4 bg-theme-tertiary rounded"></div>
              <div className="w-5/6 h-4 bg-theme-tertiary rounded"></div>
            </div>
          </div>
          
          <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6 h-64 animate-pulse">
            <div className="w-32 h-5 bg-theme-tertiary rounded mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-theme-tertiary rounded"></div>
              <div className="w-3/4 h-4 bg-theme-tertiary rounded"></div>
              <div className="w-5/6 h-4 bg-theme-tertiary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary mb-2">{t('dashboard.title')}</h1>
          <p className="text-theme-secondary text-sm sm:text-base">{t('dashboard.subtitle')}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm sm:text-base">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary mb-2">{t('dashboard.title')}</h1>
        <p className="text-theme-secondary text-sm sm:text-base">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 - Dossiers Actifs */}
        <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MdFolder className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
          <p className="text-theme-secondary text-xs sm:text-sm mb-1">{t('dashboard.dossiersActifs')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-theme-primary">{stats?.dossiersActifs ?? 0}</p>
        </div>

        {/* Card 2 - Total Clients */}
        <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <MdPeople className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
          <p className="text-theme-secondary text-xs sm:text-sm mb-1">{t('dashboard.totalClients')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-theme-primary">{stats?.totalClients ?? 0}</p>
        </div>

        {/* Card 3 - Tâches Urgentes */}
        <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <MdWarning className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
          <p className="text-theme-secondary text-xs sm:text-sm mb-1">{t('dashboard.tachesUrgentes')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-theme-primary">{stats?.tachesUrgentes ?? 0}</p>
        </div>

        {/* Card 4 - Factures Impayées */}
        <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <MdAttachMoney className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
          <p className="text-theme-secondary text-xs sm:text-sm mb-1">{t('dashboard.facturesImpayees')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-theme-primary">{stats?.facturesImpayees ?? 0}</p>
        </div>
      </div>

      {/* Content Zones - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Zone 1 - Dossiers Récents */}
        <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-theme-primary mb-4 sm:mb-6">{t('dashboard.recentCases')}</h3>
          
          {dossiers.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-theme-muted text-sm sm:text-base">
              Aucun dossier
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
              {dossiers.slice(0, 5).map(dossier => (
                <div
                  key={dossier.id}
                  onClick={() => navigate(`/dossiers/${dossier.id}`)}
                  className="p-3 sm:p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl border-theme border hover:border-opacity-80 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-theme-primary mb-1 text-sm sm:text-base truncate">{dossier.titre}</h4>
                      <p className="text-xs sm:text-sm text-theme-secondary truncate">{dossier.type}</p>
                    </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        dossier.statut === 'ouvert' ? 'badge-blue' :
                        dossier.statut === 'en_cours' ? 'badge-yellow' :
                        dossier.statut === 'clos' ? 'badge-green' :
                        'badge-gray'
                      }`}>
                      {t(`dossiers.statut.${dossier.statut}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone 2 - Échéances Prochaines */}
        <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-theme-primary mb-4 sm:mb-6">{t('dashboard.upcomingDeadlines')}</h3>
          
          {(() => {
            const prochaines = procedures
              .filter(p => p.date_evenement && new Date(p.date_evenement) > new Date())
              .sort((a, b) => new Date(a.date_evenement!).getTime() - new Date(b.date_evenement!).getTime())
              .slice(0, 5);

            return prochaines.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-theme-muted text-sm sm:text-base">
                Aucune échéance prochaine
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                {prochaines.map(procedure => {
                  const dossier = dossiers.find(d => d.id === procedure.id_dossier);
                  const daysUntil = Math.ceil((new Date(procedure.date_evenement!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div
                      key={procedure.id}
                      onClick={() => navigate(`/dossiers/${procedure.id_dossier}`)}
                      className="p-3 sm:p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl border-theme border hover:border-opacity-80 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-theme-primary mb-1 text-sm sm:text-base truncate">{procedure.titre}</h4>
                          <p className="text-xs sm:text-sm text-theme-secondary truncate">{dossier?.titre || 'Dossier inconnu'}</p>
                        </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        daysUntil <= 3 ? 'badge-red' :
                        daysUntil <= 7 ? 'badge-orange' :
                        'badge-blue'
                      }`}>
                        {daysUntil === 0 ? "Aujourd'hui" :
                        daysUntil === 1 ? 'Demain' :
                        `Dans ${daysUntil} jours`}
                      </span>
                      </div>
                      <div className="text-xs sm:text-sm text-theme-muted">
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