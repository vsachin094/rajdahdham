import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock3, Image as ImageIcon, MapPin, TreePine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

async function getPark() {
  const response = await fetch('/api/park');
  if (!response.ok) throw new Error(`Could not load Nature Park details (${response.status})`);
  return response.json();
}

function localized(data, key, lang) {
  return data?.[`${key}_${lang}`] || data?.[`${key}_en`] || '';
}

export default function Park() {
  const { lang } = useLanguage();
  const [park, setPark] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPark()
      .then(setPark)
      .catch((loadError) => {
        console.error(loadError);
        setError(true);
      });
  }, []);

  const amenities = park?.[`amenities_${lang}`] || park?.amenities_en || [];
  const milestones = park && [
    { date: park.foundation_date, description: localized(park, 'foundation', lang) },
    { date: park.inauguration_date, description: localized(park, 'inauguration', lang) },
  ];

  return (
    <main className="page-main">
      <section className="page-heading">
        <div className="section-eyebrow"><TreePine size={16} /> {lang === 'en' ? 'At Rajdah Dham' : 'राजदाह धाम में'}</div>
        <h1>{park ? localized(park, 'title', lang) : (lang === 'en' ? 'Rajdah Dham Nature Park' : 'राजदाह धाम नेचर पार्क')}</h1>
        <p>{lang === 'en'
          ? 'A place to enjoy the lawns, pond and shaded grounds beside the Dham.'
          : 'धाम के पास बने लॉन, तालाब और छायादार परिसर में समय बिताने का स्थान।'}</p>
      </section>

      <section className="content-section park-page-content">
        {error ? (
          <div className="notice-card" role="alert">
            {lang === 'en' ? 'Nature Park details could not be loaded. Please try again later.' : 'नेचर पार्क की जानकारी लोड नहीं हो सकी। कृपया बाद में पुनः प्रयास करें।'}
          </div>
        ) : !park ? (
          <p className="loading-copy">{lang === 'en' ? 'Loading park details…' : 'पार्क की जानकारी लोड हो रही है…'}</p>
        ) : (
          <>
            <section className="park-page-cover">
              <img src="/images/site/raj-dah-nature-park-sign.jpg" alt={lang === 'en' ? 'Rajdah Dham Nature Park' : 'राजदाह धाम नेचर पार्क'} />
              <div className="park-page-cover-shade" />
              <div className="park-page-cover-copy">
                <h2>{localized(park, 'title', lang)}</h2>
                <p>{localized(park, 'description', lang)}</p>
                <a
                  className="park-directions-link"
                  href="https://maps.google.com/?q=Rajdah+Dham+Nature+Park,+Sabalpur,+Giridih,+Jharkhand"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin size={16} /> {lang === 'en' ? 'Open directions' : 'रास्ता देखें'}
                </a>
              </div>
            </section>

            <div className="park-fact-grid">
              <article className="park-fact-card">
                <span className="park-fact-icon"><Clock3 size={20} /></span>
                <span className="park-fact-label">{lang === 'en' ? 'Visiting hours' : 'पार्क का समय'}</span>
                <strong>{localized(park, 'timing', lang)}</strong>
              </article>
              <article className="park-fact-card">
                <span className="park-fact-icon"><TreePine size={20} /></span>
                <span className="park-fact-label">{lang === 'en' ? 'Entry charges' : 'प्रवेश शुल्क'}</span>
                <strong>{lang === 'en' ? '₹20 per person' : 'प्रति व्यक्ति ₹20'}</strong>
                <small>{lang === 'en' ? 'Children up to 10 years enter free.' : '10 वर्ष तक के बच्चों का प्रवेश निःशुल्क है।'}</small>
              </article>
            </div>

            <section className="park-page-section">
              <div className="park-page-section-heading">
                <span className="section-eyebrow">{lang === 'en' ? 'Around the grounds' : 'पार्क परिसर में'}</span>
                <h2>{lang === 'en' ? 'What you will find at the park.' : 'नेचर पार्क में क्या-क्या है।'}</h2>
              </div>
              <ul className="park-amenity-grid">
                {amenities.map((amenity) => (
                  <li className="park-amenity-card" key={amenity}>
                    <span className="park-fact-icon"><TreePine size={18} /></span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="park-page-section park-history-section">
              <div className="park-page-section-heading">
                <span className="section-eyebrow">{lang === 'en' ? 'The park story' : 'पार्क की कहानी'}</span>
                <h2>{lang === 'en' ? 'From foundation to inauguration.' : 'आधारशिला से उद्घाटन तक।'}</h2>
              </div>
              <div className="park-milestones">
                {milestones.map((milestone) => (
                  <div key={milestone.date}>
                    <time dateTime={milestone.date}>
                      {new Intl.DateTimeFormat(lang === 'en' ? 'en-IN' : 'hi-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(`${milestone.date}T12:00:00`))}
                    </time>
                    <span>{milestone.description}</span>
                  </div>
                ))}
              </div>
              <p className="park-development-note">
                {lang === 'en'
                  ? `The park was developed over about two years with ${localized(park, 'investment', lang)} allocated by the Jharkhand Government.`
                  : `झारखंड सरकार द्वारा आवंटित ${localized(park, 'investment', lang)} की राशि से लगभग दो वर्षों में पार्क का निर्माण हुआ।`}
              </p>
            </section>

            <section className="park-page-section park-photo-section">
              <div className="park-page-section-heading park-photo-heading">
                <div>
                  <span className="section-eyebrow"><ImageIcon size={15} /> {lang === 'en' ? 'From the grounds' : 'पार्क की झलकियां'}</span>
                  <h2>{lang === 'en' ? 'See the Nature Park.' : 'नेचर पार्क की तस्वीरें देखें।'}</h2>
                </div>
                <Link to="/gallery?category=park" className="text-link">
                  {lang === 'en' ? 'View all photos' : 'सभी तस्वीरें देखें'} <ArrowRight size={17} />
                </Link>
              </div>
              <div className="park-photo-grid">
                {park.images.map((image, index) => (
                  <Link to="/gallery?category=park" key={image} className={`park-photo park-photo-${(index % 4) + 1}`}>
                    <img
                      src={image}
                      alt={lang === 'en' ? `Rajdah Dham Nature Park photo ${index + 1}` : `राजदाह धाम नेचर पार्क तस्वीर ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
