import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTaches } from '../../hooks/useTaches';
import { useDossiers } from '../../hooks/useDossiers';
import { tacheService } from '../../services/tache.service';
import CreateTacheModal from '../../components/features/taches/CreateTacheModal';
import type { Tache, CreateTacheDto, UpdateTacheDto } from '../../types/tache.types';
import { MdAdd, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md';

export default function TachesList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { taches, isLoading } = useTaches();
  const { dossiers } = useDossiers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingTache, setEditingTache] = useState<Tache | null>(null);

  // Filtres
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [filterPriorite, setFilterPriorite] = useState<string>('all');
  const [filterDossier, setFilterDossier] = useState<string>('all');

  const handleCreate = async (data: CreateTacheDto) => {
    await tacheService.create(data);
    window.location.reload();
  };

  const handleUpdate = async (id: string, data: UpdateTacheDto) => {
    await tacheService.update(id, data);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('taches.confirmDelete'))) return;
    await tacheService.delete(id);
    window.location.reload();
  };

  // Filtrer les tâches
  const tachesFiltrees = taches.filter(tache => {
    if (filterStatut !== 'all' && tache.statut !== filterStatut) return false;
    if (filterPriorite !== 'all' && tache.priorite !== filterPriorite) return false;
    if (filterDossier !== 'all' && tache.id_dossier !== filterDossier) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('taches.title')}</h1>
          <p className="text-slate-400">
            {tachesFiltrees.length} tâche(s)
          </p>
        </div>
        <button
          onClick={() => {
            setMode('create');
            setEditingTache(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all"
        >
          <MdAdd className="text-xl" />
          <span>{t('taches.new')}</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre Statut */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('taches.statut')}
            </label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="all">Tous</option>
              <option value="not_started">{t('taches.statut.not_started')}</option>
              <option value="in_progress">{t('taches.statut.in_progress')}</option>
              <option value="pending">{t('taches.statut.pending')}</option>
              <option value="completed">{t('taches.statut.completed')}</option>
              <option value="cancelled">{t('taches.statut.cancelled')}</option>
            </select>
          </div>

          {/* Filtre Priorité */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('taches.priorite')}
            </label>
            <select
              value={filterPriorite}
              onChange={(e) => setFilterPriorite(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="all">Toutes</option>
              <option value="low">{t('taches.priorite.low')}</option>
              <option value="normal">{t('taches.priorite.normal')}</option>
              <option value="high">{t('taches.priorite.high')}</option>
              <option value="critical">{t('taches.priorite.critical')}</option>
            </select>
          </div>

          {/* Filtre Dossier */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dossier
            </label>
            <select
              value={filterDossier}
              onChange={(e) => setFilterDossier(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="all">Tous</option>
              {dossiers.map(d => (
                <option key={d.id} value={d.id}>{d.titre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      {tachesFiltrees.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12">
          <div className="text-center text-slate-500">
            <MdCheckCircle className="text-6xl text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('taches.empty')}</h3>
            <p className="mb-4">{t('taches.emptyDescription')}</p>
            <button
              onClick={() => {
                setMode('create');
                setEditingTache(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              {t('taches.new')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {tachesFiltrees.map((tache) => {
            const dossier = dossiers.find(d => d.id === tache.id_dossier);
            
            return (
              <div
                key={tache.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Info tâche */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {tache.titre}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tache.priorite === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        tache.priorite === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        tache.priorite === 'normal' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {t(`taches.priorite.${tache.priorite}`)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tache.statut === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        tache.statut === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        tache.statut === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {t(`taches.statut.${tache.statut}`)}
                      </span>
                    </div>
                    
                    {tache.description && (
                      <p className="text-slate-400 mb-2 line-clamp-2">{tache.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>📁 {dossier?.titre || 'Dossier inconnu'}</span>
                      {tache.date_echeance && (
                        <span>📅 {new Date(tache.date_echeance).toLocaleDateString('fr-FR')}</span>
                      )}
                      <span>📊 {tache.progression}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingTache(tache);
                        setMode('edit');
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                      title="Modifier"
                    >
                      <MdEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(tache.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Barre de progression */}
                {tache.progression > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${tache.progression}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CreateTacheModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMode('create');
          setEditingTache(null);
        }}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        dossiers={dossiers.map(d => ({ id: d.id, titre: d.titre }))}
        tache={editingTache}
        mode={mode}
      />
    </div>
  );
}