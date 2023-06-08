import aiosqlite
import pytest
import time

from pathlib import Path
from unittest.mock import patch

from jupyter_rtc_test.tests.r4_ypy_store.utils import (
    TestSQLiteYStore, MetadataCallback, TestTempFileYStore
)


@pytest.mark.asyncio
@pytest.mark.parametrize("YStore", (TestTempFileYStore, TestSQLiteYStore))
async def test_ystore(YStore):
    store_name = "my_store"
    ystore = YStore(store_name, metadata_callback=MetadataCallback())
    data = [b"foo", b"bar", b"baz"]
    for d in data:
        await ystore.write(d)
    if YStore == TestTempFileYStore:
        assert (Path(TestTempFileYStore.base_dir) / store_name).exists()
    elif YStore == TestSQLiteYStore:
        assert Path(TestSQLiteYStore.db_path).exists()
    i = 0
    async for d, m, t in ystore.read():
        assert d == data[i]  # data
        assert m == str(i).encode()  # metadata
        i += 1
    assert i == len(data)


@pytest.mark.asyncio
async def test_document_ttl_sqlite_ystore(test_ydoc):
    store_name = "my_store"
    ystore = TestSQLiteYStore(store_name, delete_db=True)
    now = time.time()
    for i in range(3):
        # assert that adding a record before document TTL doesn't delete document history
        with patch("time.time") as mock_time:
            mock_time.return_value = now
            await ystore.write(test_ydoc.update())
            async with aiosqlite.connect(ystore.db_path) as db:
                assert (await (await db.execute("SELECT count(*) FROM yupdates")).fetchone())[
                    0
                ] == i + 1
    # assert that adding a record after document TTL deletes previous document history
    with patch("time.time") as mock_time:
        mock_time.return_value = now + ystore.document_ttl + 1
        await ystore.write(test_ydoc.update())
        async with aiosqlite.connect(ystore.db_path) as db:
            # two updates in DB: one squashed update and the new update
            assert (await (await db.execute("SELECT count(*) FROM yupdates")).fetchone())[0] == 2


@pytest.mark.asyncio
@pytest.mark.parametrize("YStore", (TestTempFileYStore, TestSQLiteYStore))
async def test_version(YStore, caplog):
    store_name = "my_store"
    prev_version = YStore.version
    YStore.version = -1
    ystore = YStore(store_name)
    await ystore.write(b"foo")
    YStore.version = prev_version
    assert "YStore version mismatch" in caplog.text
