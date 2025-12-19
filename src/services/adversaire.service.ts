import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { Adversaire, CreateAdversaireDto, UpdateAdversaireDto } from '../types/adversaire.types';

class AdversaireService {
  async getAll(): Promise<Adversaire[]> {
    const response = await apiClient.get<Adversaire[]>(API_ENDPOINTS.ADVERSAIRES.LIST);
    return response.data;
  }

  async getById(id: string): Promise<Adversaire> {
    const response = await apiClient.get<Adversaire>(API_ENDPOINTS.ADVERSAIRES.BY_ID(id));
    return response.data;
  }

  async getByDossier(dossierId: string): Promise<Adversaire[]> {
    const response = await apiClient.get<Adversaire[]>(API_ENDPOINTS.ADVERSAIRES.BY_DOSSIER(dossierId));
    return response.data;
  }

  async create(data: CreateAdversaireDto): Promise<Adversaire> {
    const response = await apiClient.post<Adversaire>(API_ENDPOINTS.ADVERSAIRES.LIST, data);
    return response.data;
  }

  async update(id: string, data: UpdateAdversaireDto): Promise<Adversaire> {
    const response = await apiClient.put<Adversaire>(API_ENDPOINTS.ADVERSAIRES.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.ADVERSAIRES.BY_ID(id));
  }
}

export const adversaireService = new AdversaireService();