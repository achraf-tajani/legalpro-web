import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { DashboardStats } from '../types/dashboard.types';

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const [dossiersStats, clients, tachesStats, facturesStats] = await Promise.all([
      apiClient.get(API_ENDPOINTS.DOSSIERS.STATS),
      apiClient.get(API_ENDPOINTS.CLIENTS.LIST),
      apiClient.get(API_ENDPOINTS.TACHES.STATS),
      apiClient.get(API_ENDPOINTS.FACTURES.STATS),
    ]);

    // Dossiers actifs = ouverts + en cours
    const dossiersActifs = (dossiersStats.data.ouverts || 0) + (dossiersStats.data.enCours || 0);

    // Tâches urgentes = non commencées + en cours (ou ajustez selon votre logique)
    const tachesUrgentes = (tachesStats.data.nonCommencees || 0) + (tachesStats.data.enCours || 0);

    return {
      dossiersActifs,
      totalClients: clients.data.length || 0,
      tachesUrgentes,
      facturesImpayees: facturesStats.data.unpaid || 0,
    };
  }
}

export const dashboardService = new DashboardService();