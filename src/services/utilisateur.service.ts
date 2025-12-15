import type { Avocat, ChangePasswordDto, CreateAvocatDto, UpdateAvocatDto, UpdateUtilisateurDto, Utilisateur } from '../types/utilisateur.types';
import { apiClient as api } from './api.client';


class UtilisateurService {
  // Récupérer tous les utilisateurs (admin only)
  async getAll(): Promise<Utilisateur[]> {
    const response = await api.get('/utilisateurs');
    return response.data;
  }

  // Récupérer un utilisateur par ID
  async getById(id: string): Promise<Utilisateur> {
    const response = await api.get(`/utilisateurs/${id}`);
    return response.data;
  }

  // Créer un avocat + utilisateur
  async createAvocat(data: CreateAvocatDto): Promise<{ utilisateur: Utilisateur; temporaryPassword: string }> {
    const response = await api.post('/utilisateurs/avocat', data);
    return response.data;
  }

  // Mettre à jour un utilisateur
  async updateUtilisateur(id: string, data: UpdateUtilisateurDto): Promise<Utilisateur> {
    const response = await api.put(`/utilisateurs/${id}`, data);
    return response.data;
  }

  // Mettre à jour un avocat
  async updateAvocat(avocatId: string, data: UpdateAvocatDto): Promise<Avocat> {
    const response = await api.put(`/utilisateurs/avocat/${avocatId}`, data);
    return response.data;
  }

  // Désactiver un utilisateur
  async deactivate(id: string): Promise<void> {
    await api.patch(`/utilisateurs/${id}/deactivate`);
  }

  // Réactiver un utilisateur
  async activate(id: string): Promise<void> {
    await api.patch(`/utilisateurs/${id}/activate`);
  }

  // Changer son propre mot de passe
  async changePassword(data: ChangePasswordDto): Promise<void> {
    await api.post('/utilisateurs/change-password', data);
  }

  // Réinitialiser le mot de passe d'un utilisateur (admin only)
  async resetPassword(userId: string): Promise<{ temporaryPassword: string }> {
    const response = await api.post('/utilisateurs/reset-password', { userId });
    return response.data;
  }

  // Supprimer un utilisateur (admin only)
  async delete(id: string): Promise<void> {
    await api.delete(`/utilisateurs/${id}`);
  }

  // Stats
  async getStats(): Promise<{ total: number; actifs: number; avocats: number; admins: number }> {
    const response = await api.get('/utilisateurs/stats');
    return response.data;
  }
}

export const utilisateurService = new UtilisateurService();