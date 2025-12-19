import { useState, useEffect } from 'react';
import { adversaireService } from '../services/adversaire.service';
import type { Adversaire } from '../types/adversaire.types';

export function useAdversairesByDossier(dossierId?: string) {
  const [adversaires, setAdversaires] = useState<Adversaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdversaires = async () => {
    if (!dossierId) {
      setAdversaires([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await adversaireService.getByDossier(dossierId);
      setAdversaires(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des adversaires');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdversaires();
  }, [dossierId]);

  return { adversaires, isLoading, error, refetch: fetchAdversaires };
}