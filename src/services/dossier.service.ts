import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { Dossier, CreateDossierDto, UpdateDossierDto } from '../types/dossier.types';

class DossierService {
  async getAll(): Promise<Dossier[]> {
    const response = await apiClient.get<Dossier[]>(API_ENDPOINTS.DOSSIERS.LIST);
    return response.data;
  }

  async getById(id: string): Promise<Dossier> {
    const response = await apiClient.get<Dossier>(API_ENDPOINTS.DOSSIERS.BY_ID(id));
    return response.data;
  }

  async create(data: CreateDossierDto): Promise<Dossier> {
    const response = await apiClient.post<Dossier>(API_ENDPOINTS.DOSSIERS.LIST, data);
    return response.data;
  }

  async update(id: string, data: UpdateDossierDto): Promise<Dossier> {
    const response = await apiClient.put<Dossier>(API_ENDPOINTS.DOSSIERS.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DOSSIERS.BY_ID(id));
  }
}

export const dossierService = new DossierService();