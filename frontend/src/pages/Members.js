import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

async function getMembers() {
  const response = await fetch('/api/members');
  if (!response.ok) throw new Error(`Could not load committee members (${response.status})`);
  return response.json();
}

export default function Members() {
  const { lang } = useLanguage();
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMembers()
      .then(setGroups)
      .catch((loadError) => {
        console.error(loadError);
        setError(true);
      });
  }, []);

  const people = groups && ['officers', 'guardians', 'members']
    .flatMap((category) => groups[category]);

  return (
    <main className="page-main">
      <section className="page-heading">
        <div className="section-eyebrow"><Users size={16} /> {lang === 'en' ? 'The people behind the seva' : 'सेवा से जुड़े लोग'}</div>
        <h1>{lang === 'en' ? 'Meet our committee.' : 'हमारी समिति से मिलें।'}</h1>
        <p>{lang === 'en'
          ? 'Meet the officers, guardians and members who serve Rajdah Dham.'
          : 'राजदाह धाम की सेवा करने वाले पदाधिकारियों, संरक्षकों और सदस्यों से मिलें।'}</p>
      </section>

      <section className="content-section members-page-content">
        {error ? (
          <div className="notice-card" role="alert">
            {lang === 'en' ? 'Committee details could not be loaded. Please try again later.' : 'समिति की जानकारी लोड नहीं हो सकी। कृपया बाद में पुनः प्रयास करें।'}
          </div>
        ) : !people ? (
          <p className="loading-copy">{lang === 'en' ? 'Loading committee details…' : 'समिति की जानकारी लोड हो रही है…'}</p>
        ) : (
          <div className="officers-grid">
            {people.map((person) => (
              <article className="officer-card" key={`${person.role}-${person.name}`}>
                <img src={person.image} alt={person.name} loading="lazy" decoding="async" />
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
