import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocuments } from '../../hooks/useDocuments';
import { useDossiers } from '../../hooks/useDossiers';
import { documentService } from '../../services/document.service';
import UploadDocumentModal from '../../components/features/documents/UploadDocumentModal';
import { MdCloudUpload, MdDownload, MdDelete, MdDescription, MdPictureAsPdf, MdInsertDriveFile, MdImage, MdTableChart } from 'react-icons/md';
import type { Document } from '../../types/document.types';

const FILE_ICONS = {
  pdf: { icon: MdPictureAsPdf, color: 'text-red-500' },
  doc: { icon: MdDescription, color: 'text-blue-500' },
  docx: { icon: MdDescription, color: 'text-blue-500' },
  xls: { icon: MdTableChart, color: 'text-green-500' },
  xlsx: { icon: MdTableChart, color: 'text-green-500' },
  png: { icon: MdImage, color: 'text-orange-500' },
  jpg: { icon: MdImage, color: 'text-orange-500' },
  jpeg: { icon: MdImage, color: 'text-orange-500' },
  default: { icon: MdInsertDriveFile, color: 'text-theme-muted' },
};

export default function DocumentsList() {
  const { t } = useTranslation();
  const { documents, isLoading, refetch } = useDocuments();
  const { dossiers } = useDossiers();
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getFileIcon = (format?: string) => {
    if (!format) return FILE_ICONS.default;
    const ext = format.replace('.', '').toLowerCase();
    return FILE_ICONS[ext as keyof typeof FILE_ICONS] || FILE_ICONS.default;
  };

  const getStatutBadgeClass = (statut: string) => {
    switch (statut) {
      case 'validé': return 'badge-green';
      case 'brouillon': return 'badge-yellow';
      case 'archivé': return 'badge-gray';
      case 'supprimé': return 'badge-red';
      default: return 'badge-gray';
    }
  };
  const getStatutLabel = (statut: string) => {
    const statutMap: Record<string, string> = {
      'validé': t('dossier.documents.statutValide'),
      'brouillon': t('dossier.documents.statutBrouillon'),
      'archivé': t('dossier.documents.statutArchive'),
      'supprimé': t('dossier.documents.statutSupprime'),
    };
    return statutMap[statut] || statut;
  };
  const getCategorieLabel = (categorie: string) => {
    const categorieMap: Record<string, string> = {
      'contrat': t('dossier.documents.categoryContrat'),
      'facture': t('dossier.documents.categoryFacture'),
      'courrier': t('dossier.documents.categoryCourrier'),
      'procedure': t('dossier.documents.categoryProcedure'),
      'autre': t('dossier.documents.categoryAutre'),
    };
    return categorieMap[categorie] || categorie;
  };
  const getConfidentialiteLabel = (niveau: string) => {
  const map: Record<string, string> = {
    'public': t('upload.document.confPublic'),
    'interne': t('upload.document.confInterne'),
    'confidentiel': t('upload.document.confConfidentiel'),
    'secret': t('upload.document.confSecret'),
  };
  return map[niveau] || niveau;
};

const getConfidentialiteBadgeClass = (niveau: string) => {
  switch (niveau) {
    case 'public': return 'badge-gray';
    case 'interne': return 'badge-blue';
    case 'confidentiel': return 'badge-orange';
    case 'secret': return 'badge-red';
    default: return 'badge-gray';
  }
};
                
  const handleDelete = async (id: string, nom: string) => {
    if (!window.confirm(t('documents.list.deleteConfirm',{nom:nom}))) return;
    try {
      await documentService.delete(id);
      refetch();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(t('documents.list.errorDelete'));
    }
  };

  const handleDownload = async (id: string, nom: string) => {
    try {
      await documentService.download(id, nom);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (selectedDossier && doc.id_dossier !== selectedDossier) return false;
    if (selectedCategorie && doc.categorie !== selectedCategorie) return false;
    if (searchQuery && !doc.nom.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" 
             style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 pb-4 border-b border-theme mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-theme-primary mb-2">{t('documents.list.title')}</h1>
            <p className="text-theme-secondary">
              {filteredDocuments.length} {t('documents.list.count')}{filteredDocuments.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            <MdCloudUpload className="text-xl" />
            <span>{t('documents.list.uploadBtn')}</span>
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 pb-6">
          {/* Filtres */}
          <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">{t('documents.list.filterDossier')}</label>
                <select
                  value={selectedDossier}
                  onChange={(e) => setSelectedDossier(e.target.value)}
                  className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="">{t('documents.list.filterDossierAll')}</option>
                  {dossiers.map(d => (
                    <option key={d.id} value={d.id}>{d.titre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">{t('documents.list.filterCategory')}</label>
                <select
                  value={selectedCategorie}
                  onChange={(e) => setSelectedCategorie(e.target.value)}
                  className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="">{t('documents.list.filterCategoryAll')}</option>
                  <option value="contrat">{t('documents.list.categoryContrat')}</option>
                  <option value="facture">{t('documents.list.categoryFacture')}</option>
                  <option value="courrier">{t('documents.list.categoryCourrier')}</option>
                  <option value="procedure">{t('documents.list.categoryProcedure')}</option>
                  <option value="autre">{t('documents.list.categoryAutre')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">{t('documents.list.filterSearch')}</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('documents.list.searchPlaceholder')}
                  className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary focus:ring-2 focus:ring-offset-0"
                />
              </div>
            </div>
          </div>

          {/* Liste des documents */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 text-theme-muted">
              <MdDescription className="text-6xl opacity-50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-theme-primary mb-2">{t('documents.list.empty')}</h3>
              <p className="text-sm">{t('documents.list.emptyDescription')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc: Document) => {
                const FileIcon = getFileIcon(doc.format);
                const dossier = dossiers.find(d => d.id === doc.id_dossier);

                return (
                  <div key={doc.id} className="bg-theme-surface border-theme border rounded-xl p-4 hover:shadow-lg transition-all group">
                    {/* Icône fichier */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`text-4xl ${FileIcon.color}`}>
                        <FileIcon.icon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-theme-primary font-semibold text-sm truncate">{doc.nom}</h3>
                        <p className="text-theme-muted text-xs">{doc.format?.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="space-y-2 mb-3">
                      {dossier && (
                        <p className="text-xs text-theme-secondary truncate">
                          📁 {dossier.titre}
                        </p>
                      )}
                      {doc.taille_mo && (
                        <p className="text-xs text-theme-secondary">
                          💾 {doc.taille_mo.toFixed(2)} MB
                        </p>
                      )}
                      <p className="text-xs text-theme-secondary">
                        📅 {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutBadgeClass(doc.statut)}`}>
                        {getStatutLabel(doc.statut)}
                      </span>
                      {doc.categorie && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium badge-blue">
                           {getCategorieLabel(doc.categorie)}
                        </span>
                      )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidentialiteBadgeClass(doc.niveau_confidentialite)}`}>
                        {getConfidentialiteLabel(doc.niveau_confidentialite)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(doc.id, doc.nom)}
                        className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all text-sm flex items-center justify-center space-x-1"
                      >
                        <MdDownload />
                        <span>{t('documents.list.download')}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.nom)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Upload */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}