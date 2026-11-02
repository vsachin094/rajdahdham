import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppLink from './components/WhatsAppLink';
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Park from './pages/Park';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Donate from './pages/Donate';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
        return;
      }

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

function App() {
  const [visitorCount, setVisitorCount] = React.useState(null);
  const visitRequestStarted = React.useRef(false);

  React.useEffect(() => {
    if (visitRequestStarted.current) return;
    visitRequestStarted.current = true;

    let alreadyCounted = false;
    try {
      alreadyCounted = window.sessionStorage.getItem('rajdahdham-visit-counted') === 'true';
      if (!alreadyCounted) {
        window.sessionStorage.setItem('rajdahdham-visit-counted', 'true');
      }
    } catch (error) {
      console.error('Could not access session storage for the visitor counter.', error);
    }

    fetch('/api/visitor-count', { method: alreadyCounted ? 'GET' : 'POST' })
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load visitor count (${response.status})`);
        return response.json();
      })
      .then(({ count }) => {
        if (!Number.isInteger(count) || count < 0) {
          throw new Error('The visitor counter returned an invalid count.');
        }
        setVisitorCount(count);
      })
      .catch((error) => {
        console.error(error);
        if (!alreadyCounted) {
          try {
            window.sessionStorage.removeItem('rajdahdham-visit-counted');
          } catch (storageError) {
            console.error('Could not clear the visitor counter session marker.', storageError);
          }
        }
      });
  }, []);

  return (
    <LanguageProvider>
      <Router future={{ v7_startTransition: true }}>
        <div className="app">
          <ScrollToTop />
          <Header />
          <Routes future={{ v7_relativeSplatPath: true }}>
            <Route path="/" element={<Home visitorCount={visitorCount} />} />
            <Route path="/about" element={<About />} />
            <Route path="/members" element={<Members />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/park" element={<Park />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <WhatsAppLink />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
