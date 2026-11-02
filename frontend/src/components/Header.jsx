import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Clock3, MapPin, Menu, Phone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const navigation = [
  { to: '/', en: 'Home', hi: 'होम' },
  { to: '/about', en: 'About us', hi: 'हमारे बारे में' },
  { to: '/park', en: 'Nature Park', hi: 'नेचर पार्क' },
  { to: '/members', en: 'Our Members', hi: 'हमारे सदस्य' },
  { to: '/events', en: 'Events & updates', hi: 'कार्यक्रम और समाचार' },
  { to: '/gallery', en: 'Gallery', hi: 'गैलरी' },
  { to: '/contact', en: 'Contact us', hi: 'संपर्क करें' },
];

export default function Header() {
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;

  return (
    <header className={`site-header${scrolled ? ' site-header-scrolled' : ''}`}>
      <div className="utility-bar">
        <div className="utility-inner">
          <a
            href="https://maps.google.com/?q=Rajdah+Dham,+Sabalpur,+Suriya,+Giridih,+Jharkhand"
            target="_blank"
            rel="noreferrer"
            className="utility-item utility-location"
          >
            <MapPin aria-hidden="true" size={15} />
            <span>Rajdah Dham, Sabalpur, Suriya, Giridih, Jharkhand 825320</span>
          </a>
          <div className="utility-actions">
            <span className="utility-item utility-hours">
              <Clock3 aria-hidden="true" size={15} />
              {lang === 'en' ? 'Temple: 5 AM–9 PM' : 'मंदिर: सुबह 5–रात 9'}
            </span>
            <a className="utility-item" href="tel:+919939568818">
              <Phone aria-hidden="true" size={15} />
              +91 99395 68818
            </a>
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="language-toggle"
              aria-label={lang === 'en' ? 'Switch language to Hindi' : 'Switch language to English'}
            >
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>
      </div>
      <div className="navigation-wrap">
        <nav className="main-navigation" aria-label="Main navigation">
          <Link to="/" className="brand" aria-label="Rajdah Dham home">
            <img src="/images/site/rajdah-dham-logo.png" alt="" className="brand-mark" />
            <span className="brand-copy">
              <span className="brand-name">Rajdah Dham</span>
              <span className="brand-subtitle">तपस्वी मौनी बाबा राजदाह धाम समिति</span>
            </span>
          </Link>

          <div className="desktop-nav-links">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {lang === 'en' ? item.en : item.hi}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <Link to="/donate" className="donate-link">
              {lang === 'en' ? 'Donate' : 'दान करें'}
            </Link>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav-links" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {lang === 'en' ? item.en : item.hi}
              </NavLink>
            ))}
            <Link to="/donate" className="mobile-donate-link">
              {lang === 'en' ? 'Donate to Rajdah Dham' : 'राजदाह धाम में दान करें'}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
