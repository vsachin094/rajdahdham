import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from app import (
    get_members,
    get_visitor_count,
    increment_visitor_count,
    load_events,
    load_videos,
    serve_frontend,
)


class EventRegistryTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name)
        self.config_path = self.root / "events.yaml"
        self.image_root = self.root / "event_images"
        self.image_root.mkdir()

    def tearDown(self):
        self.temporary_directory.cleanup()

    def load_config(self, content):
        self.config_path.write_text(content, encoding="utf-8")
        return load_events(self.config_path, self.image_root)

    def test_visitor_counter_increments_and_returns_current_count(self):
        previous_count = get_visitor_count()["count"]

        self.assertEqual(
            increment_visitor_count(),
            {"count": previous_count + 1},
        )
        self.assertEqual(get_visitor_count(), {"count": previous_count + 1})

    def test_event_without_images_uses_title_and_optional_details(self):
        (self.image_root / "maha-shivratri").mkdir()
        [event] = self.load_config(
            '- date: "2027-02-15"\n'
            "  title: Maha Shivratri\n"
            "  title_hi: महाशिवरात्रि\n"
            "  details: Evening puja and bhajan.\n"
            "  image_dir: maha-shivratri\n"
        )

        self.assertEqual(event["id"], "maha-shivratri")
        self.assertEqual(event["title"], {"en": "Maha Shivratri", "hi": "महाशिवरात्रि"})
        self.assertEqual(event["details"]["en"], "Evening puja and bhajan.")
        self.assertIsNone(event["image"])
        self.assertEqual(event["photos"], [])

    def test_images_select_banner_and_include_album_files(self):
        event_directory = self.image_root / "maha-shivratri"
        event_directory.mkdir()
        (event_directory / "banner.jpg").touch()
        (event_directory / "photo-01.png").touch()
        (event_directory / "notes.txt").touch()
        (event_directory / "a-first.jpg").touch()

        [event] = self.load_config(
            '- date: "2027-02-15"\n'
            "  title: Maha Shivratri\n"
            "  image_dir: maha-shivratri\n"
        )

        self.assertEqual(
            event["image"],
            "/images/event_images/maha-shivratri/banner.jpg",
        )
        self.assertEqual(
            event["photos"],
            [
                "/images/event_images/maha-shivratri/a-first.jpg",
                "/images/event_images/maha-shivratri/banner.jpg",
                "/images/event_images/maha-shivratri/photo-01.png",
            ],
        )

    def test_selects_random_folder_photo_as_banner_and_keeps_all_photos(self):
        event_directory = self.image_root / "maha-shivratri"
        event_directory.mkdir()
        (event_directory / "photo-01.jpg").touch()
        (event_directory / "photo-02.jpg").touch()

        with patch("app.random.choice", return_value=event_directory / "photo-02.jpg"):
            [event] = self.load_config(
                '- date: "2027-02-15"\n'
                "  title: Maha Shivratri\n"
                "  image_dir: maha-shivratri\n"
            )

        self.assertEqual(
            event["image"],
            "/images/event_images/maha-shivratri/photo-02.jpg",
        )
        self.assertEqual(
            event["photos"],
            [
                "/images/event_images/maha-shivratri/photo-01.jpg",
                "/images/event_images/maha-shivratri/photo-02.jpg",
            ],
        )

    def test_configured_local_banner_is_used_with_event_photos(self):
        event_directory = self.image_root / "maha-shivratri"
        event_directory.mkdir()
        (event_directory / "photo-01.jpg").touch()
        public_images = self.root / "public" / "images"
        (public_images / "site").mkdir(parents=True)
        (public_images / "site" / "banner.jpg").touch()

        self.config_path.write_text(
            '- date: "2027-02-15"\n'
            "  title: Maha Shivratri\n"
            "  banner: /images/site/banner.jpg\n"
            "  image_dir: maha-shivratri\n",
            encoding="utf-8",
        )
        [event] = load_events(
            self.config_path,
            self.image_root,
            self.root / "public" / "images",
        )

        self.assertEqual(event["image"], "/images/site/banner.jpg")
        self.assertIn("/images/site/banner.jpg", event["photos"])

    def test_title_and_date_work_without_optional_fields(self):
        [event] = self.load_config(
            '- date: "2027-02-15"\n'
            "  title: Maha Shivratri\n"
        )

        self.assertEqual(event["title"], {"en": "Maha Shivratri", "hi": "Maha Shivratri"})
        self.assertEqual(event["details"], {"en": "", "hi": ""})
        self.assertIsNone(event["image"])
        self.assertEqual(event["photos"], [])

    def test_existing_event_registry_uses_single_yaml_source(self):
        from app import EVENTS_PATH, EVENT_IMAGE_ROOT, load_events as load_registry

        [event] = load_registry(EVENTS_PATH, EVENT_IMAGE_ROOT)

        self.assertEqual(event["id"], "nature-park-inauguration")
        self.assertEqual(event["image"], "/images/site/raj-dah-nature-park-sign.jpg")
        self.assertEqual(len(event["photos"]), 9)

    def test_rejects_image_directory_traversal(self):
        with self.assertRaisesRegex(ValueError, "must be inside"):
            self.load_config(
                '- date: "2027-02-15"\n'
                "  title: Maha Shivratri\n"
                "  image_dir: ../outside\n"
            )

    def test_rejects_invalid_dates(self):
        with self.assertRaisesRegex(ValueError, "YYYY-MM-DD"):
            self.load_config(
                ' - date: "15-02-2027"\n'
                "   title: Maha Shivratri\n"
            )

    def test_video_can_be_associated_with_an_event(self):
        videos_path = self.root / "videos.yaml"
        videos_path.write_text(
            "- title:\n"
            "    en: Maha Shivratri\n"
            "    hi: महाशिवरात्रि\n"
            "  youtube_url: https://www.youtube.com/watch?v=abc123def45\n"
            "  event_id: maha-shivratri\n",
            encoding="utf-8",
        )

        [video] = load_videos(videos_path)

        self.assertEqual(video["eventId"], "maha-shivratri")
        self.assertEqual(video["youtubeId"], "abc123def45")


