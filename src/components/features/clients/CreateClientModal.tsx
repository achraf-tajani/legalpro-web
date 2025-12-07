import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import type { Client, CreateClientDto, UpdateClientDto } from '../../../types/client.types';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientDto) => Promise<void>;
  onUpdate?: (id: string, data: UpdateClientDto) => Promise<void>;
  client?: Client | null;
  mode?: 'create' | 'edit';
}

export default function CreateClientModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  onUpdate,
  client = null,
  mode = 'create'
}: CreateClientModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateClientDto>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: '',
    type_client: 'personne_physique',
    type_entite: '',
  });

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        nom: client.nom,
        prenom: client.prenom || '',
        email: client.email || '',
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        ville: client.ville || '',
        code_postal: client.code_postal || '',
        pays: client.pays || '',
        type_client: client.type_client,
        type_entite: client.type_entite || '',
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        code_postal: '',
        pays: '',
        type_client: 'personne_physique',
        type_entite: '',
      });
    }
  }, [client, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'edit' && client && onUpdate) {
        await onUpdate(client.id, formData);
      } else {
        await onSubmit(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-800"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'edit' ? t('clients.update') : t('clients.new')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Type client */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('clients.modal.typeClient')} *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="personne_physique"
                    checked={formData.type_client === 'personne_physique'}
                    onChange={(e) => setFormData({ ...formData, type_client: e.target.value as any })}
                    className="text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-white">{t('clients.type.personne_physique')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="entreprise"
                    checked={formData.type_client === 'entreprise'}
                    onChange={(e) => setFormData({ ...formData, type_client: e.target.value as any })}
                    className="text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-white">{t('clients.type.entreprise')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="organisation"
                    checked={formData.type_client === 'organisation'}
                    onChange={(e) => setFormData({ ...formData, type_client: e.target.value as any })}
                    className="text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-white">{t('clients.type.organisation')}</span>
                </label>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {(formData.type_client === 'entreprise' || formData.type_client === 'organisation') 
                  ? t('clients.modal.nomEntreprise') 
                  : t('clients.modal.nom')} *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('clients.modal.nomPlaceholder')}
              />
            </div>

            {/* Prénom (seulement pour personne physique) */}
            {formData.type_client === 'personne_physique' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('clients.modal.prenom')}
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder={t('clients.modal.prenomPlaceholder')}
                />
              </div>
            )}

            {/* Type entité (pour entreprise et organisation) */}
            {(formData.type_client === 'entreprise' || formData.type_client === 'organisation') && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('clients.modal.typeEntite')}
                </label>
                <input
                  type="text"
                  value={formData.type_entite}
                  onChange={(e) => setFormData({ ...formData, type_entite: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder={t('clients.modal.typeEntitePlaceholder')}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('clients.modal.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('clients.modal.emailPlaceholder')}
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('clients.modal.telephone')}
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('clients.modal.telephonePlaceholder')}
              />
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('clients.modal.adresse')}
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('clients.modal.adressePlaceholder')}
              />
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('clients.modal.ville')}
              </label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('clients.modal.villePlaceholder')}
              />
            </div>

            {/* Code postal */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('clients.modal.codePostal')}
              </label>
              <input
                type="text"
                value={formData.code_postal}
                onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('clients.modal.codePostalPlaceholder')}
              />
            </div>

            {/* Pays */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('clients.modal.pays')}
              </label>
              <input
                type="text"
                value={formData.pays}
                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('clients.modal.paysPlaceholder')}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border border-slate-600 rounded-xl text-slate-300 font-semibold hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>{t('common.saving')}</span>
              </>
            ) : (
              <span>{mode === 'edit' ? t('common.update') : t('common.save')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}