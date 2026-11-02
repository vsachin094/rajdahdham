import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed for ${url} (${response.status})`);
  return response.json();
}

export default function Gallery() {
  const { lang } = useLanguage();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedEvent = query.get('event');
  const requestedCategory = query.get('category');
  const [images, setImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [eventRecords, setEventRecords] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [mediaType, setMediaType] = useState('photos');
  const [category, setCategory] = useState(selectedEvent ? 'events' : requestedCategory || 'all');
  const [error, setError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    Promise.all([getJson('/api/gallery'), getJson('/api/park'), getJson('/api/events')])
      .then(([gallery, park, events]) => {
        const eventImages = events.flatMap((event) => event.photos.map((src) => ({
          src,
          alt: `${event.albumTitle[lang]} ${lang === 'en' ? 'photo' : 'तस्वीर'}`,
          categories: ['events'],
          eventId: event.id,
        })));
        const parkImages = park.images.map((src) => ({
          src,
          alt: lang === 'en' ? 'Rajdah Dham Nature Park' : 'राजदाह धाम नेचर पार्क',
          categories: ['park'],
        }));
        const generalImages = gallery.images.map((src, index) => ({
          src,
          alt: lang === 'en' ? `Rajdah Dham photo ${index + 1}` : `राजदाह धाम तस्वीर ${index + 1}`,
          categories: [],
        }));
        setEventRecords(events);
        const unique = new Map();
        [...eventImages, ...parkImages, ...generalImages].forEach((image) => {
          if (!unique.has(image.src)) unique.set(image.src, image);
          else {
            const existing = unique.get(image.src);
            existing.categories = [...new Set([...existing.categories, ...image.categories])];
          }
        });
        setImages([...unique.values()]);
        setImagesLoaded(true);
      })
      .catch((loadError) => {
        console.error(loadError);
        setError(true);
        setImagesLoaded(true);
      });
  }, [lang]);

  useEffect(() => {
    getJson('/api/videos')
      .then((loadedVideos) => {
        setVideos(loadedVideos);
        setVideosLoaded(true);
      })
      .catch((loadError) => {
        console.error(loadError);
        setVideoError(true);
        setVideosLoaded(true);
      });
  }, []);

  useEffect(() => {
    setCategory(selectedEvent ? 'events' : requestedCategory || 'all');
    setMediaType('photos');
  }, [selectedEvent, requestedCategory]);

  useEffect(() => {
    if (!selectedImage) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const filters = [
    { key: 'all', label: lang === 'en' ? 'All photos' : 'सभी तस्वीरें' },
    { key: 'park', label: lang === 'en' ? 'Nature park' : 'नेचर पार्क' },
    { key: 'events', label: lang === 'en' ? 'Event albums' : 'कार्यक्रम एलबम' },
  ];
  const visibleImages = useMemo(() => images.filter((image) => {
    if (selectedEvent) return image.eventId === selectedEvent;
    if (category === 'all') return true;
    return image.categories.includes(category);
  }), [category, images, selectedEvent]);
  const visibleVideos = useMemo(
    () => selectedEvent ? videos.filter((video) => video.eventId === selectedEvent) : videos,
    [selectedEvent, videos],
  );
  const selectedEventRecord = eventRecords.find((event) => event.id === selectedEvent);

  return (
    <main className="page-main">
      <section className="page-heading">
        <div className="section-eyebrow"><ImageIcon size={16} /> {lang === 'en' ? 'Photos & videos' : 'तस्वीरें और वीडियो'}</div>
        <h1>{selectedEventRecord?.title[lang] || (lang === 'en' ? 'Memories of Rajdah Dham.' : 'राजदाह धाम की यादें।')}</h1>
        <p>{selectedEventRecord?.details?.[lang] || selectedEventRecord?.summary?.[lang] || (lang === 'en'
          ? 'Browse local photo albums or watch videos shared by Rajdah Dham and its visitors.'
          : 'स्थानीय फोटो एलबम देखें या राजदाह धाम और आगंतुकों द्वारा साझा किए गए वीडियो देखें।')}</p>
      </section>

      <section className="content-section gallery-page-section">
        <div className="gallery-media-tabs" role="group" aria-label={lang === 'en' ? 'Choose photos or videos' : 'तस्वीरें या वीडियो चुनें'}>
          <button
            type="button"
            onClick={() => {
              setMediaType('photos');
              setActiveVideo(null);
            }}
            className={`gallery-media-tab${mediaType === 'photos' ? ' gallery-media-tab-active' : ''}`}
            aria-pressed={mediaType === 'photos'}
          >
            {lang === 'en' ? 'Photos' : 'तस्वीरें'}<span>{selectedEvent ? visibleImages.length : images.length}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType('videos');
              setActiveVideo(null);
            }}
            className={`gallery-media-tab${mediaType === 'videos' ? ' gallery-media-tab-active' : ''}`}
            aria-pressed={mediaType === 'videos'}
          >
            {lang === 'en' ? 'Videos' : 'वीडियो'}<span>{selectedEvent ? visibleVideos.length : videos.length}</span>
          </button>
        </div>

        {mediaType === 'photos' ? (
          <>
            {!selectedEvent && (
              <div className="gallery-toolbar" aria-label={lang === 'en' ? 'Filter photos' : 'तस्वीरें छांटें'}>
                {filters.map((filter) => (
                  <button
                    type="button"
                    key={filter.key}
                    onClick={() => setCategory(filter.key)}
                    className={`gallery-filter${category === filter.key ? ' gallery-filter-active' : ''}`}
                    aria-pressed={category === filter.key}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}

            {error ? (
              <div className="notice-card" role="alert">
                {lang === 'en' ? 'Photos could not be loaded. Please try again later.' : 'तस्वीरें लोड नहीं हो सकीं। कृपया बाद में पुनः प्रयास करें।'}
              </div>
            ) : !imagesLoaded ? (
              <p className="loading-copy">{lang === 'en' ? 'Loading photos…' : 'तस्वीरें लोड हो रही हैं…'}</p>
            ) : visibleImages.length === 0 ? (
              <div className="empty-state">
                <ImageIcon size={30} />
                <h2>{lang === 'en'
                  ? (selectedEvent ? 'No photos for this event yet' : 'No event albums yet')
                  : (selectedEvent ? 'इस कार्यक्रम की तस्वीरें अभी उपलब्ध नहीं हैं' : 'अभी कोई कार्यक्रम एलबम नहीं है')}</h2>
                <p>{lang === 'en'
                  ? (selectedEvent ? 'Photos will appear here when they are added.' : 'Photos will appear here as event albums are added.')
                  : (selectedEvent ? 'तस्वीरें जोड़े जाने पर यहां दिखाई देंगी।' : 'कार्यक्रमों के एलबम जुड़ने पर तस्वीरें यहां दिखाई देंगी।')}</p>
              </div>
            ) : (
              <div className="gallery-photo-grid">
                {visibleImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image.src}-${index}`}
                    className="gallery-photo"
                    onClick={() => setSelectedImage(image)}
                    aria-label={lang === 'en' ? `Open ${image.alt}` : `${image.alt} खोलें`}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : videoError ? (
          <div className="notice-card" role="alert">
            {lang === 'en' ? 'Videos could not be loaded. Please try again later.' : 'वीडियो लोड नहीं हो सके। कृपया बाद में पुनः प्रयास करें।'}
          </div>
        ) : !videosLoaded ? (
          <p className="loading-copy">{lang === 'en' ? 'Loading videos…' : 'वीडियो लोड हो रहे हैं…'}</p>
        ) : visibleVideos.length === 0 ? (
          <div className="empty-state">
            <h2>{lang === 'en'
              ? (selectedEvent ? 'No videos for this event yet' : 'No videos available yet')
              : (selectedEvent ? 'इस कार्यक्रम के वीडियो अभी उपलब्ध नहीं हैं' : 'अभी कोई वीडियो उपलब्ध नहीं है')}</h2>
            <p>{lang === 'en'
              ? 'Videos will appear here when they are added.'
              : 'वीडियो जोड़े जाने पर यहां दिखाई देंगे।'}</p>
          </div>
        ) : (
          <>
            <p className="gallery-video-note">
              {lang === 'en'
                ? 'Videos are hosted by YouTube. Playback connects to YouTube only when you choose to play one.'
                : 'वीडियो YouTube पर होस्ट किए गए हैं। चलाने पर ही YouTube से कनेक्शन होगा।'}
            </p>
            <div className="gallery-video-grid">
              {visibleVideos.map((video) => (
                <article className="gallery-video-card" key={video.id}>
                  <div className="gallery-video-frame">
                    {activeVideo === video.id ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1`}
                        title={video.title[lang]}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        className="gallery-video-play"
                        onClick={() => setActiveVideo(video.id)}
                        aria-label={lang === 'en' ? `Play ${video.title[lang]}` : `${video.title[lang]} चलाएं`}
                      >
                        <img
                          src={`https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="gallery-video-play-icon" aria-hidden="true">▶</span>
                      </button>
                    )}
                  </div>
                  <div className="gallery-video-copy">
                    <h2>{video.title[lang]}</h2>
                    <a className="gallery-video-watch-link" href={video.youtubeUrl} target="_blank" rel="noreferrer">
                      {lang === 'en' ? 'Watch on YouTube' : 'YouTube पर देखें'}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {selectedImage && (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={selectedImage.alt} onClick={() => setSelectedImage(null)}>
          <button type="button" className="lightbox-close" onClick={() => setSelectedImage(null)} aria-label={lang === 'en' ? 'Close photo' : 'तस्वीर बंद करें'}>
            <X size={24} />
          </button>
          <img src={selectedImage.src} alt={selectedImage.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
