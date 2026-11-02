import unittest
from datetime import date, timedelta

from devotional_dates import DAYS_AHEAD, get_upcoming_observances


class DevotionalDateTests(unittest.TestCase):
    def test_upcoming_dates_are_calculated_for_the_requested_year(self):
        today = date(2026, 11, 2)
        observances = get_upcoming_observances(today)

        self.assertTrue(observances)
        self.assertEqual(
            observances,
            sorted(observances, key=lambda item: (item["date"], item["id"])),
        )
        self.assertTrue(
            all(
                today.isoformat()
                <= item["date"]
                <= (today + timedelta(days=DAYS_AHEAD)).isoformat()
                for item in observances
            )
        )
        self.assertTrue(
            any("Ekadashi" in item["title"]["en"] for item in observances)
        )
        self.assertTrue(
            any(
                item["title"]["en"] == "Surya Shashthi / Chhath"
                for item in observances
            )
        )

    def test_generated_observances_include_bilingual_details(self):
        observances = get_upcoming_observances(date(2026, 11, 2))

        for observance in observances:
            self.assertTrue(observance["title"]["en"])
            self.assertTrue(observance["title"]["hi"])
            self.assertTrue(observance["details"]["en"])
            self.assertTrue(observance["details"]["hi"])


if __name__ == "__main__":
    unittest.main()
