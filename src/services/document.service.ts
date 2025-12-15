 import { apiClient as api } from './api.client';
import type { Document } from '../types/document.types';

export interface CreateDocumentDto {
  id_dossier: string;
  nom: string;
  description?: string;
  type?: string;
  categorie?: string;
  niveau_confidentialite?: 'public' | 'interne' | 'confidentiel' | 'secret';
  est_template?: boolean;
}

export interface UpdateDocumentDto {
  nom?: string;
  description?: string;
  categorie?: string;
  statut?: 'brouillon' | 'validé' | 'archivé' | 'supprimé';
  niveau_confidentialite?: 'public' | 'interne' | 'confidentiel' | 'secret';
}

class DocumentService {
  async getAll(): Promise<Document[]> {
    const response = await api.get('/documents');
    return response.data;
  }

  async getByDossier(dossierId: string): Promise<Document[]> {
    const response = await api.get(`/documents/dossier/${dossierId}`);
    return response.data;
  }

  async getByCategorie(categorie: string): Promise<Document[]> {
    const response = await api.get(`/documents/categorie/${categorie}`);
    return response.data;
  }

  async getTemplates(): Promise<Document[]> {
    const response = await api.get('/documents/templates');
    return response.data;
  }

  async getById(id: string): Promise<Document> {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  }

  async getSignedUrl(id: string): Promise<string> {
    const response = await api.get(`/documents/${id}/url`);
    return response.data.url;
  }

  async upload(file: File, data: CreateDocumentDto): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id_dossier', data.id_dossier);
    formData.append('nom', data.nom);
    if (data.description) formData.append('description', data.description);
    if (data.type) formData.append('type', data.type);
    if (data.categorie) formData.append('categorie', data.categorie);
    if (data.niveau_confidentialite) formData.append('niveau_confidentialite', data.niveau_confidentialite);
    if (data.est_template !== undefined) formData.append('est_template', String(data.est_template));

    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async update(id: string, data: UpdateDocumentDto): Promise<Document> {
    const response = await api.put(`/documents/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/documents/${id}`);
  }

  async download(id: string, nom: string): Promise<void> {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nom);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  async getStats(): Promise<{ total: number }> {
    const response = await api.get('/documents/stats');
    return response.data;
  }
}

export const documentService = new DocumentService();