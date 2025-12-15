import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import type { Note, CreateNoteDto, UpdateNoteDto } from '../../../types/note.types';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNoteDto) => Promise<void>;
  onUpdate?: (id: string, data: UpdateNoteDto) => Promise<void>;
  dossierId: string;
  note?: Note | null;
  mode?: 'create' | 'edit';
}

export default function CreateNoteModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  dossierId,
  note,
  mode = 'create'
}: CreateNoteModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && note) {
        setFormData({
          titre: note.titre,
          contenu: note.contenu,
        });
      } else {
        setFormData({
          titre: '',
          contenu: '',
        });
      }
    }
  }, [isOpen, mode, note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titre.trim()) {
      alert(t('notes.titre') + ' requis');
      return;
    }

    try {
      setIsSaving(true);

      if (mode === 'edit' && note && onUpdate) {
        await onUpdate(note.id, formData);
      } else {
        await onSubmit({
          id_dossier: dossierId,
          ...formData,
        });
      }

      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert(t('common.error'));
    } finally {
      setIsSaving(false);
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
        <div className="flex items-center justify-between p-4 sm:p-6 border-theme border-b flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-600">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {mode === 'edit' ? t('notes.edit.title') : t('notes.create.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              {t('notes.titre')} *
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
              placeholder={t('notes.titre')}
              required
            />
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              {t('notes.contenu')}
            </label>
            <textarea
              value={formData.contenu}
              onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
              rows={10}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all resize-none"
              placeholder={t('notes.contenu')}
            />
          </div>
        </form>

        {/* Footer - Fixed */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-theme border-t bg-theme-tertiary flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-theme-tertiary hover:bg-opacity-80 text-theme-secondary border-theme border rounded-xl font-semibold transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            {isSaving ? t('common.saving') : (mode === 'edit' ? t('common.update') : t('common.create'))}
          </button>
        </div>
      </div>
    </div>
  );
}