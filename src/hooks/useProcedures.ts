import { useState, useEffect } from 'react';
import { procedureService } from '../services/procedure.service';
import type { Procedure } from '../types/procedure.types';

export function useProcedures(dossierId?: string) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        setIsLoading(true);
        const data = dossierId 
          ? await procedureService.getByDossier(dossierId)
          : await procedureService.getAll();
        setProcedures(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des procédures');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcedures();
  }, [dossierId]);

  return { procedures, isLoading, error, refetch: () => {} };
}