class MembersYamlTests(unittest.TestCase):
    def test_member_records_load_from_yaml_with_local_portraits(self):
        groups = get_members()

        self.assertEqual(set(groups), {"officers", "guardians", "members"})
        self.assertEqual([len(groups[group]) for group in ("officers", "guardians", "members")], [5, 5, 5])
        for people in groups.values():
            for person in people:
                self.assertTrue(person["name"])
                self.assertTrue(person["role"])
                self.assertTrue(person["image"].startswith("/images/members/"))


class FrontendServingTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.build_root = Path(self.temporary_directory.name)
        (self.build_root / "index.html").write_text("<main>Rajdah Dham</main>", encoding="utf-8")
        (self.build_root / "static").mkdir()
        (self.build_root / "static" / "app.js").write_text("window.app = true;", encoding="utf-8")

    def tearDown(self):
        self.temporary_directory.cleanup()

    def test_client_side_routes_serve_frontend_entry_point(self):
        with patch("app.FRONTEND_BUILD_ROOT", self.build_root):
            response = serve_frontend("about")

        self.assertEqual(Path(response.path).resolve(), (self.build_root / "index.html").resolve())

    def test_existing_frontend_assets_are_served_directly(self):
        with patch("app.FRONTEND_BUILD_ROOT", self.build_root):
            response = serve_frontend("static/app.js")

        self.assertEqual(
            Path(response.path).resolve(),
            (self.build_root / "static" / "app.js").resolve(),
        )

    def test_missing_asset_and_unknown_api_paths_remain_not_found(self):
        with patch("app.FRONTEND_BUILD_ROOT", self.build_root):
            with self.assertRaises(HTTPException) as missing_asset:
                serve_frontend("static/missing.js")
            with self.assertRaises(HTTPException) as unknown_api:
                serve_frontend("api/not-a-route")

        self.assertEqual(missing_asset.exception.status_code, 404)
        self.assertEqual(unknown_api.exception.status_code, 404)

    def test_frontend_path_traversal_is_not_served(self):
        with patch("app.FRONTEND_BUILD_ROOT", self.build_root):
            with self.assertRaises(HTTPException) as traversal:
                serve_frontend("../outside.html")

        self.assertEqual(traversal.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()
