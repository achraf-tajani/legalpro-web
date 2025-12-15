import { useState, useEffect } from 'react';
import { utilisateurService } from '../services/utilisateur.service';
import type { Utilisateur } from '../types/utilisateur.types';

export function useUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUtilisateurs = async () => {
    try {
      setIsLoading(true);
      const data = await utilisateurService.getAll();
      setUtilisateurs(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  return {
    utilisateurs,
    isLoading,
    error,
    refetch: fetchUtilisateurs,
  };
}