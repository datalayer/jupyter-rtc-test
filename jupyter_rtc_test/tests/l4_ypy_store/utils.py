import asyncio
import os
import tempfile

from pathlib import Path

from ypy_websocket.ystore import SQLiteYStore, TempFileYStore


MY_SQLITE_YSTORE_DB_PATH = str(Path(tempfile.mkdtemp(prefix="test_sql_")) / "ystore.db")


class MetadataCallback:
    def __init__(self):
        self.i = 0

    def __call__(self):
        future = asyncio.Future()
        future.set_result(str(self.i).encode())
        self.i += 1
        return future


class TestTempFileYStore(TempFileYStore):
    prefix_dir = "test_temp_"


class TestSQLiteYStore(SQLiteYStore):
    db_path = MY_SQLITE_YSTORE_DB_PATH
    document_ttl = 1000

    def __init__(self, *args, delete_db=False, **kwargs):
        if delete_db:
            os.remove(self.db_path)
        super().__init__(*args, **kwargs)

