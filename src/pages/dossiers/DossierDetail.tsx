import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dossierService } from '../../services/dossier.service';
import type { Dossier } from '../../types/dossier.types';
import { MdAdd, MdEvent } from 'react-icons/md';
import { procedureService } from '../../services/procedure.service';
import CreateProcedureModal from '../../components/features/dossiers/CreateProcedureModal';
import type { CreateProcedureDto } from '../../types/procedure.types';
import ViewProcedureModal from '../../components/features/dossiers/ViewProcedureModal';
import type { Procedure } from '../../types/procedure.types';
import CreateDossierModal from '../../components/features/dossiers/CreateDossierModal';
import type { UpdateDossierDto } from '../../types/dossier.types';
import { useTranslation } from 'react-i18next';
import CreateNoteModal from '../../components/features/dossiers/CreateNoteModal';
import { noteService } from '../../services/note.service';
import { tacheService } from '../../services/tache.service';
import type { Tache, CreateTacheDto, UpdateTacheDto } from '../../types/tache.types';
import CreateTacheModal from '../../components/features/taches/CreateTacheModal';

import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete,
  MdInfo,
  MdGavel,
  MdCheckCircle,
  MdDescription,
  MdAttachMoney,
  MdNote
} from 'react-icons/md';
import { useProcedures } from '../../hooks/useProcedures';
import { useClients } from '../../hooks/useClients';
import { useFacturesByDossier } from '../../hooks/useFactures';
import { useNotesByDossier } from '../../hooks/useNotes';
import { useTachesByDossier } from '../../hooks/useTaches';
import type { CreateNoteDto, Note, UpdateNoteDto } from '../../types/note.types';
export default function DossierDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('infos');
  const { procedures, isLoading: proceduresLoading } = useProcedures(id);
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);
  const { factures } = useFacturesByDossier(id!);
  const { notes } = useNotesByDossier(id);
  const { taches } = useTachesByDossier(id);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteMode, setNoteMode] = useState<'create' | 'edit'>('create');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isTacheModalOpen, setIsTacheModalOpen] = useState(false);
  const [tacheMode, setTacheMode] = useState<'create' | 'edit'>('create');
  const [editingTache, setEditingTache] = useState<Tache | null>(null);
  
  const handleDeleteTache = async (id: string) => {
    if (!window.confirm(t('taches.confirmDelete'))) return;
    await tacheService.delete(id);
    window.location.reload();
  };
  const handleCreateTache = async (data: CreateTacheDto) => {
    await tacheService.create(data);
    window.location.reload();
  };
  const handleUpdateTache = async (id: string, data: UpdateTacheDto) => {
    await tacheService.update(id, data);
    window.location.reload();
  };
  const handleCreateProcedure = async (data: CreateProcedureDto) => {
    await procedureService.create(data);
    window.location.reload(); // Temporaire, on optimisera
  };
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const handleDeleteProcedure = async (id: string) => {
    await procedureService.delete(id);
    window.location.reload();
  };
  const [procedureMode, setProcedureMode] = useState<'create' | 'edit'>('create');
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const handleUpdateProcedure = async (id: string, data: CreateProcedureDto) => {
    await procedureService.update(id, data);
    window.location.reload();
  };
  const { clients } = useClients();
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [dossierMode, setDossierMode] = useState<'create' | 'edit'>('edit');
  const handleUpdateDossier = async (id: string, data: UpdateDossierDto) => {
    await dossierService.update(id, data);
    window.location.reload();
  };
  const handleDeleteDossier = async () => {
    if (!window.confirm(t('dossiers.confirmDelete'))) return;
    
    try {
      await dossierService.delete(id!);
      navigate('/dossiers');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(t('common.error'));
    }
  };
  const handleCreateNote = async (data: CreateNoteDto) => {
    await noteService.create(data);
    window.location.reload();
  };

  const handleUpdateNote = async (id: string, data: UpdateNoteDto) => {
    await noteService.update(id, data);
    window.location.reload();
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm(t('notes.confirmDelete'))) return;
    await noteService.delete(id);
    window.location.reload();
  };
  useEffect(() => {
    const fetchDossier = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await dossierService.getById(id);
        setDossier(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement du dossier');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossier();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/dossiers')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <MdArrowBack />
          <span>{t('common.back')}</span>
        </button>
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error || 'Dossier introuvable'}
        </div>
      </div>
    );
  }

