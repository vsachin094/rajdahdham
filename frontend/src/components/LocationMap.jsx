import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const locationQuery = 'Rajdah Dham, Sabalpur, Suriya, Giridih, Jharkhand';
const directionsUrl = `https://maps.google.com/?q=${encodeURIComponent(locationQuery)}`;
const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`;

export default function LocationMap() {
  const { lang } = useLanguage();

  return (
    <section
      className="location-map-section"
      aria-label={lang === 'en' ? 'Rajdah Dham location' : 'राजदाह धाम का स्थान'}
    >
      <div className="location-map-frame">
        <iframe
          title={lang === 'en' ? 'Map showing Rajdah Dham in Suriya, Giridih' : 'सरिया, गिरिडीह में राजदाह धाम का मानचित्र'}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a className="text-link location-map-directions" href={directionsUrl} target="_blank" rel="noreferrer">
        {lang === 'en' ? 'Open directions in Google Maps' : 'Google Maps में रास्ता देखें'} <ArrowUpRight size={17} />
      </a>
    </section>
  );
}
