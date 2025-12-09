import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { Tache, CreateTacheDto, UpdateTacheDto } from '../types/tache.types';

class TacheService {
  async getAll(): Promise<Tache[]> {
    const response = await apiClient.get<Tache[]>(API_ENDPOINTS.TACHES.LIST);
    return response.data;
  }

  async getById(id: string): Promise<Tache> {
    const response = await apiClient.get<Tache>(API_ENDPOINTS.TACHES.BY_ID(id));
    return response.data;
  }

  async getByDossier(dossierId: string): Promise<Tache[]> {
    const response = await apiClient.get<Tache[]>(`${API_ENDPOINTS.TACHES.LIST}/dossier/${dossierId}`);
    return response.data;
  }

  async create(data: CreateTacheDto): Promise<Tache> {
    const response = await apiClient.post<Tache>(API_ENDPOINTS.TACHES.LIST, data);
    return response.data;
  }

  async update(id: string, data: UpdateTacheDto): Promise<Tache> {
    const response = await apiClient.put<Tache>(API_ENDPOINTS.TACHES.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TACHES.BY_ID(id));
  }
}

export const tacheService = new TacheService();