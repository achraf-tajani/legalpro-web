import { useState, useEffect } from 'react';
import { MdClose, MdFolder, MdAdd, MdRemove } from 'react-icons/md';
import { dossierService } from '../../../services/dossier.service';
import type { Dossier } from '../../../types/dossier.types';
import type { Utilisateur } from '../../../types/utilisateur.types';

interface AssignDossiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  utilisateur: Utilisateur;
  onSuccess: () => void;
}

export default function AssignDossiersModal({ 
  isOpen, 
  onClose, 
  utilisateur, 
  onSuccess 
}: AssignDossiersModalProps) {
  const [allDossiers, setAllDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dossiers assignés à cet avocat
  const assignedDossiers = allDossiers.filter(d => d.avocat_assigne === utilisateur.avocat_id);
  
  // Dossiers non assignés (disponibles)
  const availableDossiers = allDossiers.filter(d => !d.avocat_assigne);

  useEffect(() => {
    if (isOpen) {
      loadDossiers();
    }
  }, [isOpen]);

  const loadDossiers = async () => {
    setIsLoading(true);
    try {
      const dossiers = await dossierService.getAll();
      setAllDossiers(dossiers);
    } catch (error) {
      console.error('Erreur chargement dossiers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (dossierId: string) => {
    setIsSaving(true);
    try {
      await dossierService.update(dossierId, { 
        avocat_assigne: utilisateur.avocat_id 
      });
      await loadDossiers();
      onSuccess();
    } catch (error) {
      console.error('Erreur assignation:', error);
      alert('Erreur lors de l\'assignation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnassign = async (dossierId: string) => {
    setIsSaving(true);
    try {
      await dossierService.update(dossierId, { 
        avocat_assigne: null as any 
      });
      await loadDossiers();
      onSuccess();
    } catch (error) {
      console.error('Erreur désassignation:', error);
      alert('Erreur lors de la désassignation');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] border-theme border flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-theme border-b flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex items-center space-x-3">
            <MdFolder className="text-white text-xl sm:text-2xl" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Gérer les dossiers
              </h2>
              <p className="text-white/80 text-sm">
                {utilisateur.prenom} {utilisateur.nom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                   style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}>
              </div>
            </div>
          ) : (
            <>
              {/* Dossiers assignés */}
              <div>
                <h3 className="text-lg font-semibold text-theme-primary mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Dossiers assignés ({assignedDossiers.length})
                </h3>
                {assignedDossiers.length === 0 ? (
                  <p className="text-theme-muted text-sm py-4 text-center bg-theme-tertiary rounded-xl">
                    Aucun dossier assigné
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assignedDossiers.map(dossier => (
                      <div 
                        key={dossier.id}
                        className="flex items-center justify-between p-3 bg-theme-tertiary rounded-xl border-theme border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <MdFolder className="text-green-500" />
                          </div>
                          <div>
                            <p className="text-theme-primary font-medium">{dossier.titre}</p>
                            <p className="text-theme-muted text-xs">
                              {dossier.reference || 'Sans référence'} • {dossier.client?.nom || 'Client inconnu'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnassign(dossier.id)}
                          disabled={isSaving}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all disabled:opacity-50"
                          title="Retirer"
                        >
                          <MdRemove />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dossiers disponibles */}
              <div>
                <h3 className="text-lg font-semibold text-theme-primary mb-3 flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Dossiers disponibles ({availableDossiers.length})
                </h3>
                {availableDossiers.length === 0 ? (
                  <p className="text-theme-muted text-sm py-4 text-center bg-theme-tertiary rounded-xl">
                    Tous les dossiers sont assignés
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableDossiers.map(dossier => (
                      <div 
                        key={dossier.id}
                        className="flex items-center justify-between p-3 bg-theme-tertiary rounded-xl border-theme border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                            <MdFolder className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-theme-primary font-medium">{dossier.titre}</p>
                            <p className="text-theme-muted text-xs">
                              {dossier.reference || 'Sans référence'} • {dossier.client?.nom || 'Client inconnu'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssign(dossier.id)}
                          disabled={isSaving}
                          className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all disabled:opacity-50"
                          title="Assigner"
                        >
                          <MdAdd />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 sm:p-6 border-theme border-t bg-theme-tertiary flex-shrink-0">
          <button
            onClick={onClose}
            
            className="cursor-pointer px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-theme-secondary border-theme border rounded-xl font-semibold transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}