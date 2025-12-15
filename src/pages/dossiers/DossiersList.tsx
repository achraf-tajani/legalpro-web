import { useDossiers } from '../../hooks/useDossiers';
import SkeletonTable from '../../components/common/SkeletonTable';
import { MdFolder, MdAdd } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useClients } from '../../hooks/useClients';
import { dossierService } from '../../services/dossier.service';
import CreateDossierModal from '../../components/features/dossiers/CreateDossierModal';
import type { CreateDossierDto } from '../../types/dossier.types';
import { useNavigate } from 'react-router-dom';

export default function DossiersList() {
  const { t } = useTranslation();
  const { dossiers, isLoading, error } = useDossiers();
  const { clients } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleCreateDossier = async (data: CreateDossierDto) => {
    setIsRefreshing(true);
    await dossierService.create(data);
    window.location.reload();
  };

  const getStatutBadgeClass = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return 'badge-blue';
      case 'ouvert':
        return 'badge-green';
      case 'clos':
        return 'badge-gray';
      case 'suspendu':
        return 'badge-yellow';
      case 'archive':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const getPrioriteBadgeClass = (priorite: string) => {
    switch (priorite) {
      case 'critique':
        return 'badge-red';
      case 'haute':
        return 'badge-orange';
      case 'normale':
        return 'badge-blue';
      case 'basse':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary mb-2">{t('dossiers.title')}</h1>
          <p className="text-theme-secondary text-sm sm:text-base">
            {isLoading ? t('common.loading') : t('dossiers.count', { count: dossiers.length })}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isRefreshing}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-accent-gradient hover:bg-accent-gradient-hover text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdAdd className="text-xl" />
          <span>{t('dossiers.new')}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6">
        {isLoading ? (
          <SkeletonTable />
        ) : dossiers.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-theme-muted">
            <MdFolder className="text-5xl sm:text-6xl mx-auto mb-4 opacity-50" />
            <h3 className="text-lg sm:text-xl font-semibold text-theme-primary mb-2">{t('dossiers.empty')}</h3>
            <p className="text-sm sm:text-base">{t('dossiers.emptyDescription')}</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {dossiers.map((dossier) => (
              <div
                key={dossier.id}
                onClick={() => navigate(`/dossiers/${dossier.id}`)}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl transition-all cursor-pointer border-theme border hover:border-opacity-80"
              >
                {/* Icon + Info */}
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <MdFolder className="text-xl sm:text-2xl text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-theme-primary font-semibold truncate text-sm sm:text-base">{dossier.titre}</h3>
                    <p className="text-xs sm:text-sm text-theme-secondary truncate">
                      {dossier.client ? `${dossier.client.nom} ${dossier.client.prenom || ''}` : t('dossiers.noClient')}
                    </p>
                  </div>
                </div>

                {/* Badges + Date */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Statut */}
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatutBadgeClass(dossier.statut)}`}>
                    {dossier.statut.replace('_', ' ')}
                  </span>

                  {/* Priorité */}
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPrioriteBadgeClass(dossier.priorite)}`}>
                    {dossier.priorite}
                  </span>

                  {/* Date (desktop only) */}
                  <div className="text-xs sm:text-sm text-theme-muted hidden lg:block whitespace-nowrap">
                    {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateDossierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDossier}
        clients={clients}
      />
    </div>
  );
}