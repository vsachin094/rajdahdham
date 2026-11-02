import React, { useEffect, useState } from 'react';
import { ArrowDownRight, CalendarDays, Image as ImageIcon, MapPin, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { partitionEventsByDate } from '../utils/eventDates';

function EventCard({ event, lang, dateLocale, isUpcoming }) {
  const photoCount = event.photos?.length || 0;
  const videoCount = event.videos?.length || 0;

  return (
    <article className={`event-card${event.image ? '' : ' event-card-no-image'}`} id={event.id} key={event.id}>
      {event.image && (
        <div className="event-image-wrap">
          <img src={event.image} alt={event.title[lang]} loading="lazy" decoding="async" />
          <span className="event-date">
            <CalendarDays size={15} />
            {new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })
              .format(new Date(`${event.date}T12:00:00`))}
          </span>
        </div>
      )}
      <div className="event-copy">
        <span className="event-kicker">
          {isUpcoming
            ? (lang === 'en' ? 'Upcoming event' : 'आगामी कार्यक्रम')
            : (lang === 'en' ? 'From the archive' : 'पुराना कार्यक्रम')}
        </span>
        <h2>{event.title[lang]}</h2>
        {!event.image && (
          <span className="event-date event-date-inline">
            <CalendarDays size={15} />
            {new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })
              .format(new Date(`${event.date}T12:00:00`))}
          </span>
        )}
        {event.summary?.[lang] && <p>{event.summary[lang]}</p>}
        {event.details?.[lang] && <p className="event-details">{event.details[lang]}</p>}
        <div className="event-meta">
          {event.location?.[lang] && <span><MapPin size={15} /> {event.location[lang]}</span>}
          {photoCount > 0 && <span><ImageIcon size={15} /> {photoCount} {lang === 'en' ? 'photos' : 'तस्वीरें'}</span>}
          {videoCount > 0 && <span><Video size={15} /> {videoCount} {lang === 'en' ? 'videos' : 'वीडियो'}</span>}
        </div>
        {photoCount > 0 || videoCount > 0 ? (
          <Link to={`/gallery?event=${encodeURIComponent(event.id)}`} className="text-link">
            {lang === 'en' ? 'View event photos & videos' : 'कार्यक्रम की तस्वीरें और वीडियो देखें'} <ArrowDownRight size={17} />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function Events() {
  const { lang } = useLanguage();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load event updates (${response.status})`);
        return response.json();
      })
      .then(setEvents)
      .catch((loadError) => {
        console.error(loadError);
        setError(lang === 'en'
          ? 'Event updates are temporarily unavailable. Please try again later.'
          : 'कार्यक्रम की जानकारी अभी उपलब्ध नहीं है। कृपया बाद में पुनः देखें।');
      });
  }, [lang]);

  const dateLocale = lang === 'en' ? 'en-IN' : 'hi-IN';
  const { upcoming, past } = partitionEventsByDate(events);

  return (
    <main className="page-main">
      <section className="page-heading">
        <div className="section-eyebrow"><CalendarDays size={16} /> {lang === 'en' ? 'From the Dham' : 'धाम से समाचार'}</div>
        <h1>{lang === 'en' ? 'Events & updates' : 'कार्यक्रम और समाचार'}</h1>
        <p>{lang === 'en'
          ? 'Moments, milestones and news from Rajdah Dham—kept together with their photo albums.'
          : 'राजदाह धाम के खास पल, उपलब्धियां और समाचार—उनकी फोटो गैलरी के साथ।'}</p>
      </section>

      <section className="content-section events-section">
        {error ? (
          <div className="notice-card" role="alert">{error}</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={30} />
            <h2>{lang === 'en' ? 'No new announcements yet' : 'अभी कोई नई घोषणा नहीं है'}</h2>
            <p>{lang === 'en'
              ? 'When an event is announced, its details and photos will be shared here.'
              : 'नए कार्यक्रम की घोषणा होने पर उसका विवरण और तस्वीरें यहां साझा की जाएंगी।'}</p>
            <Link to="/contact" className="text-link">
              {lang === 'en' ? 'Get in touch' : 'संपर्क करें'} <ArrowDownRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="event-groups">
            <section className="event-group" aria-labelledby="upcoming-events-heading">
              <h2 className="event-group-heading" id="upcoming-events-heading">
                {lang === 'en' ? 'Upcoming events' : 'आगामी कार्यक्रम'}
              </h2>
              {upcoming.length > 0 ? (
                <div className="event-list">
                  {upcoming.map((event) => (
                    <EventCard key={event.id} event={event} lang={lang} dateLocale={dateLocale} isUpcoming />
                  ))}
                </div>
              ) : (
                <p className="event-group-empty">
                  {lang === 'en' ? 'No upcoming events have been announced yet.' : 'अभी किसी आगामी कार्यक्रम की घोषणा नहीं हुई है।'}
                </p>
              )}
            </section>

            {past.length > 0 && (
              <section className="event-group" aria-labelledby="past-events-heading">
                <h2 className="event-group-heading" id="past-events-heading">
                  {lang === 'en' ? 'Past events & milestones' : 'पिछले कार्यक्रम और उपलब्धियां'}
                </h2>
                <div className="event-list">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} lang={lang} dateLocale={dateLocale} isUpcoming={false} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
