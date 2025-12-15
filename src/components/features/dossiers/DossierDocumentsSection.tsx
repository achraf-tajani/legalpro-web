import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MdCloudUpload, MdDownload, MdDelete, MdDescription, MdPictureAsPdf, MdInsertDriveFile, MdImage, MdTableChart } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useDocuments } from '../../../hooks/useDocuments';
import { documentService } from '../../../services/document.service';
import UploadDocumentModal from '../../features/documents/UploadDocumentModal';
import type { Document } from '../../../types/document.types';

interface DossierDocumentsSectionProps {
  dossierId: string;
}

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

export default function DossierDocumentsSection({ dossierId }: DossierDocumentsSectionProps) {
  const { t } = useTranslation();
  const { documents, isLoading, refetch } = useDocuments(dossierId);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
      'public': t('dossier.documents.confPublic'),
      'interne': t('dossier.documents.confInterne'),
      'confidentiel': t('dossier.documents.confConfidentiel'),
      'secret': t('dossier.documents.confSecret'),
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
    if (!window.confirm(`Supprimer "${nom}" ?`)) return;
    try {
      await documentService.delete(id);
      refetch();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
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

  if (isLoading) {
    return (
      <div className="bg-theme-surface border-theme border rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" 
               style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-theme-surface border-theme border rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-theme-primary">
            {t('dossiers.tabs.documents')} ({documents.length})
          </h3>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all border border-blue-500/30"
          >
            <MdCloudUpload />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-theme-muted">
            <MdDescription className="text-5xl sm:text-6xl opacity-50 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-theme-primary mb-2">{t('dossier.documents.empty')}</h3>
            <p className="text-sm sm:text-base">{t('dossier.documents.emptyDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {documents.map((doc: Document) => {
              const FileIcon = getFileIcon(doc.format);

              return (
                <div key={doc.id} className="bg-theme-tertiary border-theme border rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all group">
                  {/* Icône + Nom */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`text-3xl sm:text-4xl ${FileIcon.color}`}>
                      <FileIcon.icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-theme-primary font-semibold text-sm truncate">{doc.nom}</h4>
                      <p className="text-theme-muted text-xs">{doc.format?.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="space-y-1 mb-3 text-xs">
                    {doc.taille_mo && (
                      <p className="text-theme-secondary">💾 {doc.taille_mo.toFixed(2)} MB</p>
                    )}
                    <p className="text-theme-secondary">
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(doc.id, doc.nom)}
                      className="flex-1 px-2 sm:px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all text-xs sm:text-sm flex items-center justify-center space-x-1"
                    >
                      <MdDownload />
                      <span className="hidden sm:inline">Télécharger</span>
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.nom)}
                      className="px-2 sm:px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
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

        {/* Modal Upload - Portal */}
        {isUploadModalOpen && createPortal(
        <UploadDocumentModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onSuccess={refetch}
            dossierId={dossierId}
        />,
        document.body
        )}
    </>
  );
}