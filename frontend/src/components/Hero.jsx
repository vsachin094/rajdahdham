import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const slides = [
  {
    image: '/images/slider/rajdah-dham-temple-entrance.jpg',
    alt: { en: 'Entrance to Rajdah Dham', hi: 'राजदाह धाम का प्रवेश द्वार' },
    title: { en: 'A sacred abode of Lord Shiva.', hi: 'भगवान शिव का पावन धाम।' },
    subtitle: {
      en: 'A place of worship, rooted in faith and the living tradition of Tapaswi Mouni Baba.',
      hi: 'तपस्वी मौनी बाबा की जीवंत परंपरा और आस्था से जुड़ा पूजा का पावन स्थल।',
    },
  },
  {
    image: '/images/slider/community-gathering.jpg',
    alt: { en: 'Community members gathered at Rajdah Dham', hi: 'राजदाह धाम में एकत्र समुदाय के लोग' },
    title: { en: 'Where devotees gather in faith.', hi: 'जहां श्रद्धालु आस्था से एकत्र होते हैं।' },
    subtitle: {
      en: 'The shrines of Shiva, Maa Parvati, Nandi and Hanuman are at the heart of the Dham.',
      hi: 'भगवान शिव, मां पार्वती, नंदी और हनुमान के मंदिर इस धाम की आस्था के केंद्र हैं।',
    },
  },
  {
    image: '/images/slider/mouni-baba-memorial-shrine.jpg',
    alt: { en: 'The memorial shrine of Tapaswi Mouni Baba', hi: 'तपस्वी मौनी बाबा का स्मृति मंदिर' },
    title: { en: 'A place of tapasya and remembrance.', hi: 'तपस्या और स्मरण का पावन स्थल।' },
    subtitle: {
      en: 'The Dham’s story honours Tapaswi Mouni Baba and the devotion carried forward by generations.',
      hi: 'धाम की कथा तपस्वी मौनी बाबा और पीढ़ियों से चली आ रही भक्ति का स्मरण कराती है।',
    },
  },
];

export default function Hero() {
  const { lang } = useLanguage();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const touchStart = React.useRef(null);

  React.useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section
      className="hero-section"
      aria-label={lang === 'en' ? 'Welcome to Rajdah Dham' : 'राजदाह धाम में आपका स्वागत है'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 48) moveSlide(distance < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="hero-photo" aria-hidden="true">
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            className={`hero-slide${index === activeSlide ? ' hero-slide-active' : ''}`}
            src={slide.image}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="mandala-scene" aria-hidden="true">
        <div className="mandala-orbit mandala-orbit-outer" />
        <div className="mandala-orbit mandala-orbit-inner" />
        <div className="mandala-sun" />
        <span className="mandala-om">ॐ</span>
      </div>

      <div className="hero-content">
        <div className="hero-location"><MapPin size={15} /> Rajdah Dham · Giridih, Jharkhand</div>
        <p className="hero-overline">{lang === 'en' ? 'Rooted in faith and devotion' : 'आस्था और भक्ति से जुड़ा पावन धाम'}</p>
        <h1 key={slides[activeSlide].title[lang]}>{slides[activeSlide].title[lang]}</h1>
        <p className="hero-description">{slides[activeSlide].subtitle[lang]}</p>
        <div className="hero-actions">
          <Link to="/about" className="hero-button hero-button-primary">
            {lang === 'en' ? 'The story of the Dham' : 'धाम की कथा'}
            <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="hero-button hero-button-quiet">
            {lang === 'en' ? 'Darshan & directions' : 'दर्शन और रास्ता'}
          </Link>
        </div>
      </div>

      <div className="hero-controls">
        <div className="hero-pagination" aria-label={lang === 'en' ? 'Choose a slide' : 'स्लाइड चुनें'}>
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`hero-dot${index === activeSlide ? ' hero-dot-active' : ''}`}
              aria-label={lang === 'en' ? `Show slide ${index + 1}` : `स्लाइड ${index + 1} दिखाएं`}
              aria-current={index === activeSlide ? 'true' : undefined}
            />
          ))}
        </div>
        <div className="hero-arrows">
          <button type="button" onClick={() => moveSlide(-1)} aria-label={lang === 'en' ? 'Previous image' : 'पिछली तस्वीर'}>
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => moveSlide(1)} aria-label={lang === 'en' ? 'Next image' : 'अगली तस्वीर'}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <a className="hero-scroll" href="#about" aria-label={lang === 'en' ? 'Read about the Dham' : 'धाम के बारे में जानें'}>
        <ArrowDown size={16} />
        <span>{lang === 'en' ? 'The Dham’s story' : 'धाम की कथा'}</span>
      </a>
    </section>
  );
}
