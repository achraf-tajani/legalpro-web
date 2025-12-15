import { useState, useCallback } from 'react';
import { MdClose, MdCloudUpload, MdDescription } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useDossiers } from '../../../hooks/useDossiers';
import { documentService, type CreateDocumentDto } from '../../../services/document.service';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dossierId?: string;
}

export default function UploadDocumentModal({ isOpen, onClose, onSuccess, dossierId }: UploadDocumentModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { dossiers } = useDossiers();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<CreateDocumentDto>({
    id_dossier: dossierId || '',
    nom: '',
    description: '',
    categorie: 'autre',
    niveau_confidentialite: 'confidentiel',
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      if (!formData.nom) {
        setFormData({ ...formData, nom: files[0].name });
      }
    }
  }, [formData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      if (!formData.nom) {
        setFormData({ ...formData, nom: files[0].name });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.id_dossier) return;

    try {
      setIsUploading(true);
      await documentService.upload(file, formData);
      onSuccess();
      onClose();
      setFile(null);
      setFormData({
        id_dossier: dossierId || '',
        nom: '',
        description: '',
        categorie: 'autre',
        niveau_confidentialite: 'confidentiel',
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
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
              <MdCloudUpload className="text-2xl sm:text-3xl text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t('upload.document.title')}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
              <MdClose className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpload} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Dossier */}
          {!dossierId && (
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('upload.document.dossier')}
              </label>
              <select
                required
                value={formData.id_dossier}
                onChange={(e) => setFormData({ ...formData, id_dossier: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
              >
                <option value="">
                   {t('upload.document.selectDossier')}
                </option>
                {dossiers.map(d => (
                  <option key={d.id} value={d.id}>{d.titre}</option>
                ))}
              </select>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-theme bg-theme-tertiary hover:border-blue-500/50'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            
            {file ? (
              <div className="space-y-3">
                <MdDescription className="text-5xl text-blue-500 mx-auto" />
                <p className="text-theme-primary font-semibold">{file.name}</p>
                <p className="text-theme-secondary text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  {t('upload.document.delete')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <MdCloudUpload className="text-6xl text-theme-muted mx-auto" />
                <div>
                  <p className="text-theme-primary font-semibold mb-1">
                    {t('upload.document.dragDrop')}
                  </p>
                  <label htmlFor="file-upload" className="text-blue-500 hover:text-blue-400 cursor-pointer font-semibold">
                     {t('upload.document.browse')}
                  </label>
                </div>
                <p className="text-theme-muted text-xs">
                 {t('upload.document.formats')}
                </p>
              </div>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              {t('upload.document.documentName')}
              </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">{t('upload.document.description')}</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
            />
          </div>

          {/* Catégorie & Confidentialité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2"> {t('upload.document.category')}</label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
              >
                <option value="contrat">{t('upload.document.categoryContrat')}</option>
                <option value="facture">{t('upload.document.categoryFacture')}</option>
                <option value="courrier">{t('upload.document.categoryCourrier')}</option>
                <option value="procedure">{t('upload.document.categoryProcedure')}</option>
                <option value="autre">{t('upload.document.categoryAutre')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">{t('upload.document.confidentiality')}</label>
              <select
                value={formData.niveau_confidentialite}
                onChange={(e) => setFormData({ ...formData, niveau_confidentialite: e.target.value as any })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
              >
                <option value="public">{t('upload.document.confPublic')}</option>
                <option value="interne">{t('upload.document.confInterne')}</option>
                <option value="confidentiel">{t('upload.document.confConfidentiel')}</option>
                <option value="secret">{t('upload.document.confSecret')}</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-theme-tertiary border-theme border-t flex flex-col-reverse sm:flex-row justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="w-full sm:w-auto px-6 py-3 border-theme border rounded-xl text-theme-secondary font-semibold hover:bg-theme-tertiary transition-all"
          >
            {t('upload.document.cancel')}
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !file || !formData.id_dossier}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50"
          >
            {isUploading ?  t('upload.document.uploading') : t('upload.document.uploadBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}