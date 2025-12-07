import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dossierService } from '../../services/dossier.service';
import type { Dossier } from '../../types/dossier.types';
import { useProcedures } from '../../hooks/useProcedures';
import { MdAdd, MdEvent } from 'react-icons/md';
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
export default function DossierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('infos');
  const { procedures, isLoading: proceduresLoading } = useProcedures(id);

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
          <span>Retour aux dossiers</span>
        </button>
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error || 'Dossier introuvable'}
        </div>
      </div>
    );
  }

const tabs = [
  { key: 'infos', label: 'Informations', icon: <MdInfo className="text-xl" />, count: undefined },
  { key: 'procedures', label: 'Procédures', icon: <MdGavel className="text-xl" />, count: procedures.length },
  { key: 'taches', label: 'Tâches', icon: <MdCheckCircle className="text-xl" />, count: 0 },
  { key: 'documents', label: 'Documents', icon: <MdDescription className="text-xl" />, count: 0 },
  { key: 'factures', label: 'Factures', icon: <MdAttachMoney className="text-xl" />, count: 0 },
  { key: 'notes', label: 'Notes', icon: <MdNote className="text-xl" />, count: 0 },
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
              {dossier.client ? `${dossier.client.nom} ${dossier.client.prenom || ''}` : 'Aucun client'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all">
            <MdEdit />
            <span>Modifier</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30">
            <MdDelete />
            <span>Supprimer</span>
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
                <label className="block text-sm font-semibold text-slate-400 mb-1">Type</label>
                <p className="text-white">{dossier.type}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">Statut</label>
                <p className="text-white">{dossier.statut.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">Priorité</label>
                <p className="text-white capitalize">{dossier.priorite}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">Domaine</label>
                <p className="text-white">{dossier.domaine || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">Tribunal</label>
                <p className="text-white">{dossier.tribunal || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">Montant en jeu</label>
                <p className="text-white">
                  {dossier.montant_en_jeu ? `${dossier.montant_en_jeu.toLocaleString()} €` : 'Non renseigné'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-400 mb-1">Description</label>
                <p className="text-white">{dossier.description || 'Aucune description'}</p>
              </div>
            </div>
          )}

            {/* Onglet Procédures */}
            {activeTab === 'procedures' && (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    Procédures du dossier ({procedures.length})
                </h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all">
                    <MdAdd className="text-lg" />
                    <span>Nouvelle Procédure</span>
                </button>
                </div>

                {proceduresLoading ? (
                <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                ) : procedures.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <MdEvent className="text-6xl text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Aucune procédure</h3>
                    <p>Ajoutez une procédure pour ce dossier</p>
                </div>
                ) : (
                <div className="space-y-3">
                    {procedures.map((proc) => (
                    <div
                        key={proc.id}
                        className="p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700 transition-all"
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

            {/* Autres onglets (placeholder) */}
            {activeTab !== 'infos' && activeTab !== 'procedures' && (
            <div className="text-center py-12 text-slate-500">
                <div className="text-6xl mb-4">{tabs.find(t => t.key === activeTab)?.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                Module {tabs.find(t => t.key === activeTab)?.label}
                </h3>
                <p>Fonctionnalité à venir...</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}