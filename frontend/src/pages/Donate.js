import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy, Heart, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Donate() {
  const { lang } = useLanguage();
  const [bank, setBank] = useState(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState('');
  const [copyError, setCopyError] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    fetch('/api/donate/info')
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load donation details (${response.status})`);
        return response.json();
      })
      .then(setBank)
      .catch((loadError) => {
        console.error(loadError);
        setError(true);
      });
  }, []);

  const copyValue = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setCopyError(false);
      window.setTimeout(() => setCopied(''), 2200);
    } catch (copyFailure) {
      console.error(copyFailure);
      setCopyError(true);
    }
  };

  const bankFields = bank && [
    { key: 'account', label: lang === 'en' ? 'Account number' : 'खाता संख्या', value: bank.account_number },
    { key: 'ifsc', label: lang === 'en' ? 'IFSC code' : 'आईएफएससी कोड', value: bank.ifsc },
    { key: 'bank', label: lang === 'en' ? 'Bank' : 'बैंक', value: lang === 'en' ? bank.bank_name : bank.bank_name_hi },
  ];

  return (
    <main className="page-main">
      <section className="page-heading">
        <div className="section-eyebrow"><Heart size={16} /> {lang === 'en' ? 'Support Rajdah Dham' : 'राजदाह धाम में सहयोग करें'}</div>
        <h1>{lang === 'en' ? 'Be a part of the seva.' : 'सेवा में सहभागी बनें।'}</h1>
        <p>{lang === 'en'
          ? 'Your contribution helps support the ongoing care and development of Rajdah Dham.'
          : 'आपका योगदान राजदाह धाम की निरंतर देखभाल और विकास में सहायक है।'}</p>
      </section>

      <section className="content-section donation-page-section">
        <div className="donation-qr-card">
          <div className="donation-card-heading">
            <span className="bank-card-icon"><Heart size={21} /></span>
            <div>
              <span className="section-eyebrow">{lang === 'en' ? 'Scan to contribute' : 'योगदान के लिए स्कैन करें'}</span>
              <h2>{lang === 'en' ? 'Support Rajdah Dham' : 'राजदाह धाम में सहयोग करें'}</h2>
            </div>
          </div>
          <p className="donation-qr-description">{lang === 'en'
            ? 'Scan the QR code to make a contribution.'
            : 'योगदान देने के लिए QR कोड स्कैन करें।'}</p>
          <div className="donation-qr-frame">
            {qrError ? (
              <p className="donation-qr-error" role="status">{lang === 'en'
                ? 'QR code is unavailable. Please use the bank details or contact the committee.'
                : 'QR कोड उपलब्ध नहीं है। कृपया बैंक विवरण का उपयोग करें या समिति से संपर्क करें।'}</p>
            ) : (
              <img
                src="/images/site/donation-qr-poster.jpeg"
                alt={lang === 'en' ? 'Donation QR code for Rajdah Dham' : 'राजदाह धाम के लिए दान QR कोड'}
                loading="lazy"
                decoding="async"
                onError={() => setQrError(true)}
              />
            )}
          </div>
          <div className="donation-qr-footer">
            <span>{lang === 'en'
              ? 'For donation receipts or transfer help, contact the committee.'
              : 'दान की पावती या ट्रांसफर सहायता के लिए समिति से संपर्क करें।'}</span>
            <Link to="/contact#contact-details" className="text-link">
              {lang === 'en' ? 'Contact the committee' : 'समिति से संपर्क करें'} <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="bank-details-card">
          <div className="bank-card-heading">
            <span className="bank-card-icon"><Landmark size={21} /></span>
            <div>
              <span className="section-eyebrow">{lang === 'en' ? 'Direct bank transfer' : 'सीधा बैंक ट्रांसफर'}</span>
              <h2>{bank?.[`bank_title_${lang}`] || (lang === 'en' ? 'Bank details' : 'बैंक विवरण')}</h2>
            </div>
          </div>
          {error ? (
            <div className="notice-card" role="alert">
              {lang === 'en' ? 'Bank details could not be loaded. Please contact the committee.' : 'बैंक विवरण लोड नहीं हो सका। कृपया समिति से संपर्क करें।'}
            </div>
          ) : !bank ? (
            <p className="loading-copy">{lang === 'en' ? 'Loading bank details…' : 'बैंक विवरण लोड हो रहा है…'}</p>
          ) : (
            <dl className="bank-fields">
              {bankFields.map((field) => (
                <div className="bank-field" key={field.key}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                  {field.key !== 'bank' && (
                    <button type="button" className="copy-button" onClick={() => copyValue(field.key, field.value)}>
                      {copied === field.key ? <Check size={16} /> : <Copy size={16} />}
                      {copied === field.key
                        ? (lang === 'en' ? 'Copied' : 'कॉपी हुआ')
                        : (lang === 'en' ? 'Copy' : 'कॉपी करें')}
                    </button>
                  )}
                </div>
              ))}
            </dl>
          )}
          {copyError && <p className="copy-error" role="status">{lang === 'en' ? 'Copy failed. Please select and copy the details manually.' : 'कॉपी नहीं हो सका। कृपया विवरण चुनकर कॉपी करें।'}</p>}
          <p className="bank-disclaimer">{lang === 'en'
            ? 'Please verify the account details with the committee before making a transfer.'
            : 'ट्रांसफर करने से पहले समिति से बैंक विवरण की पुष्टि अवश्य करें।'}</p>
        </div>
      </section>
    </main>
  );
}
