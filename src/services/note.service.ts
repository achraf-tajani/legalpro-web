import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { Note, CreateNoteDto, UpdateNoteDto } from '../types/note.types';

class NoteService {
  async getAll(): Promise<Note[]> {
    const response = await apiClient.get<Note[]>(API_ENDPOINTS.NOTES.LIST);
    return response.data;
  }

  async getById(id: string): Promise<Note> {
    const response = await apiClient.get<Note>(API_ENDPOINTS.NOTES.BY_ID(id));
    return response.data;
  }

  async getByDossier(dossierId: string): Promise<Note[]> {
    const response = await apiClient.get<Note[]>(`${API_ENDPOINTS.NOTES.LIST}/dossier/${dossierId}`);
    return response.data;
  }

  async create(data: CreateNoteDto): Promise<Note> {
    const response = await apiClient.post<Note>(API_ENDPOINTS.NOTES.LIST, data);
    return response.data;
  }

  async update(id: string, data: UpdateNoteDto): Promise<Note> {
    const response = await apiClient.put<Note>(API_ENDPOINTS.NOTES.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.NOTES.BY_ID(id));
  }
}

export const noteService = new NoteService();