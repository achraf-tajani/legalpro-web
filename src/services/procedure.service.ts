import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { Procedure, CreateProcedureDto, UpdateProcedureDto } from '../types/procedure.types';

class ProcedureService {
  async getAll(): Promise<Procedure[]> {
    const response = await apiClient.get<Procedure[]>(API_ENDPOINTS.PROCEDURES.LIST);
    return response.data;
  }

  async getById(id: string): Promise<Procedure> {
    const response = await apiClient.get<Procedure>(API_ENDPOINTS.PROCEDURES.BY_ID(id));
    return response.data;
  }

  async getByDossier(dossierId: string): Promise<Procedure[]> {
    const response = await apiClient.get<Procedure[]>(`${API_ENDPOINTS.PROCEDURES.LIST}/dossier/${dossierId}`);
    return response.data;
  }

  async create(data: CreateProcedureDto): Promise<Procedure> {
    const response = await apiClient.post<Procedure>(API_ENDPOINTS.PROCEDURES.LIST, data);
    return response.data;
  }

  async update(id: string, data: UpdateProcedureDto): Promise<Procedure> {
    const response = await apiClient.put<Procedure>(API_ENDPOINTS.PROCEDURES.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PROCEDURES.BY_ID(id));
  }
}

export const procedureService = new ProcedureService();