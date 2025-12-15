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
import { MdAdd, MdFilterList, MdChevronLeft, MdChevronRight } from 'react-icons/md';

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
    let backgroundColor = '#4f46e5'; // Violet par défaut
    
    if (event.id.includes('-deadline')) {
      backgroundColor = '#ef4444'; // Rouge pour deadline
    } else if (event.type === 'tache') {
      backgroundColor = '#10b981'; // Vert pour tâche
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 1,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,
        padding: '2px 6px',
      }
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
    showMore: (total: number) => `+${total} ${t('calendar.more')}`,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary mb-2">{t('calendar.title')}</h1>
          <p className="text-theme-secondary">
            {t('calendar.subtitle', { count: events.length })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-theme-tertiary border border-theme hover:bg-opacity-80 text-theme-primary rounded-lg transition-all"
          >
            <MdFilterList />
            <span>{t('calendar.filters')}</span>
          </button>
          <button 
            onClick={() => setIsProcedureModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-3 bg-accent-gradient hover:bg-accent-gradient-hover text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            <MdAdd className="text-xl" />
            <span>{t('procedures.new')}</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-theme-surface border-theme border rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
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
          components={{
            toolbar: (props) => (
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-purple-600 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => props.onNavigate('PREV')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  >
                    <MdChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={() => props.onNavigate('NEXT')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  >
                    <MdChevronRight className="text-2xl" />
                  </button>
                  <button
                    onClick={() => props.onNavigate('TODAY')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white font-semibold transition-all border border-white/20"
                  >
                    {t('calendar.today')}
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {props.label}
                </h2>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => props.onView('month')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      view === 'month'
                        ? 'bg-white text-indigo-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {t('calendar.month')}
                  </button>
                  <button
                    onClick={() => props.onView('week')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      view === 'week'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {t('calendar.week')}
                  </button>
                  <button
                    onClick={() => props.onView('day')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      view === 'day'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {t('calendar.day')}
                  </button>
                  <button
                    onClick={() => props.onView('agenda')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      view === 'agenda'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {t('calendar.agenda')}
                  </button>
                </div>
              </div>
            ),
          }}
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