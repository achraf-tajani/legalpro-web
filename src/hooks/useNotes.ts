import { useState, useEffect } from 'react';
import { noteService } from '../services/note.service';
import type { Note } from '../types/note.types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const data = await noteService.getAll();
        setNotes(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des notes');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const refetch = async () => {
    try {
      const data = await noteService.getAll();
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { notes, isLoading, error, refetch };
}

export function useNotesByDossier(dossierId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!dossierId) {
        setNotes([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await noteService.getByDossier(dossierId);
        setNotes(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des notes');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [dossierId]);

  const refetch = async () => {
    if (!dossierId) return;
    try {
      const data = await noteService.getByDossier(dossierId);
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { notes, isLoading, error, refetch };
}