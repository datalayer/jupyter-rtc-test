from __future__ import annotations

from datetime import datetime
from typing import Any

from jupyter_server import _tz as tz


class TestFileIDManager:
    def __init__(self, mapping: dict[str, str]):
        self.mapping = mapping

    def get_path(self, id: str) -> str:
        return self.mapping[id]


class TestContentsManager:
    def __init__(self, model: dict):
        self.model = {
            "name": "",
            "path": "",
            "last_modified": datetime(1970, 1, 1, 0, 0, tzinfo=tz.UTC),
            "created": datetime(1970, 1, 1, 0, 0, tzinfo=tz.UTC),
            "content": None,
            "format": None,
            "mimetype": None,
            "size": 0,
            "writable": False,
        }
        self.model.update(model)

    def get(
        self, path: str, content: bool = True, format: str | None = None, type: str | None = None
    ) -> dict:
        return self.model

    def save_content(self, model: dict[str, Any], path: str) -> dict:
        return self.model

