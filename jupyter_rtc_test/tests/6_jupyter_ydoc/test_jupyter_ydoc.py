# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

import asyncio
import json

from pathlib import Path

import pytest

from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider

from jupyter_ydoc import YNotebook
from jupyter_ydoc.utils import cast_all
from jupyter_rtc_test.tests.utils import stringify_source


files_dir = Path(__file__).parent / "notebooks"


class Tester:
    def __init__(self, ydoc: YDoc, timeout: float = 1.0):
        self.timeout = timeout
        self.ytest = ydoc.get_map("_test")
        with ydoc.begin_transaction() as t:
            self.ytest.set(t, "clock", 0)

    @property
    def source(self):
        return cast_all(self.ytest["source"], float, int)

    async def change(self):
        change = asyncio.Event()
        def callback(event):
            if "clock" in event.keys:
                change.set()
        self.ytest.observe(callback)
        return await asyncio.wait_for(change.wait(), timeout=self.timeout)


@pytest.mark.asyncio
async def test_plotly(y_ws_server):
    """This test checks in particular that the type cast is not breaking the data."""
    ydoc = YDoc()
    ynotebook = YNotebook(ydoc)
    nb = stringify_source(json.loads((files_dir / "plotly.ipynb").read_text()))
    ynotebook.source = nb
    assert ynotebook.source == nb


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "2", indirect=True)
async def test_simple(y_ws_server, y_ws_client):
    ydoc = YDoc()
    ynotebook = YNotebook(ydoc)
    websocket = await connect("ws://127.0.0.1:1234/my-roomname")
    WebsocketProvider(ydoc, websocket)
    nb = stringify_source(json.loads((files_dir / "simple.ipynb").read_text()))
    ynotebook.source = nb
    tester = Tester(ydoc, 3.0)
    await tester.change()
    assert tester.source == nb
