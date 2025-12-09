import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { Facture, CreateFactureDto, UpdateFactureDto } from '../types/facture.types';

class FactureService {
  async getAll(): Promise<Facture[]> {
    const response = await apiClient.get<Facture[]>(API_ENDPOINTS.FACTURES.LIST);
    return response.data;
  }

  async getById(id: string): Promise<Facture> {
    const response = await apiClient.get<Facture>(API_ENDPOINTS.FACTURES.BY_ID(id));
    return response.data;
  }

  async getByDossier(dossierId: string): Promise<Facture[]> {
    const response = await apiClient.get<Facture[]>(`${API_ENDPOINTS.FACTURES.LIST}/dossier/${dossierId}`);
    return response.data;
  }

  async create(data: CreateFactureDto): Promise<Facture> {
    const response = await apiClient.post<Facture>(API_ENDPOINTS.FACTURES.LIST, data);
    return response.data;
  }

  async update(id: string, data: UpdateFactureDto): Promise<Facture> {
    const response = await apiClient.put<Facture>(API_ENDPOINTS.FACTURES.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.FACTURES.BY_ID(id));
  }

  async generatePDF(id: string): Promise<Blob> {
    const response = await apiClient.get(
      `${API_ENDPOINTS.FACTURES.BY_ID(id)}/pdf`,
      { responseType: 'blob' }
    );
    return response.data;
  }
}

export const factureService = new FactureService();