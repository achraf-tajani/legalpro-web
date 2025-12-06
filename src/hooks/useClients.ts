import { useState, useEffect } from 'react';
import { apiClient } from '../services/api.client';
import { API_ENDPOINTS } from '../config/api.config';

interface Client {
  id: string;
  nom: string;
  prenom?: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.CLIENTS.LIST);
        setClients(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des clients');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, isLoading, error };
}