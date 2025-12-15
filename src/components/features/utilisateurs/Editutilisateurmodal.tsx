import { useState } from 'react';
import { MdClose, MdEdit } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { utilisateurService } from '../../../services/utilisateur.service';
import type { Utilisateur, UpdateUtilisateurDto, UpdateAvocatDto } from '../../../types/utilisateur.types';

interface EditUtilisateurModalProps {
  isOpen: boolean;
  onClose: () => void;
  utilisateur: Utilisateur;
  onSuccess: () => void;
}

export default function EditUtilisateurModal({ isOpen, onClose, utilisateur, onSuccess }: EditUtilisateurModalProps) {
  const {  i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isUpdating, setIsUpdating] = useState(false);

  const [userData, setUserData] = useState<UpdateUtilisateurDto>({
    nom: utilisateur.nom || '',
    prenom: utilisateur.prenom || '',
    type_utilisateur: utilisateur.type_utilisateur,
    est_actif: utilisateur.est_actif,
  });

  const [avocatData, setAvocatData] = useState<UpdateAvocatDto>({
    nom: utilisateur.avocat?.nom || '',
    prenom: utilisateur.avocat?.prenom || '',
    telephone: utilisateur.avocat?.telephone || '',
    specialite: utilisateur.avocat?.specialite || '',
    statut: utilisateur.avocat?.statut || 'actif',
    tarif_horaire: utilisateur.avocat?.tarif_horaire,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await utilisateurService.updateUtilisateur(utilisateur.id, userData);
      if (utilisateur.avocat_id) {
        await utilisateurService.updateAvocat(utilisateur.avocat_id, avocatData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] border-theme border flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MdEdit className="text-2xl sm:text-3xl text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Modifier l'utilisateur</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
              <MdClose className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Info Utilisateur */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-theme-primary">Informations utilisateur</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Nom</label>
                <input
                  type="text"
                  value={userData.nom}
                  onChange={(e) => setUserData({ ...userData, nom: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Prénom</label>
                <input
                  type="text"
                  value={userData.prenom}
                  onChange={(e) => setUserData({ ...userData, prenom: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Rôle</label>
                <select
                  value={userData.type_utilisateur}
                  onChange={(e) => setUserData({ ...userData, type_utilisateur: e.target.value as any })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="avocat">Avocat</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Statut compte</label>
                <select
                  value={userData.est_actif ? 'actif' : 'inactif'}
                  onChange={(e) => setUserData({ ...userData, est_actif: e.target.value === 'actif' })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Avocat */}
          {utilisateur.avocat_id && (
            <div className="space-y-4 pt-6 border-t border-theme">
              <h3 className="text-lg font-semibold text-theme-primary">Informations avocat</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={avocatData.telephone}
                    onChange={(e) => setAvocatData({ ...avocatData, telephone: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">Spécialité</label>
                  <input
                    type="text"
                    value={avocatData.specialite}
                    onChange={(e) => setAvocatData({ ...avocatData, specialite: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Tarif horaire (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={avocatData.tarif_horaire || ''}
                  onChange={(e) => setAvocatData({ ...avocatData, tarif_horaire: parseFloat(e.target.value) || undefined })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Statut avocat</label>
                <select
                  value={avocatData.statut}
                  onChange={(e) => setAvocatData({ ...avocatData, statut: e.target.value as any })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                </select>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-theme-tertiary border-theme border-t flex flex-col-reverse sm:flex-row justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="w-full sm:w-auto px-6 py-3 border-theme border rounded-xl text-theme-secondary font-semibold hover:bg-theme-tertiary transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50"
          >
            {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}