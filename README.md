# Rajdah Dham

A bilingual website for Rajdah Dham, Giridih, Jharkhand. The frontend is built with React and the backend API with Python FastAPI.

## Design Philosophy

**Sacred Temple Color Palette:**
- Backgrounds: Sacred Ivory (#FFFDF9), Warm Sandalwood Cream (#FFF8EC)
- Text: Deep Warm Temple Brown (#2C1810)
- Accents: Antique Gold (#C5A059), Holy Saffron (#FF7700)

**Design principles:** No dark mode, no black, no gloomy colors. Pure, warm, divine aesthetic with glassmorphism, floating elements, and smooth animations.

## Project Structure

```
rajdahdham/
  Dockerfile            - Multi-stage production image for the site and API
  render.yaml           - Render Blueprint for a single web service
  backend/
    app.py              - FastAPI REST API
    requirements.txt    - Python dependencies
    content/
      events.yaml       - Upcoming and past events with optional descriptions and image folders
      members.yaml      - Committee members and local portrait paths
      videos.yaml       - YouTube links and bilingual video titles
    test_events.py      - Backend content and event tests
  frontend/
    package.json        - React dependencies + Tailwind CSS
    public/images/      - Local copies of all site photos and logo
      event_images/     - Event albums, each in its own event-id folder
      members/          - Committee portraits grouped by officers, guardians and committee
    tailwind.config.js  - Tailwind config with temple color palette
    postcss.config.js   - PostCSS config
    src/
      index.js          - Entry point
      index.css         - Tailwind directives + base styles
      App.js            - Main app with Router + LanguageProvider
      context/
        LanguageContext.js  - EN/HI bilingual translations + context
      components/
        Header.jsx          - Responsive site navigation
        Footer.js           - Site links and contact information
        Hero.jsx            - Local-photo slider and animated hero
        AboutPreview.jsx    - About section with highlights
      pages/
        Home.jsx            - Homepage, updates, photo preview and event preview
        About.js            - About, location, heritage and travel details
        Members.js          - Committee officers, guardians and members
        Events.js           - Event updates and album links
        Gallery.js          - Local photos and accessible lightbox
        Park.js             - Dedicated Nature Park page
        Contact.js          - Directions and visitor contact details
        Donate.js           - Donation information and bank details
```

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 5001
```

## Frontend Setup

```bash
cd frontend
npm install
npm start                  # Runs on http://localhost:3000
```

## Deploying to Render

The root `render.yaml` deploys the React site and FastAPI backend together as
one Docker web service. FastAPI serves the production React build, API requests,
images, and client-side routes from the same origin; no separate frontend URL
or production CORS configuration is needed.

1. In Render, create a **Blueprint** and select this GitHub repository.
2. Keep `render.yaml` as the Blueprint path and apply the `rajdahdham` web service.
3. Render builds the root `Dockerfile` and uses its managed `PORT` environment
   variable. The `/api/health` endpoint is used for health checks.

There are no required deployment secrets. Local `.env` files are excluded from
both Git and the Docker build context. The default Render free plan may spin
down after inactivity.

On a first visit without a saved language preference, the site uses ipapi.co's
IP-based location lookup to select Hindi for visitors identified in Jharkhand,
India. The lookup is performed by the visitor's browser; a chosen language is
saved locally and takes precedence on future visits. If lookup is unavailable,
the site defaults to English.

To build and run the same image locally:

```bash
docker build -t rajdahdham .
docker run --rm -p 8000:8000 rajdahdham
```

Open http://localhost:8000.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/about` | GET | Temple about content (EN/HI) |
| `/api/members` | GET | Committee officers, guardians, members |
| `/api/gallery` | GET | Gallery image URLs |
| `/api/park` | GET | Nature Park info + images |
| `/api/contact` | GET | Contact details |
| `/api/donate/info` | GET | Bank account details for donations |
| `/api/slider` | GET | Hero slider image URLs |
| `/api/events` | GET | Event updates and their local photo albums |
| `/api/videos` | GET | YouTube links and bilingual video titles |
| `/api/contact/submit` | POST | Contact form (returns 501 until delivery is configured) |

## Features

- **Bilingual:** English / हिन्दी toggle
- **Responsive:** Mobile-first design
- **Visitor-focused navigation:** Home, About, Nature Park, Members, Events & Updates, Gallery, Contact; Donate is always available as a primary action
- **Devotional home page:** Centres Rajdah Dham as a place of worship, explains its shrines and local traditions, and keeps park and travel information secondary
- **Animated hero:** Locally hosted temple photography with an Om-inspired, reduced-motion-aware mandala animation
- **Backend-managed content:** FastAPI provides the content APIs; the single `backend/content/events.yaml` registry powers Home, Events and Gallery. Events are grouped by date, with upcoming events first and past events newest-first.
- **Photos and videos:** Gallery keeps locally stored photo albums separate from YouTube videos; video embeds load only after a visitor chooses to play one
- **Visitor contact:** Contact Us includes an embedded Google Map and directions link; a WhatsApp shortcut is available throughout the site
- **Location & heritage details:** About covers the Dham's history, shrines, local religious traditions, and Barakar river landscape. Contact includes directions and approximate travel distances. Confirm routes, transport and timings locally before visiting.
- **Local assets:** Site images and logo are stored in `frontend/public/images`, and system fonts are used. The website’s photos and page content are served from this project.
- **Existing logo** preserved
- **Local configuration:** `.env` files and local dependencies/build output are excluded from Git. Do not commit credentials or private configuration.

### Adding an event update

Add every event—upcoming or past—to `backend/content/events.yaml`. The date automatically determines which group it appears under. Use an ISO date (`YYYY-MM-DD`), a title, optional details, and optionally an image directory inside `frontend/public/images/event_images/`. Add images directly to that event's folder. If it contains images, `banner.*` or `cover.*` is used as the event image when present; otherwise one of the folder images is selected at random. All supported images in the folder are added to its gallery album automatically, including its banner. If the folder is missing or empty and no explicit banner is configured, the event appears without an image and the gallery shows an empty state instead of a broken image. An optional `banner` can point to an existing local image under `frontend/public/images/`; it is included in that event's gallery too.

Each YAML entry uses this shape:

```yaml
- id: maha-shivratri-2027
  date: "2027-02-15"
  title: Maha Shivratri
  title_hi: महाशिवरात्रि
  details: >-
    Join the evening puja and bhajan at Rajdah Dham.
  details_hi: >-
    राजदाह धाम में संध्या पूजा और भजन में सम्मिलित हों।
  image_dir: maha-shivratri-2027
```

`id` is optional for English titles and otherwise is generated from the title; provide an explicit lowercase, hyphenated id when titles may change or are written in Hindi. `title_hi`, `summary`, `summary_hi`, `details`, `details_hi`, `location`, `location_hi`, `banner` and `image_dir` are optional. If Hindi text is omitted, the English title/details are used. `image_dir` is a folder name relative to `frontend/public/images/event_images/`. Event cards link to that event’s photos and associated videos only. As the date passes, the event automatically moves from Upcoming Events to Past Events; there is no separate archive file to maintain.

### Updating committee members

Edit `backend/content/members.yaml` to change a person's name, `tag` (committee role), or image path. Keep portrait files under `frontend/public/images/members/`, grouped into `officers/`, `guardians/`, or `committee/`. Use lowercase, readable, hyphenated filenames and update the matching local `/images/members/...` path in YAML:

```yaml
officers:
  - name: Example Name
    tag: President
    image: /images/members/officers/example-name.jpg
```

The Members page reads these YAML entries through `/api/members`; changing the file or replacing a local portrait updates the site without editing React components.

### Adding a video

Add a new entry to `backend/content/videos.yaml`. Include the exact matching event `id` from `events.yaml` as `event_id` so the video appears on that event's media page; videos remain available in the general Gallery. Omit `event_id` for videos that are not tied to an event. `/api/videos` derives the video ID for the Gallery:

```yaml
- youtube_url: https://www.youtube.com/watch?v=abc123
  title:
    en: Event video
    hi: कार्यक्रम का वीडियो
  event_id: maha-shivratri-2027
```

## Running Locally

1. Start backend: `cd backend && uvicorn app:app --reload --host 0.0.0.0 --port 5001`
2. Start frontend: `cd frontend && npm start`
3. Open: http://localhost:3000

## Pages

- **Home:** Animated Om-inspired hero, visitor information, temple introduction, updates, photos and donation action
- **About:** Temple history, shrines, devotional beliefs and the Barakar river landscape
- **Our Members:** Committee officers, guardians and members
- **Nature Park:** A dedicated page with park details, milestones and local park photos
- **Events & Updates:** Local event records with linked photo albums
- **Gallery:** Temple, park and event photos, YouTube videos, event-specific media views and an accessible lightbox
- **Contact:** Directions, approximate travel distances, temple hours, phone and email
- **Donate:** Bank transfer details and committee contact information
