import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr, enUS, arSA } from 'date-fns/locale';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useDossiers } from '../../hooks/useDossiers';
import CreateProcedureModal from '../../components/features/dossiers/CreateProcedureModal';
import { procedureService } from '../../services/procedure.service';
import type { CreateProcedureDto } from '../../types/procedure.types';
import type { CalendarEvent } from '../../types/calendar.types';
import { MdAdd, MdFilterList } from 'react-icons/md';

// Locales map
const localesMap = {
  fr,
  en: enUS,
  ar: arSA,
};

export default function Calendrier() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { events, isLoading, refetch } = useCalendarEvents();
  const { dossiers } = useDossiers();
  
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);

  // Localizer avec la bonne locale
  const currentLocale = localesMap[i18n.language as keyof typeof localesMap] || fr;
  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), { locale: currentLocale }),
        getDay,
        locales: localesMap,
      }),
    [currentLocale]
  );

  const handleCreateProcedure = async (data: CreateProcedureDto) => {
    await procedureService.create(data);
    await refetch();
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.type === 'procedure' && !event.id.includes('-deadline')) {
      navigate(`/dossiers/${event.dossierId}`);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let className = 'calendar-event-procedure';
    
    if (event.id.includes('-deadline')) {
      className = 'calendar-event-deadline';
    } else if (event.type === 'tache') {
      className = 'calendar-event-tache';
    }

    if (event.priorite) {
      className += ` calendar-priority-${event.priorite}`;
    }

    return {
      className,
    };
  };

  const messages = {
    allDay: t('calendar.allDay'),
    previous: t('calendar.previous'),
    next: t('calendar.next'),
    today: t('calendar.today'),
    month: t('calendar.month'),
    week: t('calendar.week'),
    day: t('calendar.day'),
    agenda: t('calendar.agenda'),
    date: t('calendar.date'),
    time: t('calendar.time'),
    event: t('calendar.event'),
    noEventsInRange: t('calendar.noEvents'),
    showMore: (total: number) => t('calendar.showMore', { count: total }),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('calendar.title')}</h1>
          <p className="text-slate-400">
            {t('calendar.subtitle', { count: events.length })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
          >
            <MdFilterList />
            <span>{t('calendar.filters')}</span>
          </button>
          <button 
            onClick={() => setIsProcedureModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            <MdAdd className="text-xl" />
            <span>{t('procedures.new')}</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          messages={messages}
          culture={i18n.language}
        />
      </div>

      {/* Modal Créer Procédure */}
      <CreateProcedureModal
        isOpen={isProcedureModalOpen}
        onClose={() => setIsProcedureModalOpen(false)}
        onSubmit={handleCreateProcedure}
        dossiers={dossiers.map(d => ({ id: d.id, titre: d.titre, type: d.type }))}
      />
    </div>
  );
}