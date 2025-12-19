import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clientService } from '../../services/client.service';
import CreateClientModal from '../../components/features/clients/CreateClientModal';
import type { Client, UpdateClientDto } from '../../types/client.types';
import { useDossiersByClient } from '../../hooks/useDossiersByClient';
import { useAuthStore } from '../../stores/authStore';
import { MdFolder, MdLock } from 'react-icons/md';

import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBusiness,
  MdPerson
} from 'react-icons/md';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dossiers, isLoading: dossierLoading } = useDossiersByClient(id);

  // Vérifier si l'utilisateur a accès au dossier
  const hasAccessToDossier = (dossier: any) => {
    if (user?.type_utilisateur === 'ADMIN') return true;
    if (user?.type_utilisateur === 'AVOCAT' && dossier.avocat_assigne === user.avocatId) return true;
    return false;
  };

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await clientService.getById(id);
        setClient(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement du client');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleUpdateClient = async (clientId: string, data: UpdateClientDto) => {
    await clientService.update(clientId, data);
    window.location.reload();
  };

  const handleDeleteClient = async () => {
    if (!window.confirm(t('clients.confirmDelete'))) return;
    
    try {
      await clientService.delete(id!);
      navigate('/clients');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(t('common.error'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
         <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center space-x-2 text-theme-muted hover:text-theme-primary transition-colors"
        >
          <MdArrowBack />
          <span>{t('common.back')}</span>
        </button>
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error || t('clients.notFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/clients')}
            className="p-2 rounded-lg transition-colors text-theme-muted hover:text-theme-primary"
          >
            <MdArrowBack className="text-xl" />
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            {client.type_client === 'personne_physique' ? (
              <MdPerson className="text-3xl text-white" />
            ) : (
              <MdBusiness className="text-3xl text-white" />
            )}
          </div>

          <div>
           <h1 className="text-3xl font-bold text-theme-primary">
              {client.nom} {client.prenom || ''}
            </h1>
            <p className="text-theme-secondary mt-1">
              {t(`clients.type.${client.type_client}`)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-theme-tertiary border border-theme hover:bg-opacity-80 text-theme-primary rounded-lg transition-all"
          >
            <MdEdit />
            <span>{t('common.edit')}</span>
          </button>
          <button 
            onClick={handleDeleteClient}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30"
          >
            <MdDelete />
            <span>{t('common.delete')}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-theme-surface border-theme border rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Contact */}
          {client.email && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdEmail className="text-xl text-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  {t('clients.detail.email')}
                </label>
                 <p className="text-theme-primary">{client.email}</p>
              </div>
            </div>
          )}

          {client.telephone && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdPhone className="text-xl text-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  {t('clients.detail.telephone')}
                </label>
                <p className="text-theme-primary">{client.telephone}</p>
              </div>
            </div>
          )}

          {/* Adresse */}
          {(client.adresse || client.ville || client.code_postal || client.pays) && (
            <div className="flex items-start space-x-3 md:col-span-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdLocationOn className="text-xl text-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  {t('clients.detail.adresse')}
                </label>
                <p className="text-theme-primary">
                  {client.adresse && <span>{client.adresse}<br /></span>}
                  {client.code_postal && client.ville && <span>{client.code_postal} {client.ville}<br /></span>}
                  {client.pays && <span>{client.pays}</span>}
                </p>
              </div>
            </div>
          )}

          {/* Type entité */}
          {client.type_entite && (
            <div>
              <label className="block text-sm font-semibold text-theme-secondary mb-1">
                {t('clients.detail.typeEntite')}
              </label>
              <p className="text-theme-primary">{client.type_entite}</p>
            </div>
          )}

          {/* Statut */}
          <div>
            <label className="block text-sm font-semibold text-theme-secondary mb-1">
              {t('clients.detail.statut')}
            </label>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
              client.statut === 'actif' 
                ? 'badge-green'
                : client.statut === 'inactif'
                ? 'badge-gray'
                : 'badge-yellow'
            }`}>
              {t(`clients.statut.${client.statut}`)}
            </span>
          </div>

          {/* Montant total facturé */}
          <div>
            <label className="block text-sm font-semibold text-theme-secondary mb-1">
              {t('clients.detail.montantTotal')}
            </label>
            <p className="text-white text-lg font-semibold">
              {client.montant_total_facture.toLocaleString()} €
            </p>
          </div>

          {/* Date inscription */}
          <div>
            <label className="block text-sm font-semibold text-theme-secondary mb-1">
              {t('clients.detail.dateInscription')}
            </label>
            <p className="text-theme-primary">
              {new Date(client.date_inscription).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Dossiers liés */}
      <div className="bg-theme-surface border-theme border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-theme-primary mb-4">
          {t('clients.detail.dossiers')} ({dossiers.length})
        </h3>

        {dossierLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}></div>
          </div>
        ) : dossiers.length === 0 ? (
         <div className="text-center py-8 text-theme-muted">
            <MdFolder className="text-5xl opacity-50 mx-auto mb-3" />
            <p>{t('clients.detail.noDossiers')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dossiers.map((dossier) => {
              const hasAccess = hasAccessToDossier(dossier);
              
              return (
                <div
                  key={dossier.id}
                  onClick={() => hasAccess && navigate(`/dossiers/${dossier.id}`)}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all border-theme border ${
                    hasAccess 
                      ? 'bg-theme-tertiary hover:bg-opacity-80 cursor-pointer hover:border-opacity-80' 
                      : 'bg-gray-500/10 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      hasAccess 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : 'bg-gray-500/20'
                    }`}>
                      {hasAccess ? (
                        <MdFolder className="text-xl text-white" />
                      ) : (
                        <MdLock className="text-xl text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-theme-primary font-semibold">
                        {hasAccess ? dossier.titre : 'Accès restreint'}
                      </h4>
                      <p className="text-sm text-theme-secondary">
                        {hasAccess ? dossier.type : 'Vous n\'êtes pas assigné à ce dossier'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasAccess ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        dossier.statut === 'en_cours' ? 'badge-blue' :
                        dossier.statut === 'ouvert' ? 'badge-green' :
                        dossier.statut === 'clos' ? 'badge-gray' :
                        'badge-yellow'
                      }`}>
                        {dossier.statut.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium border badge-gray">
                        <MdLock className="inline mr-1" />
                        Restreint
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Edit */}
      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async () => {}}
        onUpdate={handleUpdateClient}
        client={client}
        mode="edit"
      />
    </div>
  );
}