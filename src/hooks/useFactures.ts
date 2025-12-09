import { useState, useEffect } from 'react';
import { factureService } from '../services/facture.service';
import type { Facture } from '../types/facture.types';

export function useFactures() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        setIsLoading(true);
        const data = await factureService.getAll();
        setFactures(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des factures');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFactures();
  }, []);

  const refetch = async () => {
    try {
      const data = await factureService.getAll();
      setFactures(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { factures, isLoading, error, refetch };
}

export function useFacturesByDossier(dossierId: string) {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        setIsLoading(true);
        const data = await factureService.getByDossier(dossierId);
        setFactures(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des factures');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (dossierId) {
      fetchFactures();
    }
  }, [dossierId]);

  const refetch = async () => {
    try {
      const data = await factureService.getByDossier(dossierId);
      setFactures(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { factures, isLoading, error, refetch };
}