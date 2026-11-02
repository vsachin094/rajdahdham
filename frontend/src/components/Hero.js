import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SLIDER_IMAGES = [
  '/images/slider/rajdah-dham-temple-entrance.jpg',
  '/images/slider/community-gathering.jpg',
  '/images/slider/mouni-baba-memorial-shrine.jpg',
];

export default function Hero() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDER_IMAGES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    { title: t.welcome, subtitle: t.spreadSpirituality, cta: 'Know More', href: '/about' },
    { title: t.devotionAndService, subtitle: 'Rajdah Dham, Giridih Jharkhand ka prasiddh dharmik sthal', cta: 'See Nature Park', href: '/park' },
    { title: t.religiousRituals, subtitle: 'Sampann karein puja-archana aur punya arjit karein', cta: 'Donate Now', href: '/donate' },
  ];

  return (
    <section className="hero">
      <div className="hero-content reveal active">
        <div className="om-decor">ॐ</div>
        <h1>{slides[current].title}</h1>
        <p>{slides[current].subtitle}</p>
        <div className="hero-actions">
          <Link to={slides[current].href} className="btn-saffron">
            {slides[current].cta}
          </Link>
          <Link to="/gallery" className="btn-outline">
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
