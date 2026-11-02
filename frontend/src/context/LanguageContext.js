import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const LanguageContext = createContext();
const LANGUAGE_PREFERENCE_KEY = 'rajdahdham-language';

export function languageForLocation(location) {
  const countryCode = typeof location?.country_code === 'string'
    ? location.country_code.trim().toUpperCase()
    : '';
  const region = typeof location?.region === 'string'
    ? location.region.trim().toLowerCase()
    : '';
  return countryCode === 'IN' && region === 'jharkhand' ? 'hi' : 'en';
}

export const translations = {
  en: {
    siteTitle: 'Rajdah Dham | Tapaswi Mouni Baba Rajdah Dham Samiti',
    home: 'Home',
    about: 'About Temple',
    members: 'Our Members',
    gallery: 'Gallery',
    park: 'Nature Park',
    contact: 'Contact Us',
    donate: 'Donate Now',
    liveDarshan: 'Live Darshan',
    seva: 'Seva Booking',
    events: 'Events',
    welcome: 'Welcome to Rajdah Dham',
    aboutUs: 'About Temple',
    ourIntroduction: 'About Rajdah Dham',
    ourMembers: 'Our Members',
    committeeOfficers: 'Committee Officers',
    committeeGuardians: 'Committee Guardians',
    committeeMembers: 'Committee Members',
    ourGallery: 'Our Gallery',
    ourParkGallery: 'Our Park Gallery',
    parkTiming: 'Park Timing',
    parkTimingText: '9:00 AM to 6:00 PM',
    foundationStone: 'Foundation Stone',
    foundationText: 'Laid on 9 November 2022 by then MLA Vinod Kumar Singh.',
    allocatedAmount: 'Allocated Amount',
    amountText: '₹2.83 Crores allocated by Jharkhand Government.',
    constructionTarget: 'Construction Target',
    duration: 'Construction Duration',
    durationText: 'About 2 years',
    inauguration: 'Inauguration',
    inaugurationText: '3 February 2024 in presence of MLA Vinod Singh and MP Annapurna Devi.',
    donateNow: 'Donate Now',
    yourContribution: 'Your contribution to Rajdah Dham',
    donateDesc: 'Your cooperation is extremely important to keep the development, service work and religious programs going.',
    bankDetails: 'Bank Account Details for Payment',
    accountNumber: 'Account Number',
    ifscCode: 'IFSC Code',
    bankName: 'Bank Name',
    sendMessage: 'Send Message',
    officeAddress: 'Office Address',
    helpDeskNumber: 'Help Desk Number',
    mailUs: 'Mail Us',
    openingHours: 'Opening Hours',
    hoursText: '5:00 AM - 9:00 PM',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    submit: 'Submit',
    sending: 'Sending...',
    thankYou: 'Thank you! Your message has been submitted.',
    amount: 'Amount',
    donateDesc2: 'Your small contribution can become a part of great service.',
    receipt: 'If you need a receipt, please fill this form and submit.',
    uploadScreenshot: 'Please upload screenshot of donation made.',
    payNow: 'Submit Donation Request',
    paymentSuccess: 'Thank you! Your donation request has been submitted.',
    paymentFailed: 'Submission failed. Please try again.',
    quickLinks: 'Quick Links',
    contactDetails: 'Contact Details',
    adminLogin: 'Admin Login',
    copyright: '© 2026 Rajdah Dham | Tapaswi Mouni Baba Rajdah Dham Samiti | All Rights Reserved',
    backToTop: 'Back to top',
    loading: 'Loading...',
    planYourVisit: 'Plan Your Visit',
    knowMore: 'Know More',
    exploreNature: 'Explore Nature Park',
    viewGallery: 'View Gallery',
    donateNowShort: 'Donate Now',
  },
  hi: {
    siteTitle: 'राजदाह धाम | तपस्वी मौनी बाबा राजदाह धाम समिति',
    home: 'होम',
    about: 'मंदिर के बारे में',
    members: 'हमारे सदस्य',
    gallery: 'गैलरी',
    park: 'नेचर पार्क',
    contact: 'संपर्क करें',
    donate: 'दान करें',
    liveDarshan: 'लाइव दर्शन',
    seva: 'सेवा बुकिंग',
    events: 'कार्यक्रम',
    welcome: 'राजदाह धाम में आपका स्वागत है',
    aboutUs: 'मंदिर के बारे में',
    ourIntroduction: 'राजदाह धाम के बारे में',
    ourMembers: 'हमारे सदस्य',
    committeeOfficers: 'समिति के पदाधिकारी',
    committeeGuardians: 'समिति के संरक्षक',
    committeeMembers: 'समिति के सदस्य',
    ourGallery: 'हमारी फोटो गैलरी',
    ourParkGallery: 'हमारा पार्क गैलरी',
    parkTiming: 'पार्क का समय',
    parkTimingText: 'सुबह 9:00 बजे - शाम 6:00 बजे',
    foundationStone: 'पार्क की आधारशिला',
    foundationText: '9 नवंबर 2022 को तत्कालीन विधायक विनोद कुमार सिंह ने रखी।',
    allocatedAmount: 'आवंटित राशि',
    amountText: 'झारखंड सरकार द्वारा ₹2.83 करोड़ आवंटित।',
    constructionTarget: 'निर्माण लक्ष्य',
    duration: 'निर्माण अवधि',
    durationText: 'लगभग 2 वर्ष',
    inauguration: 'उद्घाटन',
    inaugurationText: '3 फरवरी 2024 को विधायक विनोद सिंह और सांसद अन्नपूर्णा देवी की उपस्थिति में।',
    donateNow: 'अभी दान करें',
    yourContribution: 'राजदाह धाम में आपका योगदान',
    donateDesc: 'इस पवित्र धाम के विकास, सेवा कार्यों और धार्मिक आयोजनों को बनाए रखने के लिए आपका सहयोग अत्यंत महत्वपूर्ण है।',
    bankDetails: 'भुगतान हेतु बैंक खाते का विवरण',
    accountNumber: 'खाता संख्या',
    ifscCode: 'आईएफएससी कोड',
    bankName: 'बैंक का नाम',
    sendMessage: 'संदेश भेजें',
    officeAddress: 'कार्यालय का पता',
    helpDeskNumber: 'हेल्प डेस्क नंबर',
    mailUs: 'मेल करें',
    openingHours: 'खुलने का समय',
    hoursText: 'सुबह 5:00 बजे - रात 9:00 बजे',
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फोन',
    message: 'संदेश',
    submit: 'जमा करें',
    sending: 'भेजा जा रहा है...',
    thankYou: 'धन्यवाद! आपका संदेश जमा कर दिया गया है।',
    amount: 'राशि',
    donateDesc2: 'आपका छोटा सा योगदान भी बड़ी सेवा का हिस्सा बन सकता है।',
    receipt: 'यदि पावती चाहिए तो कृपया इस फॉर्म को भरकर जमा करें।',
    uploadScreenshot: 'कृपया किए गए दान का स्क्रीनशॉट अपलोड करें।',
    payNow: 'दान अनुरोध जमा करें',
    paymentSuccess: 'धन्यवाद! आपका दान अनुरोध जमा कर दिया गया है।',
    paymentFailed: 'जमा करने में विफल रहा। कृपया पुनः प्रयास करें।',
    quickLinks: 'त्वरित लिंक',
    contactDetails: 'संपर्क विवरण',
    adminLogin: 'एडमिन लॉगिन',
    copyright: '© 2026 राजदाह धाम | तपस्वी मौनी बाबा राजदाह धाम समिति | सर्वाधिकार सुरक्षित',
    backToTop: 'शीर्ष पर जाएं',
    loading: 'लोड हो रहा है...',
    planYourVisit: 'अपना दौरा योजनाबद्ध करें',
    knowMore: 'और जानें',
    exploreNature: 'नेचर पार्क देखें',
    viewGallery: 'गैलरी देखें',
    donateNowShort: 'अभी दान करें',
  },
};

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const hasSavedPreference = useRef(false);
  const hasUserPreference = useRef(false);
  const [lang, setCurrentLanguage] = useState(() => {
    try {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      if (savedLanguage === 'en' || savedLanguage === 'hi') {
        hasSavedPreference.current = true;
        hasUserPreference.current = true;
        return savedLanguage;
      }
    } catch (error) {
      console.warn('Unable to read the saved language preference.', error);
    }
    return 'en';
  });

  useEffect(() => {
    if (hasSavedPreference.current) return undefined;

    let active = true;
    const controller = new AbortController();
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Location lookup failed with status ${response.status}.`);
        }
        return response.json();
      })
      .then((location) => {
        if (active && !hasUserPreference.current) {
          setCurrentLanguage(languageForLocation(location));
        }
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') {
          console.warn('Unable to determine visitor location; keeping English default.', error);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const setLang = (nextLanguage) => {
    const language = typeof nextLanguage === 'function' ? nextLanguage(lang) : nextLanguage;
    if (language !== 'en' && language !== 'hi') return;

    hasUserPreference.current = true;
    setCurrentLanguage(language);
    try {
      window.localStorage.setItem(LANGUAGE_PREFERENCE_KEY, language);
    } catch (error) {
      console.warn('Unable to save the language preference.', error);
    }
  };

  const t = translations[lang] || translations.en;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
