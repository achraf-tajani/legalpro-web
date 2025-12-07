import { useState, useEffect } from 'react';
import { dossierService } from '../services/dossier.service';
import type { Dossier } from '../types/dossier.types';

export function useDossiersByClient(clientId?: string) {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      if (!clientId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await dossierService.getByClient(clientId);
        setDossiers(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des dossiers');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossiers();
  }, [clientId]);

  return { dossiers, isLoading, error };
}