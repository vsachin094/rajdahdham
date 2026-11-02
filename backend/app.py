import random
import re
from datetime import date
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import yaml

load_dotenv()

app = FastAPI(title="Rajdah Dham API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

EVENTS_PATH = Path(__file__).parent / "content" / "events.yaml"
EVENT_IMAGE_ROOT = Path(__file__).parent.parent / "frontend" / "public" / "images" / "event_images"
PUBLIC_IMAGE_ROOT = Path(__file__).parent.parent / "frontend" / "public" / "images"
VIDEOS_PATH = Path(__file__).parent / "content" / "videos.yaml"
MEMBERS_PATH = Path(__file__).parent / "content" / "members.yaml"
EVENT_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


class ContactSubmission(BaseModel):
    name: str = Field(min_length=1)
    email: str = ""
    phone: str = ""
    message: str = Field(min_length=1)

# ---------- LOCAL STATIC CONTENT ----------

ABOUT_CONTENT = {
    "title_en": "Rajdah Dham",
    "title_hi": "राजदह धाम",
    "subtitle_en": "Tapaswi Mouni Baba Rajdah Dham Samiti",
    "subtitle_hi": "तपस्वी मौनी बाबा राजदाह धाम समिति",
    "intro_en": "Rajdah Dham is a Hindu place of worship on the banks of the Barakar River in Sabalpur, Suriya block, Giridih district, Jharkhand. Devotees worship at shrines dedicated to Lord Shiva, Maa Parvati, Nandi, Surya, Jagannath Swami and Hanuman.",
    "intro_hi": "राजदाह धाम झारखंड के गिरिडीह जिले के सरिया प्रखंड के सबलपुर में बराकर नदी के तट पर स्थित एक हिंदू पूजास्थल है। यहां भगवान शिव, मां पार्वती, नंदी, सूर्य, जगन्नाथ स्वामी और हनुमान के मंदिरों में श्रद्धालु पूजा-अर्चना करते हैं।",
    "address_en": "Rajdah Dham, Sabalpur, Suriya, Giridih, Jharkhand 825320",
    "address_hi": "राजदाह धाम, सबलपुर, सरिया, गिरिडीह, झारखंड 825320",
    "natural_beauty_en": "The Dham lies among dense woodland and large rocks along the Barakar River. Here the north-flowing river forms the natural setting around the shrines and is part of the place's sacred landscape.",
    "natural_beauty_hi": "धाम घने वन और बराकर नदी के किनारे की विशाल चट्टानों के बीच स्थित है। यहां उत्तरवाहिनी नदी मंदिरों के प्राकृतिक परिवेश और पवित्र भू-दृश्य का हिस्सा है।",
    "devotional_belief_en": "The temple complex brings together shrines dedicated to Lord Shiva, Maa Parvati, Nandi, Surya, Jagannath Swami and Hanuman, along with other deities. Daily worship and remembrance of Sant Mouni Baba are central to the Dham's devotional life. Local accounts also describe gatherings and fairs on occasions such as Shravan Purnima and Nirjala Ekadashi; check locally for current event arrangements.",
    "devotional_belief_hi": "धाम परिसर में भगवान शिव, मां पार्वती, नंदी, सूर्य, जगन्नाथ स्वामी और हनुमान सहित अनेक देवी-देवताओं के मंदिर हैं। नित्य पूजा-अर्चना और संत मौनी बाबा का स्मरण यहां की भक्ति परंपरा का हिस्सा हैं। स्थानीय विवरणों में श्रावण पूर्णिमा और निर्जला एकादशी जैसे अवसरों पर मेले और धार्मिक आयोजन का उल्लेख मिलता है; वर्तमान आयोजन की जानकारी स्थानीय रूप से लें।",
    "religious_significance_en": "Devotees regard this north-flowing stretch of the Barakar as sacred. Local belief holds that bathing here brings spiritual merit comparable to bathing in the Ganga; this is a matter of religious faith.",
    "religious_significance_hi": "श्रद्धालु बराकर नदी के इस उत्तरवाहिनी भाग को पवित्र मानते हैं। स्थानीय धार्मिक मान्यता है कि यहां स्नान करने से गंगा स्नान के समान पुण्य मिलता है।",
    "history_en": "Local accounts trace the beginning of Rajdah Dham to Vikram Samvat 1995 (approximately 1938–39 CE). They remember Deep Narayan Das of nearby Bagodih village, known as Sant Mouni Baba, as the ascetic who began his penance here. With support from local residents, a Shiva temple was built and the Shivalinga installed. The tradition also remembers ascetics including Gariyavan Das, Arun Das and Murari Das gathering here for spiritual practice around a dhuni made with dry peepal branches. A local Mahabharata tradition connects the area with Lord Shiva granting the Pashupatastra to Arjuna. These are community and religious traditions, not independently verified historical records.",
    "history_hi": "स्थानीय विवरणों के अनुसार राजदाह धाम की शुरुआत विक्रम संवत 1995 (लगभग 1938–39 ई.) में हुई। पास के बागोडीह गांव के दीप नारायण दास, जिन्हें संत मौनी बाबा के नाम से स्मरण किया जाता है, ने यहां तपस्या की। स्थानीय लोगों के सहयोग से शिव मंदिर बना और शिवलिंग की स्थापना हुई। परंपरा में गरियावन दास, अरुण दास और मुरारी दास सहित अन्य संतों के यहां धूनी रमाकर साधना करने का भी उल्लेख मिलता है। स्थानीय महाभारत परंपरा इस क्षेत्र को भगवान शिव द्वारा अर्जुन को पाशुपतास्त्र देने की कथा से जोड़ती है। ये समुदाय में प्रचलित धार्मिक परंपराएं हैं, स्वतंत्र रूप से प्रमाणित ऐतिहासिक अभिलेख नहीं।",
    "attraction_en": "Rajdah Dham is a place of worship set among woodland, rocks and the Barakar River.",
    "attraction_hi": "राजदाह धाम वन, चट्टानों और बराकर नदी के बीच स्थित एक पूजास्थल है।",
    "how_to_reach_en": "By road, travel from Suriya on the Suriya–Rajdhanwar road and turn at Rajdah Mod. If arriving by train or air, check the approximate road distances below and open Google Maps for live directions.",
    "how_to_reach_hi": "सड़क मार्ग से सरिया से सरिया–राजधनवार मार्ग पर राजदाह मोड़ तक आएं। रेल या हवाई मार्ग से आने पर नीचे दी गई अनुमानित सड़क दूरियां देखें और लाइव रास्ते के लिए Google Maps खोलें।",
    "town_distance_en": "About 6 km by road from Suriya town.",
    "town_distance_hi": "सरिया नगर से सड़क मार्ग से लगभग 6 किमी।",
    "nearest_station_en": "Hazaribag Road (HZD) railway station · about 6 km by road.",
    "nearest_station_hi": "हजारीबाग रोड (HZD) रेलवे स्टेशन · सड़क मार्ग से लगभग 6 किमी।",
    "road_route_en": "Suriya–Rajdhanwar main road → Rajdah Mod.",
    "road_route_hi": "सरिया–राजधनवार मुख्य मार्ग → राजदाह मोड़।",
    "railway_stations": [
        {
            "name_en": "Hazaribag Road (HZD)",
            "name_hi": "हजारीबाग रोड (HZD)",
            "distance_en": "About 6 km by road",
            "distance_hi": "सड़क मार्ग से लगभग 6 किमी",
            "destination": "Hazaribag Road, Station Road, Suriya, Jharkhand 825320",
        },
        {
            "name_en": "Parasnath (PNME)",
            "name_hi": "पारसनाथ (PNME)",
            "distance_en": "About 44 km by road",
            "distance_hi": "सड़क मार्ग से लगभग 44 किमी",
            "destination": "Parasnath Railway Station, Isri Bazar, Isri, Jharkhand 825167",
        },
        {
            "name_en": "Koderma Junction (KQR)",
            "name_hi": "कोडरमा जंक्शन (KQR)",
            "distance_en": "About 60 km by road",
            "distance_hi": "सड़क मार्ग से लगभग 60 किमी",
            "destination": "Koderma Junction, Jhumri Telaiya, Jharkhand 825409",
        },
    ],
    "airports": [
        {
            "name_en": "Deoghar Airport (DGH)",
            "name_hi": "देवघर हवाई अड्डा (DGH)",
            "distance_en": "About 132 km by road",
            "distance_hi": "सड़क मार्ग से लगभग 132 किमी",
            "destination": "Deoghar Airport, Deoghar, Jharkhand 814114",
        },
        {
            "name_en": "Birsa Munda Airport, Ranchi (IXR)",
            "name_hi": "बिरसा मुंडा हवाई अड्डा, रांची (IXR)",
            "distance_en": "About 166 km by road",
            "distance_hi": "सड़क मार्ग से लगभग 166 किमी",
            "destination": "Birsa Munda Airport, Hinoo, Ranchi, Jharkhand 834002",
        },
    ],
}

PARK_CONTENT = {
    "title_en": "Rajdah Dham Nature Park",
    "title_hi": "राजदाह धाम नेचर पार्क",
    "description_en": "Set among Rajdah Dham's natural surroundings, the Nature Park offers lawns, a pond, swings and shaded places for visitors and families to relax.",
    "description_hi": "राजदाह धाम के प्राकृतिक परिवेश में स्थित नेचर पार्क में आगंतुकों और परिवारों के लिए लॉन, तालाब, झूले और आराम करने के छायादार स्थान हैं।",
    "timing_en": "9:00 AM–6:00 PM",
    "timing_hi": "सुबह 9 बजे–शाम 6 बजे",
    "foundation_en": "The foundation stone of the park was laid on 9 November 2022 (Wednesday) by then MLA Vinod Kumar Singh.",
    "foundation_hi": "पार्क की आधारशिला 9 नवम्बर 2022 (बुधवार) को रखी गई। ततकालीन विधायक विनोद कुमार सिंह ने इसकी आधारशिला रखी।",
    "amount_en": "An amount of Rs 2 crore 83 lakh was allocated by the Jharkhand Government for this scheme.",
    "amount_hi": "इस योजना के लिए 2 करोड़ 83 लाख राशि झारखंड सरकार के द्वारा आवंटित की गई थी।",
    "target_en": "Construction of attractive concrete gate, guard room, electricity-water facility for passengers, grass and flowers, ten concrete benches, one bamboo hut, three gazebo roofs, six umbrella-type sitting sheds, paver block construction in park premises, two platforms, 550 feet drain construction, seven extinct species statues supply, fitting and fixing, two deep boring solar pump sets with overhead water storage and water supply, water supply through pipeline, drinking water points at various places, lawn and administrative building construction.",
    "target_hi": "प्राकृतिक सौंदर्यता के साथ एक आकर्षक कंक्रीट गेट का निर्माण, गार्ड रूम, बिजली-पानी की सुविधा, घास तथा फूल-पत्ती लगाई जाएगी। दस कंक्रीट बेंच, एक बांसनुमा झोपड़ी, तीन गजebo छत, छह अंब्रेला टाईप बैठनेवाला शेड।",
    "duration_en": "The park was ready for passengers in about 2 years.",
    "duration_hi": "लगभग 2 वर्षों में यह पार्क यात्रियों के तैयार था।",
    "inauguration_en": "Inauguration was done on 3 February 2024 in the presence of then MLA Vinod Singh and then MP Annapurna Devi.",
    "inauguration_hi": "उद्घाटन 3 फरवरी 2024 को तत्कालीन विधायक विनोद सिंह और तत्कालीन सांसद अन्नपूर्णा देवी की उपस्थिति में किया गया।",
    "foundation_date": "2022-11-09",
    "inauguration_date": "2024-02-03",
    "investment_en": "₹2.83 crore",
    "investment_hi": "₹2.83 करोड़",
    "amenities_en": [
        "Landscaped lawns and flower beds",
        "A pond and swings",
        "Gazebos, shaded seating and benches",
        "Paved paths and drinking-water points",
    ],
    "amenities_hi": [
        "सजे हुए लॉन और फूलों की क्यारियां",
        "तालाब और झूले",
        "गज़ेबो, छायादार बैठने की जगह और बेंच",
        "पक्के रास्ते और पेयजल की सुविधा",
    ],
}

DONATE_CONTENT = {
    "title_en": "Donate Now",
    "title_hi": "अभी दान करें",
    "heading_en": "Your contribution to Rajdah Dham - a pious work",
    "heading_hi": "राजदह धाम में आपका योगदान - एक पुण्य कार्य",
    "description_en": "Rajdah Dham, located in Giridih district of Jharkhand, is a holy place where devotees get spiritual peace and divine blessings. Your cooperation is extremely important to keep the development, service work and religious programs of this holy Dham going continuously.",
    "description_hi": "राजदह धाम, झारखंड के गिरिडीह जिले में स्थित एक पवित्र स्थल है, जहां श्रद्धालु आध्यात्मिक शांति और दिव्य आशीर्वाद प्राप्त करते हैं।",
    "bank_title_en": "Bank Account Details for Payment",
    "bank_title_hi": "भुगतान हेतु हमारे बैंक खाते का विवरण",
    "account_number": "110147695315",
    "ifsc": "CNRB0017477",
    "bank_name": "Canara Bank",
    "bank_name_hi": "केनरा बैंक",
}

CONTACT_INFO = {
    "address": "Rajdah Dham, Mandir, Sabalpur, Suriya, Giridih (825320), Jharkhand",
    "help_desk": "+91-99395 68818",
    "email": "rajdahdhamofficial@gmail.com",
    "opening_hours": "24 Hours",
    "numbers": {
        "अध्यक्ष": "+91-79037 47580",
        "सचिव": "+91-9199991827",
        "कोषाध्यक्ष": "+91-9430777739",
        "उपाध्यक्ष": "+91-99393 03755",
        "उप सचिव": "+91-90823 58988",
        "मंदिर प्रबंधक": "+91-99395 68818",
        "उप मंदिर प्रबंधक": "+91-70914 71242",
    },
}

GALLERY_IMAGES = [
    "/images/gallery/devotee-on-stage-01.jpg",
    "/images/gallery/devotee-on-stage-02.jpg",
    "/images/gallery/community-event-group.jpg",
    "/images/gallery/community-event-stage.jpg",
    "/images/gallery/devotees-holding-mouni-baba-portrait.jpg",
    "/images/gallery/community-newspaper-01.jpg",
    "/images/gallery/raj-dah-ambulance.jpg",
    "/images/gallery/community-newspaper-02.jpg",
    "/images/gallery/committee-visit.jpg",
    "/images/gallery/devotees-at-shrine.jpg",
]

PARK_IMAGES = [
    "/images/event_images/nature-park-inauguration/park-river-at-sunset.jpg",
    "/images/event_images/nature-park-inauguration/park-entry-gate.jpg",
    "/images/event_images/nature-park-inauguration/park-peacock-statue.jpg",
    "/images/event_images/nature-park-inauguration/park-sign.jpg",
    "/images/event_images/nature-park-inauguration/park-evening-entrance.jpg",
    "/images/event_images/nature-park-inauguration/park-garden-statue.jpg",
    "/images/event_images/nature-park-inauguration/park-swings.jpg",
    "/images/event_images/nature-park-inauguration/park-fountain-statues.jpg",
]

SLIDER_IMAGES = [
    "/images/slider/rajdah-dham-temple-entrance.jpg",
    "/images/slider/community-gathering.jpg",
    "/images/slider/mouni-baba-memorial-shrine.jpg",
]

def get_youtube_id(url):
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname or ""
    allowed_hosts = {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"}
    if parsed_url.scheme != "https" or hostname not in allowed_hosts:
        raise HTTPException(status_code=500, detail="Invalid YouTube URL in videos.yaml.")

    if hostname in {"youtu.be", "www.youtu.be"}:
        video_id = parsed_url.path.strip("/").split("/")[0]
    else:
        video_id = parse_qs(parsed_url.query).get("v", [None])[0]
        if not video_id:
            path_parts = parsed_url.path.strip("/").split("/")
            video_id = path_parts[1] if len(path_parts) == 2 and path_parts[0] in {"embed", "live", "shorts"} else None

    if not video_id or not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
        raise HTTPException(status_code=500, detail="Invalid YouTube URL in videos.yaml.")
    return video_id


# ---------- ROUTES ----------

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Rajdah Dham API running"}


@app.get("/api/about")
def get_about():
    return ABOUT_CONTENT


@app.get("/api/park")
def get_park():
    return {
        **PARK_CONTENT,
        "images": PARK_IMAGES,
    }


@app.get("/api/donate/info")
def get_donate_info():
    return DONATE_CONTENT


@app.get("/api/contact")
def get_contact():
    return CONTACT_INFO


@app.get("/api/members")
def get_members():
    members = yaml.safe_load(MEMBERS_PATH.read_text(encoding="utf-8"))
    if not isinstance(members, dict):
        raise ValueError("Members YAML must contain category lists.")

    result = {}
    image_root = PUBLIC_IMAGE_ROOT.resolve()
    for category in ("officers", "guardians", "members"):
        people = members.get(category)
        if not isinstance(people, list):
            raise ValueError(f"Members YAML category {category!r} must contain a list.")
        result[category] = []
        for person in people:
            if not isinstance(person, dict) or any(
                not isinstance(person.get(key), str) or not person[key].strip()
                for key in ("name", "tag", "image")
            ):
                raise ValueError(f"Every person in {category!r} needs a name, tag, and image.")
            image = person["image"]
            image_path = Path(image.lstrip("/"))
            resolved_image = (PUBLIC_IMAGE_ROOT.parent / image_path).resolve()
            if (
                not image.startswith("/images/members/")
                or ".." in image_path.parts
                or resolved_image.suffix.lower() not in EVENT_IMAGE_EXTENSIONS
                or not resolved_image.is_relative_to(image_root)
                or not resolved_image.is_file()
            ):
                raise ValueError(f"Member image must be an existing local image under /images/members/: {image!r}.")
            result[category].append({
                "name": person["name"].strip(),
                "role": person["tag"].strip(),
                "image": image,
            })
    return result


@app.get("/api/gallery")
def get_gallery():
    return {"images": GALLERY_IMAGES}


@app.get("/api/slider")
def get_slider():
    return {"images": SLIDER_IMAGES}


def load_events(
    config_path=EVENTS_PATH,
    image_root=EVENT_IMAGE_ROOT,
    public_image_root=PUBLIC_IMAGE_ROOT,
):
    entries = yaml.safe_load(config_path.read_text(encoding="utf-8")) or []
    if not isinstance(entries, list):
        raise ValueError("Events YAML must contain a list of events.")

    events = []
    ids = set()
    for entry in entries:
        if not isinstance(entry, dict):
            raise ValueError("Each event must be a YAML mapping.")

        title = entry.get("title")
        if not isinstance(title, str) or not title.strip():
            raise ValueError("Each event needs a non-empty title.")

        raw_date = entry.get("date")
        try:
            event_date = date.fromisoformat(str(raw_date))
        except (TypeError, ValueError) as error:
            raise ValueError(f"Invalid event date: {raw_date!r}. Use YYYY-MM-DD.") from error
        if event_date.isoformat() != str(raw_date):
            raise ValueError(f"Invalid event date: {raw_date!r}. Use YYYY-MM-DD.")

        generated_id = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
        event_id = str(entry.get("id") or generated_id)
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", event_id) or event_id in ids:
            raise ValueError(f"Missing or duplicate event id: {event_id!r}.")
        ids.add(event_id)

        photos = []
        image = None
        configured_banner = entry.get("banner")
        if configured_banner:
            if not isinstance(configured_banner, str):
                raise ValueError(f"Event banner must be a local image path: {configured_banner!r}.")
            banner_path = Path(str(configured_banner).lstrip("/"))
            banner_file = (public_image_root.parent / banner_path).resolve()
            if (
                not str(configured_banner).startswith("/images/")
                or ".." in banner_path.parts
                or banner_file.suffix.lower() not in EVENT_IMAGE_EXTENSIONS
                or not banner_file.is_relative_to(public_image_root.resolve())
            ):
                raise ValueError(f"Event banner must be a local image under /images/: {configured_banner!r}.")
            if not banner_file.is_file():
                raise ValueError(f"Event banner image does not exist: {configured_banner!r}.")
            image = str(configured_banner)
            photos.append(image)

        image_dir = entry.get("image_dir")
        if image_dir:
            if not isinstance(image_dir, str):
                raise ValueError(f"Event image directory must be a folder path: {image_dir!r}.")
            relative_dir = Path(str(image_dir))
            directory = (image_root / relative_dir).resolve()
            if (
                relative_dir.is_absolute()
                or ".." in relative_dir.parts
                or not relative_dir.parts
                or relative_dir == Path(".")
                or not directory.is_relative_to(image_root.resolve())
            ):
                raise ValueError(f"Event image directory must be inside {image_root}: {image_dir!r}.")
            if directory.exists() and not directory.is_dir():
                raise ValueError(f"Event image path is not a directory: {image_dir!r}.")
            if directory.is_dir():
                files = sorted(
                    (
                        path for path in directory.iterdir()
                        if path.is_file()
                        and path.suffix.lower() in EVENT_IMAGE_EXTENSIONS
                        and path.resolve().is_relative_to(image_root.resolve())
                    ),
                    key=lambda path: path.name.lower(),
                )
                folder_photos = [
                    f"/images/event_images/{relative_dir.as_posix()}/{path.name}"
                    for path in files
                ]
                photos.extend(path for path in folder_photos if path not in photos)
                if image is None:
                    banner = next(
                        (path for path in files if path.stem.lower() in {"banner", "cover"}),
                        None,
                    )
                    if banner is None and files:
                        banner = random.choice(files)
                    if banner:
                        image = f"/images/event_images/{relative_dir.as_posix()}/{banner.name}"

        title_hi = entry.get("title_hi", title)
        summary_en = entry.get("summary", "")
        summary_hi = entry.get("summary_hi", summary_en)
        details_en = entry.get("details", "")
        details_hi = entry.get("details_hi", details_en)
        location_en = entry.get("location", "Rajdah Dham")
        location_hi = entry.get("location_hi", "राजदाह धाम")
        fields = (title_hi, summary_en, summary_hi, details_en, details_hi, location_en, location_hi)
        if any(not isinstance(value, str) for value in fields):
            raise ValueError(f"Event title, summary, details, and location must be text: {event_id!r}.")
        events.append({
            "id": event_id,
            "date": event_date.isoformat(),
            "title": {"en": title.strip(), "hi": title_hi.strip() or title.strip()},
            "summary": {"en": summary_en.strip(), "hi": summary_hi.strip()},
            "details": {"en": details_en.strip(), "hi": details_hi.strip()},
            "location": {"en": location_en.strip(), "hi": location_hi.strip()},
            "image": image,
            "albumTitle": {"en": title.strip(), "hi": title_hi.strip() or title.strip()},
            "photos": photos,
        })
    return events


@app.get("/api/events")
def get_events():
    events = load_events()
    events_by_id = {event["id"]: event for event in events}
    for event in events:
        event["videos"] = []
    for video in get_videos():
        event_id = video.get("eventId")
        if event_id:
            if event_id not in events_by_id:
                raise ValueError(f"Video references an unknown event id: {event_id!r}.")
            events_by_id[event_id]["videos"].append(video["id"])
    return events


@app.get("/api/videos")
def get_videos():
    return load_videos()


def load_videos(config_path=VIDEOS_PATH):
    videos = yaml.safe_load(config_path.read_text(encoding="utf-8")) or []
    if not isinstance(videos, list):
        raise ValueError("Videos YAML must contain a list of videos.")
    result = []
    for video in videos:
        youtube_url = video["youtube_url"]
        video_id = get_youtube_id(youtube_url)
        title = video["title"]
        event_id = video.get("event_id")
        if event_id is not None and not isinstance(event_id, str):
            raise ValueError(f"Video {video_id!r} event_id must be text.")
        if not isinstance(title, dict) or not all(
            isinstance(title.get(language), str) and title[language].strip()
            for language in ("en", "hi")
        ):
            raise ValueError(f"Video {video_id!r} must have English and Hindi titles.")
        result.append({
            "id": video_id,
            "youtubeId": video_id,
            "title": title,
            "youtubeUrl": youtube_url,
            "eventId": event_id,
        })
    return result


# ---------- CONTACT FORM ----------

@app.post("/api/contact/submit")
def submit_contact(submission: ContactSubmission):
    raise HTTPException(
        status_code=501,
        detail="Contact form delivery is not configured.",
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)
