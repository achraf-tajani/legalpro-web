import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { Client, CreateClientDto, UpdateClientDto } from '../types/client.types';

class ClientService {
  async getAll(): Promise<Client[]> {
    const response = await apiClient.get<Client[]>(API_ENDPOINTS.CLIENTS.LIST);
    return response.data;
  }

  async getById(id: string): Promise<Client> {
    const response = await apiClient.get<Client>(API_ENDPOINTS.CLIENTS.BY_ID(id));
    return response.data;
  }

  async create(data: CreateClientDto): Promise<Client> {
    const response = await apiClient.post<Client>(API_ENDPOINTS.CLIENTS.LIST, data);
    return response.data;
  }

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    const response = await apiClient.put<Client>(API_ENDPOINTS.CLIENTS.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CLIENTS.BY_ID(id));
  }
}

export const clientService = new ClientService();