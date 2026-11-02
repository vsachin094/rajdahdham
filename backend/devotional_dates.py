from datetime import datetime, timedelta
from functools import lru_cache
from zoneinfo import ZoneInfo

import panchanga
from datetime_helper import Date, gregorian_to_jd, utc_offset_hours
from festival_rules import DayRecord, FESTIVAL_RULES, ekadashi_dates_from_records, select_dates_for_rule


TIMEZONE = "Asia/Kolkata"
LATITUDE = 24.1545854
LONGITUDE = 85.9191847
DAYS_AHEAD = 365

OBSERVANCE_DETAILS = {
    "Akshaya Tritiya": (
        "A widely observed day for worship, charity and other auspicious beginnings.",
        "पूजा, दान और शुभ कार्यों के लिए व्यापक रूप से मनाया जाने वाला दिन।",
    ),
    "Deepavali": (
        "The festival of lights, marked by prayers and the triumph of light over darkness.",
        "दीपों का पर्व, जिसमें पूजा और अंधकार पर प्रकाश की विजय का उत्सव मनाया जाता है।",
    ),
    "Durga Ashtami": (
        "A Navaratri observance dedicated to worship of Maa Durga.",
        "नवरात्रि का दिन, जो मां दुर्गा की उपासना को समर्पित है।",
    ),
    "Ganesha Chaturthi": (
        "A festival celebrating the birth of Lord Ganesha.",
        "भगवान गणेश के जन्मोत्सव का पर्व।",
    ),
    "Guru Purnima": (
        "A day to honour spiritual teachers and the guru tradition.",
        "गुरुओं और गुरु-परंपरा के सम्मान का दिन।",
    ),
    "Hanuman Jayanti": (
        "A devotional observance celebrating Lord Hanuman.",
        "भगवान हनुमान की जयंती का भक्तिपूर्ण पर्व।",
    ),
    "Janmashtami": (
        "A festival celebrating the birth of Lord Krishna.",
        "भगवान श्रीकृष्ण के जन्मोत्सव का पर्व।",
    ),
    "Kama Dahana (Holi)": (
        "Holi, the festival of colours, welcoming spring and celebrating devotion.",
        "होली का पर्व, जो वसंत के आगमन और भक्ति के उत्सव से जुड़ा है।",
    ),
    "Mahalaya Amavasya": (
        "A day of remembrance and prayers for ancestors before Navaratri.",
        "नवरात्रि से पहले पितरों के स्मरण और प्रार्थना का दिन।",
    ),
    "Makara Sankranti": (
        "A solar observance marking the Sun's transition into Makara.",
        "सूर्य के मकर राशि में प्रवेश से जुड़ा सौर पर्व।",
    ),
    "Maha Shivaratri": (
        "A night of devotion to Lord Shiva, observed with worship and prayer.",
        "भगवान शिव की उपासना और प्रार्थना की रात्रि।",
    ),
    "Rama Navami": (
        "A festival celebrating the birth of Lord Rama.",
        "भगवान श्रीराम के जन्मोत्सव का पर्व।",
    ),
    "Raksha Bandhan": (
        "A festival celebrating the bond of care and affection between siblings.",
        "भाई-बहन के स्नेह और रक्षा के बंधन का पर्व।",
    ),
    "Surya Shashthi / Chhath": (
        "Chhath Puja honours Surya and Chhathi Maiya with prayers at sunrise and sunset.",
        "छठ पूजा में सूर्योदय और सूर्यास्त के समय सूर्यदेव और छठी मैया की उपासना की जाती है।",
    ),
    "Vijayadashami": (
        "The culmination of Navaratri, associated with the victory of good over evil.",
        "नवरात्रि का समापन पर्व, जो अधर्म पर धर्म की विजय का प्रतीक है।",
    ),
}

OBSERVANCE_TITLES_HI = {
    "Akshaya Tritiya": "अक्षय तृतीया",
    "Deepavali": "दीपावली",
    "Durga Ashtami": "दुर्गाष्टमी",
    "Ganesha Chaturthi": "गणेश चतुर्थी",
    "Guru Purnima": "गुरु पूर्णिमा",
    "Hanuman Jayanti": "हनुमान जयंती",
    "Janmashtami": "जन्माष्टमी",
    "Kama Dahana (Holi)": "होली",
    "Mahalaya Amavasya": "महालया अमावस्या",
    "Makara Sankranti": "मकर संक्रांति",
    "Maha Shivaratri": "महाशिवरात्रि",
    "Rama Navami": "राम नवमी",
    "Raksha Bandhan": "रक्षाबंधन",
    "Surya Shashthi / Chhath": "सूर्य षष्ठी / छठ पूजा",
    "Vijayadashami": "विजयादशमी",
}

