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
  setIsRefreshing(true);  // ← AJOUTEZ ÇA
  await dossierService.create(data);
  window.location.reload();
};
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ouvert':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'clos':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'suspendu':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'archive':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'critique':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'haute':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'normale':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'basse':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('dossiers.title')}</h1>
          <p className="text-slate-400">
            {isLoading ? t('common.loading') : t('dossiers.count', { count: dossiers.length })}
          </p>
        </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
          <MdAdd className="text-xl" />
          <span>{t('dossiers.new')}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        {isLoading ? (
          <SkeletonTable />
        ) : dossiers.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MdFolder className="text-6xl text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('dossiers.empty')}</h3>
            <p>{t('dossiers.emptyDescription')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dossiers.map((dossier) => (
              <div
                key={dossier.id}
                onClick={() => navigate(`/dossiers/${dossier.id}`)}
                className="flex items-center space-x-4 p-4 bg-slate-900/30 hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-indigo-500/30"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdFolder className="text-2xl text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{dossier.titre}</h3>
                  <p className="text-sm text-slate-400 truncate">
                    {dossier.client ? `${dossier.client.nom} ${dossier.client.prenom || ''}` : t('dossiers.noClient')}
                  </p>
                </div>

                {/* Statut */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(
                    dossier.statut
                  )}`}
                >
                  {dossier.statut.replace('_', ' ')}
                </span>

                {/* Priorité */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getPrioriteColor(
                    dossier.priorite
                  )}`}
                >
                  {dossier.priorite}
                </span>

                {/* Date */}
                <div className="text-sm text-slate-500 hidden md:block">
                  {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateDossierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDossier}
        clients={clients}
      />
    </div>
  );
}