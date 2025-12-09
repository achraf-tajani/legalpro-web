import { useState, useEffect } from 'react';
import { tacheService } from '../services/tache.service';
import type { Tache } from '../types/tache.types';

export function useTaches() {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        setIsLoading(true);
        const data = await tacheService.getAll();
        setTaches(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des tâches');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaches();
  }, []);

  const refetch = async () => {
    try {
      const data = await tacheService.getAll();
      setTaches(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { taches, isLoading, error, refetch };
}

export function useTachesByDossier(dossierId: string | undefined) {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaches = async () => {
      if (!dossierId) {
        setTaches([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await tacheService.getByDossier(dossierId);
        setTaches(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des tâches');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaches();
  }, [dossierId]);

  const refetch = async () => {
    if (!dossierId) return;
    try {
      const data = await tacheService.getByDossier(dossierId);
      setTaches(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { taches, isLoading, error, refetch };
}