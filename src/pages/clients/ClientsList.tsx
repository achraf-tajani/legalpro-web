import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClients } from '../../hooks/useClients';
import { clientService } from '../../services/client.service';
import SkeletonTable from '../../components/common/SkeletonTable';
import CreateClientModal from '../../components/features/clients/CreateClientModal';
import type { CreateClientDto } from '../../types/client.types';
import { MdPeople, MdAdd, MdBusiness, MdPerson } from 'react-icons/md';

export default function ClientsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clients, isLoading, error } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateClient = async (data: CreateClientDto) => {
    await clientService.create(data);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('clients.title')}</h1>
          <p className="text-slate-400">
            {isLoading ? t('common.loading') : t('clients.count', { count: clients.length })}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all"
        >
          <MdAdd className="text-xl" />
          <span>{t('clients.new')}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {t('clients.loadingError')}
        </div>
      )}

      {/* Content */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        {isLoading ? (
          <SkeletonTable />
        ) : clients.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MdPeople className="text-6xl text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('clients.empty')}</h3>
            <p>{t('clients.emptyDescription')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="flex items-center space-x-4 p-4 bg-slate-900/30 hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-emerald-500/30"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  {client.type_client === 'personne_physique' ? (
                    <MdPerson className="text-2xl text-white" />
                  ) : (
                    <MdBusiness className="text-2xl text-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {client.nom} {client.prenom || ''}
                  </h3>
                  <p className="text-sm text-slate-400 truncate">
                    {client.email || t('clients.noEmail')}
                  </p>
                </div>

                {/* Type */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  client.type_client === 'personne_physique'
                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                    : client.type_client === 'entreprise'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}>
                  {t(`clients.type.${client.type_client}`)}
                </span>

                {/* Date */}
                <div className="text-sm text-slate-500 hidden md:block">
                  {new Date(client.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateClient}
      />
    </div>
  );
}