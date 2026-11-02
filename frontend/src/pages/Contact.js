import React, { useEffect, useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LocationMap from '../components/LocationMap';

const whatsappUrl = 'https://wa.me/919939568818?text=Namaste%2C%20I%20have%20a%20question%20about%20Rajdah%20Dham.';
const mapOrigin = 'Rajdah Dham, 6V9M+MGQ, Nimatand, Jharkhand 825320';

function getDirectionsUrl(destination) {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('origin', mapOrigin);
  url.searchParams.set('destination', destination);
  url.searchParams.set('travelmode', 'driving');
  return url.toString();
}

export default function Contact() {
  const { lang } = useLanguage();
  const [about, setAbout] = useState(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/about')
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load directions (${response.status})`);
        return response.json();
      })
      .then((content) => {
        if (active) setAbout(content);
      })
      .catch((error) => {
        console.error(error);
        if (active) setLocationError(true);
      });

    return () => { active = false; };
  }, []);

  const localized = (key) => about?.[`${key}_${lang}`] || about?.[`${key}_en`] || '';

  return (
    <main className="page-main">
      <section className="page-heading">
        <div className="section-eyebrow"><MapPin size={16} /> {lang === 'en' ? 'Darshan and contact' : 'दर्शन और संपर्क'}</div>
        <h1>{lang === 'en' ? 'Darshan at Rajdah Dham.' : 'राजदाह धाम में दर्शन।'}</h1>
        <p>{lang === 'en'
          ? 'Daily darshan is from 5:00 AM to 9:00 PM. If you need help with the route or timings, the Samiti can assist.'
          : 'दैनिक दर्शन सुबह 5 बजे से रात 9 बजे तक होते हैं। रास्ते या समय की जानकारी के लिए समिति से संपर्क करें।'}</p>
      </section>

      <section className="content-section contact-page-content">
        <div className="contact-main-card">
          <div className="contact-copy">
            <span className="section-eyebrow">{lang === 'en' ? 'For your darshan' : 'दर्शन के लिए'}</span>
            <h2>{lang === 'en' ? 'How to reach Rajdah Dham' : 'राजदाह धाम कैसे पहुंचें'}</h2>
            {locationError ? (
              <p className="contact-location-error" role="alert">
                {lang === 'en'
                  ? 'Directions could not be loaded. Please call the Samiti for help.'
                  : 'रास्ते की जानकारी लोड नहीं हो सकी। कृपया सहायता के लिए समिति को फोन करें।'}
              </p>
            ) : !about ? (
              <p>{lang === 'en' ? 'Loading address and directions…' : 'पता और रास्ते की जानकारी लोड हो रही है…'}</p>
            ) : (
              <>
                <p className="contact-address-line">
                  <strong>{lang === 'en' ? 'Address' : 'पता'}</strong>
                  {localized('address')}
                </p>
                <p>{localized('how_to_reach')}</p>
              </>
            )}
          </div>
          <div className="contact-photo">
            <img src="/images/slider/rajdah-dham-temple-entrance.jpg" alt={lang === 'en' ? 'Rajdah Dham temple entrance' : 'राजदाह धाम का प्रवेश द्वार'} loading="lazy" decoding="async" />
          </div>
        </div>

        {about && (
          <section className="travel-info" aria-labelledby="travel-info-heading">
            <div className="travel-info-heading">
              <span className="section-eyebrow">{lang === 'en' ? 'Plan your journey' : 'अपनी यात्रा की योजना बनाएं'}</span>
              <h2 id="travel-info-heading">
                {lang === 'en' ? 'Rail and air connections' : 'रेल और हवाई संपर्क'}
              </h2>
              <p>{lang === 'en'
                ? 'Approximate driving distances from Rajdah Dham. Select a place to check the latest route on Google Maps.'
                : 'राजदाह धाम से अनुमानित सड़क दूरी। ताज़ा रास्ता देखने के लिए स्थान चुनकर Google Maps खोलें।'}</p>
            </div>
            <div className="travel-distance-groups">
              {[
                {
                  key: 'railway_stations',
                  title: lang === 'en' ? 'Railway stations' : 'रेलवे स्टेशन',
                },
                {
                  key: 'airports',
                  title: lang === 'en' ? 'Airports' : 'हवाई अड्डे',
                },
              ].map((group) => {
                const places = about[group.key];
                if (!Array.isArray(places) || places.length === 0) return null;
                return (
                  <div className="travel-distance-group" key={group.key}>
                    <h3>{group.title}</h3>
                    <div className="travel-distance-cards">
                      {places.map((place) => (
                        <a
                          className="travel-distance-card"
                          href={getDirectionsUrl(place.destination)}
                          key={place.destination}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <strong>{place[`name_${lang}`]}</strong>
                          <span>{place[`distance_${lang}`]}</span>
                          <span className="travel-distance-link">
                            {lang === 'en' ? 'View route' : 'रास्ता देखें'} <ArrowUpRight size={14} />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div
          className="contact-details-grid"
          id="contact-details"
          aria-label={lang === 'en' ? 'Committee contact details' : 'समिति की संपर्क जानकारी'}
          tabIndex="-1"
        >
          <a className="contact-detail-card" href="tel:+919939568818">
            <span className="contact-detail-icon"><Phone size={20} /></span>
            <span className="contact-detail-label">{lang === 'en' ? 'Call the help desk' : 'हेल्प डेस्क पर कॉल करें'}</span>
            <strong>+91 99395 68818</strong>
            <span className="contact-detail-action">{lang === 'en' ? 'Call now' : 'अभी कॉल करें'} <ArrowUpRight size={15} /></span>
          </a>
          <a className="contact-detail-card whatsapp-contact-card" href={whatsappUrl} target="_blank" rel="noreferrer">
            <span className="contact-detail-icon"><MessageCircle size={20} /></span>
            <span className="contact-detail-label">{lang === 'en' ? 'Message us on WhatsApp' : 'WhatsApp पर संदेश भेजें'}</span>
            <strong>+91 99395 68818</strong>
            <span className="contact-detail-action">{lang === 'en' ? 'Start a chat' : 'चैट शुरू करें'} <ArrowUpRight size={15} /></span>
          </a>
          <a className="contact-detail-card" href="mailto:rajdahdhamofficial@gmail.com">
            <span className="contact-detail-icon"><Mail size={20} /></span>
            <span className="contact-detail-label">{lang === 'en' ? 'Email the committee' : 'समिति को ईमेल करें'}</span>
            <strong className="contact-email">rajdahdhamofficial@gmail.com</strong>
            <span className="contact-detail-action">{lang === 'en' ? 'Send an email' : 'ईमेल भेजें'} <ArrowUpRight size={15} /></span>
          </a>
        </div>

        <LocationMap />
      </section>
    </main>
  );
}
