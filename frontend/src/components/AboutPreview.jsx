import React from 'react';
import { ArrowRight, BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPreview() {
  const { lang } = useLanguage();

  return (
    <section className="devotion-section" id="about">
      <div className="devotion-image">
        <img
          src="/images/site/mouni-baba-statue.jpg"
          alt={lang === 'en' ? 'The statue of Tapaswi Mouni Baba at Rajdah Dham' : 'राजदाह धाम में तपस्वी मौनी बाबा की प्रतिमा'}
          loading="lazy"
          decoding="async"
        />
        <div className="devotion-image-caption">
          <span className="devotion-om" aria-hidden="true">ॐ</span>
          <span>
            <strong>{lang === 'en' ? 'Tapaswi Mouni Baba' : 'तपस्वी मौनी बाबा'}</strong>
            <small>{lang === 'en' ? 'Remembered in the Dham’s living tradition' : 'धाम की जीवंत परंपरा में स्मरणीय'}</small>
          </span>
        </div>
      </div>

      <div className="devotion-copy">
        <span className="section-eyebrow"><BookOpen size={16} /> {lang === 'en' ? 'A place of worship and faith' : 'पूजा और आस्था का पावन धाम'}</span>
        <h2>{lang === 'en' ? 'Worship and faith at Rajdah Dham.' : 'राजदाह धाम में पूजा और आस्था।'}</h2>
        <p>
          {lang === 'en'
            ? 'Rajdah Dham is a Hindu place of worship in Sabalpur, Suriya, Giridih. Devotees come to pray at the shrines of Lord Shiva, Maa Parvati, Nandi and Hanuman.'
            : 'राजदाह धाम गिरिडीह के सरिया स्थित सबलपुर में हिंदू धर्म का एक पूजास्थल है। श्रद्धालु भगवान शिव, मां पार्वती, नंदी और हनुमान के मंदिरों में पूजा-अर्चना के लिए आते हैं।'}
        </p>
        <p>
          {lang === 'en'
            ? 'The Dham is associated with Tapaswi Mouni Baba, remembered for his penance here. Local tradition also connects this place with Shiva granting the Pashupatastra to Arjuna; devotees revere the north-flowing Barakar as spiritually auspicious.'
            : 'यह धाम तपस्वी मौनी बाबा से जुड़ा है, जिनकी यहां की तपस्या को स्मरण किया जाता है। स्थानीय परंपरा इस स्थल को भगवान शिव द्वारा अर्जुन को पाशुपतास्त्र देने की कथा से भी जोड़ती है; श्रद्धालु उत्तरवाहिनी बराकर को आध्यात्मिक रूप से शुभ मानते हैं।'}
        </p>
        <div className="devotion-belief">
          <Heart size={18} aria-hidden="true" />
          <span>
            {lang === 'en'
              ? 'Devotees revere the north-flowing Barakar as sacred; bathing here is believed to bring punya comparable to a dip in the Ganga.'
              : 'श्रद्धालु उत्तरवाहिनी बराकर को पवित्र मानते हैं। यहां स्नान को गंगा स्नान के समान पुण्यदायी माना जाता है।'}
          </span>
        </div>
        <Link to="/about" className="text-link">
          {lang === 'en' ? 'Read the story and traditions' : 'धाम का इतिहास और परंपराएं जानें'} <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
