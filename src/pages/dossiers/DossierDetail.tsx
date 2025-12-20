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
import DossierDocumentsSection from '../../components/features/dossiers/DossierDocumentsSection';
import { useAdversairesByDossier } from '../../hooks/useAdversaires';
import { adversaireService } from '../../services/adversaire.service';
import CreateAdversaireModal from '../../components/features/dossiers/CreateAdversaireModal';
import type { Adversaire, CreateAdversaireDto, UpdateAdversaireDto } from '../../types/adversaire.types';
import { MdPerson } from 'react-icons/md';
import ViewAdversaireModal from '../../components/features/dossiers/ViewAdversaireModal';
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
import { useDocuments } from '../../hooks/useDocuments';
export default function DossierDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('infos');
  const { procedures, isLoading: proceduresLoading } = useProcedures(id);
  const { documents } = useDocuments(id);
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);
  const { factures } = useFacturesByDossier(id!);
  const { notes } = useNotesByDossier(id);
  const { taches } = useTachesByDossier(id);
  const { adversaires, refetch: refetchAdversaires } = useAdversairesByDossier(id);
  const [isAdversaireModalOpen, setIsAdversaireModalOpen] = useState(false);
  const [adversaireMode, setAdversaireMode] = useState<'create' | 'edit'>('create');
  const [editingAdversaire, setEditingAdversaire] = useState<Adversaire | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteMode, setNoteMode] = useState<'create' | 'edit'>('create');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isTacheModalOpen, setIsTacheModalOpen] = useState(false);
  const [tacheMode, setTacheMode] = useState<'create' | 'edit'>('create');
  const [editingTache, setEditingTache] = useState<Tache | null>(null);
  const [selectedAdversaire, setSelectedAdversaire] = useState<Adversaire | null>(null);
  const [isViewAdversaireModalOpen, setIsViewAdversaireModalOpen] = useState(false);
  const handleCreateAdversaire = async (data: CreateAdversaireDto) => {
    await adversaireService.create(data);
    refetchAdversaires();
  };

  const handleUpdateAdversaire = async (id: string, data: UpdateAdversaireDto) => {
    await adversaireService.update(id, data);
    refetchAdversaires();
  };

  const handleDeleteAdversaire = async (id: string) => {
    if (!window.confirm('Supprimer cet adversaire ?')) return;
    await adversaireService.delete(id);
    refetchAdversaires();
  };
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
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" 
            style={{ borderColor: `rgba(var(--color-accentStart), 0.3)`, borderTopColor: 'transparent' }}>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/dossiers')}
          className="flex items-center space-x-2 text-theme-muted hover:text-theme-primary transition-colors"
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
  { key: 'documents', label: t('dossiers.tabs.documents'), icon: <MdDescription className="text-xl" />, count: documents.length },
  { key: 'factures', label: t('dossiers.tabs.factures'), icon: <MdAttachMoney className="text-xl" />, count: factures.length },
  { key: 'notes', label: t('dossiers.tabs.notes'), icon: <MdNote className="text-xl" />, count: notes.length },
  { key: 'adversaires', label: 'Adversaires', icon: <MdPerson className="text-xl" />, count: adversaires.length },

];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => navigate('/dossiers')}
            className="p-2 rounded-lg transition-colors text-theme-muted hover:text-theme-primary"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary truncate">{dossier.titre}</h1>
            <p className="text-theme-secondary mt-1 text-sm sm:text-base truncate">
              {dossier.client ? `${dossier.client.nom} ${dossier.client.prenom || ''}` : t('dossiers.noClient')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={() => {
              setDossierMode('edit');
              setIsDossierModalOpen(true);
            }}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-theme-tertiary hover:bg-opacity-80 text-theme-primary rounded-lg transition-all text-sm sm:text-base"
          >
            <MdEdit />
            <span className="hidden sm:inline">{t('common.edit')}</span>
          </button>
          <button 
            onClick={handleDeleteDossier}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30 text-sm sm:text-base"
          >
            <MdDelete />
            <span className="hidden sm:inline">{t('common.delete')}</span>
          </button>
        </div>
      </div>
        {/* Tabs */}
        <div className="bg-theme-surface border-theme border rounded-2xl overflow-hidden">
          <div className="border-theme border-b flex overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {tabs.map((tab) => (
                <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`cursor-pointer flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap border-b-2 text-sm sm:text-base flex-shrink-0 ${
                          activeTab === tab.key
                            ? 'border-accent-start text-theme-primary bg-theme-tertiary'
                            : 'border-transparent text-theme-muted hover:text-theme-primary hover:bg-theme-tertiary hover:bg-opacity-30'
                        }`}
                        style={activeTab === tab.key ? { borderBottomColor: `rgb(var(--color-accentStart))` } : undefined}
                      >
                        <span className="text-lg sm:text-xl">{tab.icon}</span>
                        <span className="hidden md:inline">{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-xs" style={{ 
                            backgroundColor: `rgba(var(--color-accentStart), 0.2)`,
                            color: `rgb(var(--color-accentStart))`
                          }}>
                            {tab.count}
                          </span>
                        )}
                      </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Onglet Infos */}
            {activeTab === 'infos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-theme-secondary mb-1">{t('dossiers.detail.type')}</label>
                  <p className="text-theme-primary">{dossier.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-theme-secondary mb-1">{t('dossiers.detail.statut')}</label>
                  <p className="text-theme-primary">{dossier.statut.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-theme-secondary mb-1">{t('dossiers.detail.priorite')}</label>
                  <p className="text-theme-primary capitalize">{dossier.priorite}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-theme-secondary mb-1">{t('dossiers.detail.domaine')}</label>
                  <p className="text-theme-primary">{dossier.domaine || t('dossiers.detail.notSpecified')}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-theme-secondary mb-1">{t('dossiers.detail.tribunal')}</label>
                  <p className="text-theme-primary">{dossier.tribunal || t('dossiers.detail.notSpecified')}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-theme-secondary mb-1">{t('dossiers.detail.montant')}</label>
                  <p className="text-theme-primary">
                    {dossier.montant_en_jeu ? `${dossier.montant_en_jeu.toLocaleString()} €` : t('dossiers.detail.notSpecified')}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-theme-secondary mb-1">{t('dossiers.detail.description')}</label>
                  <p className="text-theme-primary">{dossier.description || t('dossiers.detail.noDescription')}</p>
                </div>
              </div>
            )}

            {/* Onglet Procédures */}
            {activeTab === 'procedures' && (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-theme-primary">
                    {t('procedures.list.title', { count: procedures.length })}
                  </h3>
                  <button 
                    onClick={() => setIsProcedureModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-accent-gradient hover:bg-accent-gradient-hover text-white rounded-lg font-semibold shadow-lg transition-all"
                  >
                    <MdAdd className="text-lg" />
                    <span>{t('procedures.new')}</span>
                  </button>
                </div>

                {proceduresLoading ? (
                <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}></div>
                </div>
                ) : procedures.length === 0 ? (
                <div className="text-center py-12 text-theme-muted">
                    <MdEvent className="text-6xl opacity-50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-theme-primary mb-2">{t('procedures.list.empty')}</h3>
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
                    className="p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl border-theme border transition-all cursor-pointer"
                  >
                        <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-semibold text-theme-primary mb-1">{proc.titre}</h4>
                            <p className="text-sm text-theme-secondary mb-2">{proc.type}</p>
                            {proc.date_evenement && (
                            <div className="flex items-center space-x-2 text-sm text-theme-muted">
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
                                proc.priorite === 'critical' ? 'badge-red' :
                                proc.priorite === 'high' ? 'badge-orange' :
                                proc.priorite === 'normal' ? 'badge-blue' :
                                'badge-gray'
                            }`}>
                            {proc.priorite}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  proc.statut === 'completed' ? 'badge-green' :
                                  proc.statut === 'in_progress' ? 'badge-blue' :
                                  proc.statut === 'cancelled' ? 'badge-red' :
                                  'badge-yellow'
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
                  <h3 className="text-xl font-bold text-theme-primary">
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
                  <div className="text-center py-12 text-theme-muted">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-semibold text-theme-primary mb-2">{t('factures.empty')}</h3>
                    <p>{t('factures.emptyDescription')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {factures.map((facture) => (
                      <div
                        key={facture.id}
                        onClick={() => navigate(`/factures/${facture.id}`)}
                        className="p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl border-theme border transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-theme-primary mb-1">
                              Facture {facture.numero}
                            </h4>
                            <p className="text-sm text-theme-secondary">
                              Émise le {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-theme-primary mb-1">
                              {facture.montant_ttc.toFixed(2)} €
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                facture.statut === 'payee' ? 'badge-green' :
                                facture.statut === 'envoyee' ? 'badge-blue' :
                                facture.statut === 'en_retard' ? 'badge-red' :
                                'badge-gray'
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
                  <h3 className="text-xl font-bold text-theme-primary">
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
                  <div className="text-center py-12 text-theme-muted">
                    <MdNote className="text-6xl opacity-50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-theme-primary mb-2">{t('notes.empty')}</h3>
                    <p>{t('notes.emptyDescription')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl border-theme border transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-theme-primary">{note.titre}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-theme-muted">
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
                        <p className="text-sm text-theme-secondary line-clamp-2">{note.contenu}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'taches' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-theme-primary">
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
                  <div className="text-center py-12 text-theme-muted">
                    <MdCheckCircle className="text-6xl opacity-50 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-theme-primary mb-2">{t('taches.empty')}</h3>
                    <p>{t('taches.emptyDescription')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {taches.map((tache) => (
                      <div
                        key={tache.id}
                        className="p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl border-theme border transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-theme-primary">{tache.titre}</h4>
                            {tache.description && (
                            <p className="text-sm text-theme-secondary mt-1 line-clamp-1">{tache.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                tache.priorite === 'critical' ? 'badge-red' :
                                tache.priorite === 'high' ? 'badge-orange' :
                                tache.priorite === 'normal' ? 'badge-blue' :
                                'badge-gray'
                            }`}>
                              {t(`taches.priorite.${tache.priorite}`)}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                tache.statut === 'completed' ? 'badge-green' :
                                tache.statut === 'in_progress' ? 'badge-blue' :
                                tache.statut === 'cancelled' ? 'badge-red' :
                                'badge-yellow'
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
                          <p className="text-xs text-theme-muted">
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
              <DossierDocumentsSection dossierId={id!} />
            )}     

            {activeTab === 'adversaires' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-theme-primary">
                    Adversaires ({adversaires.length})
                  </h3>
                  <button
                    onClick={() => {
                      setAdversaireMode('create');
                      setEditingAdversaire(null);
                      setIsAdversaireModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-semibold transition-all"
                  >
                    <MdAdd />
                    <span>Ajouter</span>
                  </button>
                </div>

                {adversaires.length === 0 ? (
                  <div className="text-center py-12 text-theme-muted">
                    <MdPerson className="text-6xl opacity-50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-theme-primary mb-2">Aucun adversaire</h3>
                    <p>Ajoutez les parties adverses de ce dossier</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adversaires.map((adversaire) => (
                      <div
                        key={adversaire.id}
                        onClick={() => {
                          setSelectedAdversaire(adversaire);
                          setIsViewAdversaireModalOpen(true);
                        }}
                        className="p-4 bg-theme-tertiary hover:bg-opacity-80 rounded-xl border-theme border transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MdPerson className="text-xl text-red-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-theme-primary">{adversaire.nom}</h4>
                              <p className="text-sm text-theme-secondary">
                                {adversaire.type_adversaire || 'Type non spécifié'}
                                {adversaire.fonction && ` • ${adversaire.fonction}`}
                              </p>
                              {adversaire.avocat_adverse && (
                                <p className="text-sm text-theme-muted mt-1">
                                  Avocat: {adversaire.avocat_adverse}
                                  {adversaire.cabinet && ` (${adversaire.cabinet})`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Modal Adversaire */}
        <CreateAdversaireModal
          isOpen={isAdversaireModalOpen}
          onClose={() => {
            setIsAdversaireModalOpen(false);
            setAdversaireMode('create');
            setEditingAdversaire(null);
          }}
          onSubmit={handleCreateAdversaire}
          onUpdate={handleUpdateAdversaire}
          dossierId={id!}
          adversaire={editingAdversaire}
          mode={adversaireMode}
        />

        {/* Modal View Adversaire */}
        <ViewAdversaireModal
          isOpen={isViewAdversaireModalOpen}
          onClose={() => {
            setIsViewAdversaireModalOpen(false);
            setSelectedAdversaire(null);
          }}
          adversaire={selectedAdversaire}
          onEdit={(adv) => {
            setIsViewAdversaireModalOpen(false);
            setEditingAdversaire(adv);
            setAdversaireMode('edit');
            setIsAdversaireModalOpen(true);
          }}
          onDelete={(id) => {
            setIsViewAdversaireModalOpen(false);
            handleDeleteAdversaire(id);
          }}
        />
    </div>
  );
}