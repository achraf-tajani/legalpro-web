import { useState, useEffect } from 'react';
import { dossierService } from '../services/dossier.service';
import type { Dossier } from '../types/dossier.types';

export function useDossiers() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        setIsLoading(true);
        const data = await dossierService.getAll();
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
  }, []);

  return { dossiers, isLoading, error };
}