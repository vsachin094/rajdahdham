import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const links = [
  { to: '/about', en: 'About Rajdah Dham', hi: 'राजदाह धाम के बारे में' },
  { to: '/park', en: 'Nature Park', hi: 'नेचर पार्क' },
  { to: '/members', en: 'Our Members', hi: 'हमारे सदस्य' },
  { to: '/events', en: 'Events & updates', hi: 'कार्यक्रम और समाचार' },
  { to: '/gallery', en: 'Photo gallery', hi: 'फोटो गैलरी' },
  { to: '/contact', en: 'Darshan & directions', hi: 'दर्शन और रास्ता' },
];

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand footer-brand-link">
            <img src="/images/site/rajdah-dham-logo.png" alt="" className="brand-mark" />
            <span className="brand-copy">
              <span className="brand-name">Rajdah Dham</span>
              <span className="brand-subtitle">तपस्वी मौनी बाबा राजदाह धाम समिति</span>
            </span>
          </Link>
          <p>{lang === 'en'
            ? 'A place of worship in Sabalpur, held dear by devotees and rooted in the traditions of Tapaswi Mouni Baba.'
            : 'सबलपुर का पूजास्थल, श्रद्धालुओं की आस्था और तपस्वी मौनी बाबा की परंपरा से जुड़ा।'}</p>
        </div>
        <div className="footer-links">
          <h2>{lang === 'en' ? 'Explore' : 'जानें'}</h2>
          {links.map((link) => <Link key={link.to} to={link.to}>{link[lang]}</Link>)}
          <Link to="/donate">{lang === 'en' ? 'Support Rajdah Dham' : 'राजदाह धाम में सहयोग करें'}</Link>
        </div>
        <div className="footer-contact">
          <h2>{lang === 'en' ? 'Get in touch' : 'संपर्क करें'}</h2>
          <a href="https://maps.google.com/?q=Rajdah+Dham,+Sabalpur,+Suriya,+Giridih,+Jharkhand" target="_blank" rel="noreferrer">
            <MapPin size={16} /> Rajdah Dham, Sabalpur, Suriya, Giridih, Jharkhand 825320
          </a>
          <a href="tel:+919939568818"><Phone size={16} /> +91 99395 68818</a>
          <a href="mailto:rajdahdhamofficial@gmail.com"><Mail size={16} /> rajdahdhamofficial@gmail.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rajdah Dham Samiti</span>
        <span>{lang === 'en' ? 'Made with reverence in Giridih, Jharkhand.' : 'श्रद्धा के साथ गिरिडीह, झारखंड में निर्मित।'}</span>
        <span>
          <a href="https://github.com/vsachin094/rajdahdham" target="_blank" rel="noreferrer">
            {lang === 'en' ? 'Source code' : 'सोर्स कोड'}
          </a>
          {' · '}
          <a href="https://github.com/vsachin094/rajdahdham/blob/main/LICENSE" target="_blank" rel="noreferrer">
            AGPL-3.0-or-later
          </a>
        </span>
      </div>
    </footer>
  );
}
