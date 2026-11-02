import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Clock3, Heart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AboutPreview from '../components/AboutPreview';
import Hero from '../components/Hero.jsx';
import { partitionEventsByDate } from '../utils/eventDates';

const previewPhotos = [
  {
    src: '/images/slider/mouni-baba-memorial-shrine.jpg',
    alt: { en: 'Memorial shrine of Tapaswi Mouni Baba', hi: 'तपस्वी मौनी बाबा का स्मृति मंदिर' },
  },
  {
    src: '/images/slider/rajdah-dham-temple-entrance.jpg',
    alt: { en: 'Shrine and temple grounds at Rajdah Dham', hi: 'राजदाह धाम का मंदिर परिसर' },
  },
  {
    src: '/images/site/mouni-baba-statue.jpg',
    alt: { en: 'Statue of Tapaswi Mouni Baba', hi: 'तपस्वी मौनी बाबा की प्रतिमा' },
  },
];

export default function Home() {
  const { lang } = useLanguage();
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState(false);
  const [devotionalDates, setDevotionalDates] = useState([]);
  const [devotionalDatesLoaded, setDevotionalDatesLoaded] = useState(false);
  const [devotionalDatesError, setDevotionalDatesError] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load events (${response.status})`);
        return response.json();
      })
      .then(setEvents)
      .catch((error) => {
        console.error(error);
        setEventsError(true);
      });
  }, []);

  useEffect(() => {
    fetch('/api/devotional-dates')
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load devotional dates (${response.status})`);
        return response.json();
      })
      .then((dates) => {
        setDevotionalDates(dates);
        setDevotionalDatesLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setDevotionalDatesError(true);
        setDevotionalDatesLoaded(true);
      });
  }, []);

  const { upcoming } = partitionEventsByDate(events);
  const upcomingPreview = upcoming.slice(0, 3);
  const devotionalDatePreview = devotionalDates.slice(0, 6);
  const dateLocale = lang === 'en' ? 'en-IN' : 'hi-IN';

  return (
    <main>
      <Hero />

      <section className="welcome-strip" id="welcome" aria-label={lang === 'en' ? 'Darshan and temple information' : 'दर्शन और मंदिर की जानकारी'}>
        <Link className="welcome-item welcome-item-link" to="/about">
          <span className="welcome-icon"><Heart size={19} /></span>
          <span><strong>{lang === 'en' ? 'Shrines of the Dham' : 'धाम के मंदिर'}</strong><small>{lang === 'en' ? 'Shiva · Parvati · Nandi · Hanuman' : 'शिव · पार्वती · नंदी · हनुमान'}</small></span>
          <ArrowRight size={17} />
        </Link>
        <div className="welcome-item">
          <span className="welcome-icon"><Clock3 size={19} /></span>
          <span><strong>{lang === 'en' ? 'Daily darshan' : 'दैनिक दर्शन'}</strong><small>{lang === 'en' ? 'Every day · 5:00 AM–9:00 PM' : 'प्रतिदिन · सुबह 5–रात 9 बजे'}</small></span>
        </div>
        <a className="welcome-item welcome-item-link" href="tel:+919939568818">
          <span className="welcome-icon"><Phone size={19} /></span>
          <span><strong>{lang === 'en' ? 'Speak with the Samiti' : 'समिति से बात करें'}</strong><small>+91 99395 68818</small></span>
          <ArrowRight size={17} />
        </a>
      </section>

      <AboutPreview />

      <section className="home-story-section home-devotional-section">
        <div className="home-section-heading">
          <span className="section-eyebrow"><CalendarDays size={16} /> {lang === 'en' ? 'Devotional calendar' : 'धार्मिक पंचांग'}</span>
          <h2>{lang === 'en' ? 'Upcoming devotional dates.' : 'आगामी धार्मिक पर्व।'}</h2>
          <p>{lang === 'en'
            ? 'Upcoming Hindu festivals and Ekadashi dates for the Rajdah Dham area, based on the local Panchang. These are religious dates, not confirmed temple programmes.'
            : 'राजदाह धाम क्षेत्र के आगामी हिंदू पर्व और एकादशी की तिथियां, स्थानीय पंचांग के आधार पर। ये धार्मिक तिथियां हैं, मंदिर के पुष्ट कार्यक्रम नहीं।'}</p>
        </div>

        {devotionalDatesError ? (
          <div className="notice-card" role="alert">
            {lang === 'en'
              ? 'Devotional dates could not be calculated right now. Please try again later.'
              : 'धार्मिक तिथियों की गणना अभी नहीं हो सकी। कृपया बाद में पुनः प्रयास करें।'}
          </div>
        ) : !devotionalDatesLoaded ? (
          <p className="loading-copy">{lang === 'en' ? 'Calculating upcoming dates…' : 'आगामी तिथियों की गणना हो रही है…'}</p>
        ) : devotionalDatePreview.length > 0 ? (
          <div className="home-event-grid">
            {devotionalDatePreview.map((observance) => (
              <article className="home-event-card" key={observance.id}>
                <div className="home-event-copy">
                  <span className="home-event-date">
                    <CalendarDays size={15} />
                    {new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
                      .format(new Date(`${observance.date}T12:00:00`))}
                  </span>
                  <h3>{observance.title[lang]}</h3>
                  <p>{observance.details[lang]}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="loading-copy">{lang === 'en' ? 'No upcoming observances found.' : 'कोई आगामी धार्मिक पर्व नहीं मिला।'}</p>
        )}

        <a
          className="text-link home-all-events-link"
          href="https://maps.google.com/?q=Rajdah+Dham,+Sabalpur,+Suriya,+Giridih,+Jharkhand"
          target="_blank"
          rel="noreferrer"
        >
          {lang === 'en' ? 'Plan a visit to Rajdah Dham' : 'राजदाह धाम आने की योजना बनाएं'} <ArrowRight size={17} />
        </a>
        <p className="devotional-calendar-note">
          {lang === 'en'
            ? 'Dates use Drik Panchanga calculations with approximate local coordinates for the Rajdah Dham area. Observance traditions can vary; contact the Samiti to confirm temple arrangements before travelling.'
            : 'तिथियां राजदाह धाम क्षेत्र के अनुमानित स्थानीय निर्देशांकों पर द्रिक पंचांग की गणना पर आधारित हैं। परंपराओं में अंतर हो सकता है; यात्रा से पहले मंदिर की व्यवस्था समिति से पुष्टि करें।'}
        </p>
      </section>

      <section className="home-story-section">
        <div className="home-section-heading">
          <span className="section-eyebrow"><CalendarDays size={16} /> {lang === 'en' ? 'At the Dham' : 'धाम में'}</span>
          <h2>{lang === 'en' ? 'Upcoming events.' : 'आगामी कार्यक्रम।'}</h2>
          <p>{lang === 'en'
            ? 'Join the Dham’s upcoming observances and community events.'
            : 'धाम में होने वाले आगामी धार्मिक और सामुदायिक कार्यक्रमों में सहभागी बनें।'}</p>
        </div>

        {eventsError ? (
          <div className="notice-card" role="alert">
            {lang === 'en'
              ? 'Upcoming events could not be loaded. Please visit the events page for updates.'
              : 'आगामी कार्यक्रमों की जानकारी लोड नहीं हो सकी। कृपया समाचार के लिए कार्यक्रम पृष्ठ देखें।'}
          </div>
        ) : upcomingPreview.length > 0 ? (
          <div className="home-event-grid">
            {upcomingPreview.map((event) => (
              <article className="home-event-card" key={event.id}>
                {event.image && (
                  <Link to={`/gallery?event=${encodeURIComponent(event.id)}`} className="home-event-image">
                    <img src={event.image} alt="" loading="lazy" decoding="async" />
                  </Link>
                )}
                <div className="home-event-copy">
                  <span className="home-event-date">
                    <CalendarDays size={15} />
                    {new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
                      .format(new Date(`${event.date}T12:00:00`))}
                  </span>
                  <h3>{event.title[lang]}</h3>
                  {(event.details?.[lang] || event.summary?.[lang]) && (
                    <p>{event.details?.[lang] || event.summary?.[lang]}</p>
                  )}
                  <Link
                    to={event.photos?.length || event.videos?.length
                      ? `/gallery?event=${encodeURIComponent(event.id)}`
                      : '/events'}
                    className="text-link"
                  >
                    {event.photos?.length || event.videos?.length
                      ? (lang === 'en' ? 'Event photos & videos' : 'कार्यक्रम की तस्वीरें और वीडियो देखें')
                      : (lang === 'en' ? 'Event information' : 'कार्यक्रम की जानकारी')}
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-events-empty">
            <p>{lang === 'en'
              ? 'There are no upcoming events at the moment. You can see past events below.'
              : 'फिलहाल कोई आगामी कार्यक्रम नहीं है। आप नीचे पिछले कार्यक्रम देख सकते हैं।'}</p>
            <Link to="/events" className="text-link">
              {lang === 'en' ? 'See past events and updates' : 'पिछले कार्यक्रम और समाचार देखें'} <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {upcoming.length > upcomingPreview.length && (
          <Link to="/events" className="text-link home-all-events-link">
            {lang === 'en' ? 'See all upcoming events' : 'सभी आगामी कार्यक्रम देखें'} <ArrowRight size={17} />
          </Link>
        )}
      </section>

      <section className="home-gallery-section">
        <div className="home-section-heading home-gallery-heading">
          <div>
            <span className="section-eyebrow">{lang === 'en' ? 'Shrine, faith and remembrance' : 'मंदिर, आस्था और स्मरण'}</span>
            <h2>{lang === 'en' ? 'The Dham in photographs.' : 'तस्वीरों में राजदाह धाम।'}</h2>
          </div>
          <Link to="/gallery" className="text-link">
            {lang === 'en' ? 'View all photos' : 'सभी तस्वीरें देखें'} <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-photo-grid">
          {previewPhotos.map((photo, index) => (
            <Link to="/gallery" key={photo.src} className={`home-photo home-photo-${index + 1}`}>
              <img src={photo.src} alt={photo.alt[lang]} loading="lazy" decoding="async" />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-donate-section">
        <div className="donate-banner">
          <div>
            <span className="section-eyebrow">{lang === 'en' ? 'Be a part of the seva' : 'सेवा में सहभागी बनें'}</span>
            <h2>{lang === 'en' ? 'Help keep Rajdah Dham thriving.' : 'राजदाह धाम की सेवा में सहयोग करें।'}</h2>
            <p>{lang === 'en'
              ? 'Your contribution supports the ongoing care and development of this sacred place.'
              : 'आपका योगदान इस पवित्र स्थल की देखभाल और विकास में सहायक है।'}</p>
          </div>
          <Link to="/donate" className="hero-button hero-button-primary">
            {lang === 'en' ? 'Support Rajdah Dham' : 'राजदाह धाम में सहयोग करें'} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