const tabs = [
  { key: 'infos', label: t('dossiers.tabs.infos'), icon: <MdInfo className="text-xl" />, count: undefined },
  { key: 'procedures', label: t('dossiers.tabs.procedures'), icon: <MdGavel className="text-xl" />, count: procedures.length },
  { key: 'taches', label: t('dossiers.tabs.taches'), icon: <MdCheckCircle className="text-xl" />, count: taches.length },
  { key: 'documents', label: t('dossiers.tabs.documents'), icon: <MdDescription className="text-xl" />, count: 0 },
  { key: 'factures', label: t('dossiers.tabs.factures'), icon: <MdAttachMoney className="text-xl" />, count: factures.length },
  { key: 'notes', label: t('dossiers.tabs.notes'), icon: <MdNote className="text-xl" />, count: notes.length },
];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dossiers')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{dossier.titre}</h1>
            <p className="text-slate-400 mt-1">
              {dossier.client ? `${dossier.client.nom} ${dossier.client.prenom || ''}` : t('dossiers.noClient')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setDossierMode('edit');
              setIsDossierModalOpen(true);
            }}
            className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
          >
            <MdEdit />
            <span>{t('common.edit')}</span>
          </button>
          <button 
            onClick={handleDeleteDossier}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30"
          >
            <MdDelete />
            <span>{t('common.delete')}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="border-b border-slate-800 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-white bg-slate-800/50'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Onglet Infos */}
          {activeTab === 'infos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">{t('dossiers.detail.type')}</label>
                <p className="text-white">{dossier.type}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">{t('dossiers.detail.statut')}</label>
                <p className="text-white">{dossier.statut.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">{t('dossiers.detail.priorite')}</label>
                <p className="text-white capitalize">{dossier.priorite}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">{t('dossiers.detail.domaine')}</label>
                <p className="text-white">{dossier.domaine || t('dossiers.detail.notSpecified')}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">{t('dossiers.detail.tribunal')}</label>
                <p className="text-white">{dossier.tribunal || t('dossiers.detail.notSpecified')}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">{t('dossiers.detail.montant')}</label>
                <p className="text-white">
                  {dossier.montant_en_jeu ? `${dossier.montant_en_jeu.toLocaleString()} €` : t('dossiers.detail.notSpecified')}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-400 mb-1">{t('dossiers.detail.description')}</label>
                <p className="text-white">{dossier.description || t('dossiers.detail.noDescription')}</p>
              </div>
            </div>
          )}

            {/* Onglet Procédures */}
            {activeTab === 'procedures' && (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {t('procedures.list.title', { count: procedures.length })}
                  </h3>
                  <button 
                    onClick={() => setIsProcedureModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all"
                  >
                    <MdAdd className="text-lg" />
                    <span>{t('procedures.new')}</span>
                  </button>
                </div>

                {proceduresLoading ? (
                <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                ) : procedures.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <MdEvent className="text-6xl text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{t('procedures.list.empty')}</h3>
                    <p>{t('procedures.list.emptyDescription')}</p>
                </div>
                ) : (
                <div className="space-y-3">
                    {procedures.map((proc) => (
                  <div
                    key={proc.id}
                    onClick={() => {
                      setSelectedProcedure(proc);
                      setIsViewModalOpen(true);
                    }}
                    className="p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700 transition-all cursor-pointer"
                  >
                        <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{proc.titre}</h4>
                            <p className="text-sm text-slate-400 mb-2">{proc.type}</p>
                            {proc.date_evenement && (
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <MdEvent />
                                <span>{new Date(proc.date_evenement).toLocaleDateString('fr-FR', { 
                                day: '2-digit', 
                                month: 'long', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                                })}</span>
                            </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            proc.priorite === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                            proc.priorite === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                            proc.priorite === 'normal' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                            'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                            }`}>
                            {proc.priorite}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            proc.statut === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                            proc.statut === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                            proc.statut === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                            'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            }`}>
                            {proc.statut}
                            </span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            )}
           {activeTab === 'factures' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {t('factures.title')} ({factures.length})
                  </h3>
                  <button
                    onClick={() => navigate(`/factures/new?dossier=${dossier.id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all"
                  >
                    <MdAdd />
                    <span>{t('factures.new')}</span>
                  </button>
                </div>

                {factures.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Aucune facture</h3>
                    <p>Créez une facture pour ce dossier</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {factures.map((facture) => (
                      <div
                        key={facture.id}
                        onClick={() => navigate(`/factures/${facture.id}`)}
                        className="p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">
                              Facture {facture.numero}
                            </h4>
                            <p className="text-sm text-slate-400">
                              Émise le {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white mb-1">
                              {facture.montant_ttc.toFixed(2)} €
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              facture.statut === 'payee' ? 'bg-green-600 text-white' :
                              facture.statut === 'envoyee' ? 'bg-blue-600 text-white' :
                              facture.statut === 'en_retard' ? 'bg-red-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {t(`factures.statut.${facture.statut}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {t('notes.title')} ({notes.length})
                  </h3>
                  <button
                    onClick={() => {
                      setNoteMode('create');
                      setEditingNote(null);
                      setIsNoteModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all"
                  >
                    <MdAdd />
                    <span>{t('notes.new')}</span>
                  </button>
                </div>

                {notes.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MdNote className="text-6xl text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{t('notes.empty')}</h3>
                    <p>{t('notes.emptyDescription')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white">{note.titre}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-500">
                              {new Date(note.created_at).toLocaleDateString('fr-FR')}
                            </span>
                            <button
                              onClick={() => {
                                setEditingNote(note);
                                setNoteMode('edit');
                                setIsNoteModalOpen(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <MdEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">{note.contenu}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          {activeTab === 'taches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {t('taches.title')} ({taches.length})
                </h3>
                <button
                  onClick={() => {
                    setTacheMode('create');
                    setEditingTache(null);
                    setIsTacheModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all"
                >
                  <MdAdd />
                  <span>{t('taches.new')}</span>
                </button>
              </div>

              {taches.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <MdCheckCircle className="text-6xl text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{t('taches.empty')}</h3>
                  <p>{t('taches.emptyDescription')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {taches.map((tache) => (
                    <div
                      key={tache.id}
                      className="p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{tache.titre}</h4>
                          {tache.description && (
                            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{tache.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            tache.priorite === 'critical' ? 'bg-red-500/20 text-red-400' :
                            tache.priorite === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            tache.priorite === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {t(`taches.priorite.${tache.priorite}`)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            tache.statut === 'completed' ? 'bg-green-500/20 text-green-400' :
                            tache.statut === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                            tache.statut === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {t(`taches.statut.${tache.statut}`)}
                          </span>
                          <button
                            onClick={() => {
                              setEditingTache(tache);
                              setTacheMode('edit');
                              setIsTacheModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteTache(tache.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                      {tache.date_echeance && (
                        <p className="text-xs text-slate-500">
                          Échéance: {new Date(tache.date_echeance).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

            {activeTab === 'documents' && (
              <div className="text-center py-12 text-slate-500">
                <MdDescription className="text-6xl text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('common.module')} {t('dossiers.tabs.documents')}
                </h3>
                <p>Fonctionnalité à venir...</p>
              </div>
            )}
            {/* Autres onglets (placeholder) */}
            {activeTab !== 'infos' && activeTab !== 'procedures' && activeTab !== 'factures' && activeTab !== 'notes' && activeTab !== 'taches' && (
            <div className="text-center py-12 text-slate-500">
                <div className="text-6xl mb-4">{tabs.find(t => t.key === activeTab)?.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                {t('common.module')} {tabs.find(t => t.key === activeTab)?.label}
                </h3>
                <p>Fonctionnalité à venir...</p>
            </div>
            )}
        </div>
      </div>
      {/* Modal Procédure */}
      <CreateProcedureModal
        isOpen={isProcedureModalOpen}
        onClose={() => {
          setIsProcedureModalOpen(false);
          
          // Si on était en mode edit, on revient au View modal
          if (procedureMode === 'edit' && editingProcedure) {
            setIsViewModalOpen(true);
            setSelectedProcedure(editingProcedure);
          }
          
          // Reset
          setProcedureMode('create');
          setEditingProcedure(null);
        }}
        onSubmit={handleCreateProcedure}
        onUpdate={handleUpdateProcedure}
        dossierId={id!}
        dossierType={dossier.type}
        procedure={editingProcedure}
        mode={procedureMode}
      />

      {/* Modal View Procédure */}
        <ViewProcedureModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProcedure(null);
          }}
          procedure={selectedProcedure}
          onEdit={(proc) => {
            setIsViewModalOpen(false);
            setEditingProcedure(proc);
            setProcedureMode('edit');
            setIsProcedureModalOpen(true);
          }}
          onDelete={handleDeleteProcedure}
        />

      {/* Modal Edit Dossier */}
      <CreateDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => {
          setIsDossierModalOpen(false);
          setDossierMode('edit');
        }}
        onSubmit={async () => {}} // Pas utilisé en mode edit
        onUpdate={handleUpdateDossier}
        clients={clients}
        dossier={dossier}
        mode={dossierMode}
      />
      {/* Modal Note */}
      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setNoteMode('create');
          setEditingNote(null);
        }}
        onSubmit={handleCreateNote}
        onUpdate={handleUpdateNote}
        dossierId={id!}
        note={editingNote}
        mode={noteMode}
      />
      {/* Modal Tâche */}
      <CreateTacheModal
        isOpen={isTacheModalOpen}
        onClose={() => {
          setIsTacheModalOpen(false);
          setTacheMode('create');
          setEditingTache(null);
        }}
        onSubmit={handleCreateTache}
        onUpdate={handleUpdateTache}
        dossierId={id!}
        tache={editingTache}
        mode={tacheMode}
      />
    </div>
  );
}