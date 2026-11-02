import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SpiritualBackground from './SpiritualBackground';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', key: 'home' },
    { path: '/about', key: 'about' },
    { path: '/members', key: 'members' },
    { path: '/gallery', key: 'gallery' },
    { path: '/park', key: 'park' },
    { path: '/contact', key: 'contact' },
    { path: '/donate', key: 'donate', special: true },
  ];

  const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/');

  return (
    <>
      <SpiritualBackground />

      <div className="top-bar">
        <div className="container">
          <div className="contact-info">
            <span>📿 Rajdah Dham, Mandir, Sabalpur, Suriya, Giridih (825320), Jharkhand</span>
            <span>📞 Help Desk: +91-99395 68818</span>
            <span>✉️ rajdahdhamofficial@gmail.com</span>
          </div>
<div className="socials">
              <a href="https://www.facebook.com/share/19F2CEmSaG/" target="_blank" rel="noreferrer" aria-label="Facebook">📘</a>
              <button aria-label="Instagram">📷</button>
              <button aria-label="Twitter">🐦</button>
              <a href="https://youtube.com/@tapsvimounibaba?si=EAb7mRCfgVEXWk2s" target="_blank" rel="noreferrer" aria-label="YouTube">▶️</a>
              <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="lang-switch">
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>
            </div>
        </div>
      </div>

      <header className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/images/site/rajdah-dham-logo.png" alt="Rajdah Dham Mandir Logo" />
          </Link>
          <nav>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    {t[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            ☰
          </button>
          {mobileOpen && (
            <ul className="nav-links mobile">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    {t[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </>
  );
}