ENABLED_FESTIVALS = frozenset(OBSERVANCE_DETAILS)
FESTIVAL_RULES_BY_NAME = {rule.name: rule for rule in FESTIVAL_RULES}


def _engine_date(value):
    return Date(value.year, value.month, value.day)


def _daily_records(first, last):
    records = []
    current = first
    with panchanga.using_coordinate_selection("citra"):
        while current <= last:
            julian_day = gregorian_to_jd(current)
            offset = utc_offset_hours(TIMEZONE, current, LONGITUDE)
            place = panchanga.Place(LATITUDE, LONGITUDE, offset)
            tithi_number = panchanga.tithi(julian_day, place)[0]
            masa_number, is_adhika = panchanga.masa(
                julian_day,
                place,
                amanta=True,
                tithi_number=tithi_number,
            )
            tithi = (
                f"S{tithi_number}"
                if tithi_number <= 15
                else f"K{tithi_number - 15}"
            )
            masa = f"A{masa_number}" if is_adhika else str(masa_number)
            records.append(
                DayRecord(
                    current,
                    tithi,
                    panchanga.nakshatra(julian_day, place)[0],
                    panchanga.yoga(julian_day, place)[0],
                    masa,
                    is_adhika,
                    panchanga.sunrise(julian_day, place),
                )
            )
            current += 1
    return records


@lru_cache(maxsize=2)
def _calculate_observances(start_date):
    end_date = start_date + timedelta(days=DAYS_AHEAD)
    first = _engine_date(start_date - timedelta(days=3))
    last = _engine_date(end_date + timedelta(days=3))
    records = _daily_records(first, last)
    target_dates = {
        record.civil_date
        for record in records
        if _engine_date(start_date) <= record.civil_date <= _engine_date(end_date)
    }
    geopos = (LONGITUDE, LATITUDE, 0.0)
    entries = []

    for festival_name in ENABLED_FESTIVALS:
        rule = FESTIVAL_RULES_BY_NAME[festival_name]
        for observance_date in select_dates_for_rule(
            rule,
            records,
            geopos=geopos,
            timezone_name=TIMEZONE,
        ):
            if observance_date in target_dates:
                details_en, details_hi = OBSERVANCE_DETAILS[festival_name]
                entries.append({
                    "id": f"{observance_date.year}-{observance_date.month:02}-{observance_date.day:02}-{festival_name}",
                    "date": f"{observance_date.year:04}-{observance_date.month:02}-{observance_date.day:02}",
                    "title": {
                        "en": festival_name,
                        "hi": OBSERVANCE_TITLES_HI[festival_name],
                    },
                    "details": {"en": details_en, "hi": details_hi},
                })

    records_by_date = {record.civil_date: record for record in records}
    for observance_date in ekadashi_dates_from_records(records):
        if observance_date not in target_dates:
            continue
        paksha = "Shukla Paksha" if records_by_date[observance_date].tithi.startswith("S") else "Krishna Paksha"
        paksha_hi = "शुक्ल पक्ष" if paksha == "Shukla Paksha" else "कृष्ण पक्ष"
        entries.append({
            "id": f"{observance_date.year}-{observance_date.month:02}-{observance_date.day:02}-ekadashi",
            "date": f"{observance_date.year:04}-{observance_date.month:02}-{observance_date.day:02}",
            "title": {
                "en": f"Ekadashi ({paksha})",
                "hi": f"एकादशी ({paksha_hi})",
            },
            "details": {
                "en": "Many devotees observe a fast and offer prayers to Lord Vishnu on Ekadashi.",
                "hi": "एकादशी पर अनेक श्रद्धालु व्रत रखते हैं और भगवान विष्णु की पूजा करते हैं।",
            },
        })

    return sorted(entries, key=lambda entry: (entry["date"], entry["id"]))


def get_upcoming_observances(today=None):
    local_today = today or datetime.now(ZoneInfo(TIMEZONE)).date()
    return _calculate_observances(local_today)
