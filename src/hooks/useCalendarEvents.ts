import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendar.service';
import type { CalendarEvent } from '../types/calendar.types';

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await calendarService.getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des événements');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const refetch = async () => {
    try {
      const data = await calendarService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  return { events, isLoading, error, refetch };
}