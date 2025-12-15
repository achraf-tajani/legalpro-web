import { useState, useEffect } from 'react';
import { documentService } from '../services/document.service';
import type { Document } from '../types/document.types';

export function useDocuments(dossierId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = dossierId 
        ? await documentService.getByDossier(dossierId)
        : await documentService.getAll();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [dossierId]);

  return {
    documents,
    isLoading,
    error,
    refetch: fetchDocuments,
  };
}

export function useDocumentsByCategorie(categorie: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    documentService.getByCategorie(categorie).then(setDocuments).finally(() => setIsLoading(false));
  }, [categorie]);

  return { documents, isLoading };
}