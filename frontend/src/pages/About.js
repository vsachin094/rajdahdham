import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Heart, Trees, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed for ${url} (${response.status})`);
  return response.json();
}

export default function About() {
  const { lang } = useLanguage();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getJson('/api/about'), getJson('/api/members')])
      .then(([about, members]) => setContent({ about, members }))
      .catch((loadError) => {
        console.error(loadError);
        setError(true);
      });
  }, []);

  const localized = (data, key) => data?.[`${key}_${lang}`] || data?.[`${key}_en`] || '';

  return (
    <main className="page-main">
      <section className="page-heading">
        <div className="section-eyebrow"><span className="om-bullet">ॐ</span> {lang === 'en' ? 'Our story' : 'हमारी कहानी'}</div>
        <h1>{lang === 'en' ? 'A place of worship, penance and faith.' : 'पूजा, तपस्या और आस्था का पावन धाम।'}</h1>
        <p>{lang === 'en'
          ? 'The shrines, the memory of Tapaswi Mouni Baba, and the traditions held dear by devotees.'
          : 'यहां के मंदिर, तपस्वी मौनी बाबा का स्मरण और श्रद्धालुओं की प्रिय धार्मिक परंपराएं।'}</p>
      </section>

      {error ? (
        <section className="content-section"><div className="notice-card" role="alert">
          {lang === 'en' ? 'Some temple information could not be loaded. Please try again later.' : 'मंदिर की कुछ जानकारी लोड नहीं हो सकी। कृपया बाद में पुनः प्रयास करें।'}
        </div></section>
      ) : !content ? (
        <section className="content-section"><p className="loading-copy">{lang === 'en' ? 'Loading Rajdah Dham…' : 'राजदाह धाम की जानकारी लोड हो रही है…'}</p></section>
      ) : (
        <>
          <section className="content-section about-overview">
            <div className="about-visual">
              <img src="/images/site/mouni-baba-statue.jpg" alt={lang === 'en' ? 'Tapaswi Mouni Baba' : 'तपस्वी मौनी बाबा'} loading="lazy" decoding="async" />
              <span className="about-image-caption">
                <span className="about-image-om">ॐ</span>
                <span>{lang === 'en' ? 'Tapaswi Mouni Baba' : 'तपस्वी मौनी बाबा'}<small>{lang === 'en' ? 'Spiritual inspiration of Rajdah Dham' : 'राजदाह धाम की आध्यात्मिक प्रेरणा'}</small></span>
              </span>
            </div>
            <div className="about-story">
              <span className="section-eyebrow">{localized(content.about, 'subtitle')}</span>
              <h2>{localized(content.about, 'title')}</h2>
              <p>{localized(content.about, 'intro')}</p>
              <Link to="/contact" className="text-link">
                {lang === 'en' ? 'Darshan details & directions' : 'दर्शन का समय और रास्ता'} <ArrowRight size={17} />
              </Link>
            </div>
          </section>

          <section className="content-section faith-section">
            <div className="home-section-heading">
              <span className="section-eyebrow"><span className="om-bullet">ॐ</span> {lang === 'en' ? 'History, devotion and religious significance' : 'इतिहास, भक्ति और धार्मिक महत्त्व'}</span>
              <h2>{lang === 'en' ? 'A living tradition of worship and faith.' : 'पूजा और आस्था की जीवंत परंपरा।'}</h2>
            </div>
            <div className="about-belief-list">
              <article className="about-belief-entry">
                <span className="about-belief-icon"><span className="om-bullet">ॐ</span></span>
                <div>
                  <h3>{lang === 'en' ? 'Devotional belief' : 'भक्ति और आस्था'}</h3>
                  <p>{localized(content.about, 'devotional_belief')}</p>
                </div>
              </article>
              <article className="about-belief-entry">
                <span className="about-belief-icon"><Trees size={20} /></span>
                <div>
                  <h3>{lang === 'en' ? 'History and local tradition' : 'इतिहास और स्थानीय परंपरा'}</h3>
                  <p>{localized(content.about, 'history')}</p>
                </div>
              </article>
              <article className="about-belief-entry">
                <span className="about-belief-icon"><Heart size={20} /></span>
                <div>
                  <h3>{lang === 'en' ? 'Religious significance of the Barakar' : 'बराकर का धार्मिक महत्त्व'}</h3>
                  <p>{localized(content.about, 'religious_significance')}</p>
                </div>
              </article>
            </div>
          </section>

          <section className="about-landscape-section">
            <div className="about-landscape-copy">
              <span className="section-eyebrow"><Trees size={16} /> {lang === 'en' ? 'The sacred landscape' : 'धाम का पवित्र प्राकृतिक परिवेश'}</span>
              <h2>{lang === 'en' ? 'The Barakar beside the Dham.' : 'धाम के निकट बहती बराकर।'}</h2>
              <p>{localized(content.about, 'natural_beauty')}</p>
            </div>
            <figure className="about-river-image">
              <img src="/images/event_images/nature-park-inauguration/park-river-at-sunset.jpg" alt={lang === 'en' ? 'Barakar River flowing among rocks near Rajdah Dham' : 'राजदाह धाम के निकट चट्टानों के बीच बहती बराकर नदी'} loading="lazy" decoding="async" />
              <figcaption>{lang === 'en' ? 'The Barakar near Rajdah Dham' : 'राजदाह धाम के निकट बराकर नदी'}</figcaption>
            </figure>
          </section>

          <section className="content-section about-explore-section" aria-labelledby="about-explore-heading">
            <div className="home-section-heading">
              <span className="section-eyebrow">{lang === 'en' ? 'Explore Rajdah Dham' : 'राजदाह धाम के बारे में और जानें'}</span>
              <h2 id="about-explore-heading">{lang === 'en' ? 'More about the Dham.' : 'धाम से जुड़ी और जानकारी।'}</h2>
            </div>
            <div className="about-explore-grid">
              <Link to="/park" className="about-explore-card">
                <span className="about-explore-icon"><Trees size={20} /></span>
                <span className="about-explore-copy">
                  <strong>{lang === 'en' ? 'Nature Park' : 'नेचर पार्क'}</strong>
                  <small>{lang === 'en' ? 'Explore the separate Nature Park page.' : 'नेचर पार्क की अलग जानकारी देखें।'}</small>
                </span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/members" className="about-explore-card">
                <span className="about-explore-icon"><UsersRound size={20} /></span>
                <span className="about-explore-copy">
                  <strong>{lang === 'en' ? 'Committee members' : 'समिति के सदस्य'}</strong>
                  <small>{lang === 'en' ? 'Meet the people serving the Dham.' : 'धाम की सेवा करने वाले सदस्यों से मिलें।'}</small>
                </span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/events" className="about-explore-card">
                <span className="about-explore-icon"><CalendarDays size={20} /></span>
                <span className="about-explore-copy">
                  <strong>{lang === 'en' ? 'Events and updates' : 'कार्यक्रम और समाचार'}</strong>
                  <small>{lang === 'en' ? 'See upcoming events and recent updates.' : 'आगामी कार्यक्रम और नए समाचार देखें।'}</small>
                </span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/donate" className="about-explore-card">
                <span className="about-explore-icon"><Heart size={20} /></span>
                <span className="about-explore-copy">
                  <strong>{lang === 'en' ? 'Support the Dham' : 'धाम में सहयोग करें'}</strong>
                  <small>{lang === 'en' ? 'Find ways to contribute to the Dham.' : 'धाम में योगदान देने के तरीके जानें।'}</small>
                </span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>

          <section className="committee-section" id="committee">
            <div className="content-section">
              <div className="home-section-heading">
                <span className="section-eyebrow">{lang === 'en' ? 'The people behind the seva' : 'सेवा से जुड़े लोग'}</span>
                <h2>{lang === 'en' ? 'Rajdah Dham Samiti' : 'राजदाह धाम समिति'}</h2>
                <p>{lang === 'en'
                  ? 'Meet the committee officers serving the Dham.'
                  : 'धाम की सेवा करने वाले समिति के पदाधिकारियों से मिलें।'}</p>
              </div>
              <div className="officers-grid">
                {content.members.officers.map((member) => (
                  <article className="officer-card" key={member.name}>
                    <img src={member.image} alt={member.name} loading="lazy" decoding="async" />
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </article>
                ))}
              </div>
              <div className="committee-more-link">
                <Link to="/members" className="text-link">
                  {lang === 'en' ? 'Meet all committee members' : 'समिति के सभी सदस्यों से मिलें'} <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
