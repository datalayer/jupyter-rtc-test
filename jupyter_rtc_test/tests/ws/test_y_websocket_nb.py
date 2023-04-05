# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

import asyncio
import json
from pathlib import Path

import pytest
from websockets import connect  # type: ignore

import y_py as Y
from ypy_websocket import WebsocketProvider

from jupyter_ydoc import YNotebook
from jupyter_ydoc.utils import cast_all


files_dir = Path(__file__).parent / "_files"


def stringify_source(nb: dict) -> dict:
    """Stringify in-place the cell sources."""
    for cell in nb["cells"]:
        cell["source"] = (
            "".join(cell["source"]) if isinstance(cell["source"], list) else cell["source"]
        )
    return nb


class YTest:
    def __init__(self, ydoc: Y.YDoc, timeout: float = 1.0):
        self.timeout = timeout
        self.ytest = ydoc.get_map("_test")
        with ydoc.begin_transaction() as t:
            self.ytest.set(t, "clock", 0)

    async def change(self):
        change = asyncio.Event()

        def callback(event):
            if "clock" in event.keys:
                change.set()

        self.ytest.observe(callback)
        return await asyncio.wait_for(change.wait(), timeout=self.timeout)

    @property
    def source(self):
        return cast_all(self.ytest["source"], float, int)


@pytest.mark.asyncio
@pytest.mark.parametrize("yjs_client", "0", indirect=True)
async def test_ypy_yjs_0(yws_server, yjs_client):
    ydoc = Y.YDoc()
    ytest = YTest(ydoc)
    websocket = await connect("ws://localhost:1234/my-roomname")
    WebsocketProvider(ydoc, websocket)
    ymap = ydoc.get_map("map")
    # set a value in "in"
    for v_in in range(10):
        with ydoc.begin_transaction() as t:
            ymap.set(t, "in", float(v_in))
        ytest.run_clock()
        await ytest.clock_run()
        v_out = ymap["out"]
        assert v_out == v_in + 1.0


@pytest.mark.asyncio
@pytest.mark.parametrize("yjs_client", "1", indirect=True)
async def test_ypy_yjs_1(yws_server, yjs_client):
    # wait for the JS client to connect
    tt, dt = 0, 0.1
    while True:
        await asyncio.sleep(dt)
        if "/my-roomname" in yws_server.rooms:
            break
        tt += dt
        if tt >= 1:
            raise RuntimeError("Timeout waiting for client to connect")
    ydoc = yws_server.rooms["/my-roomname"].ydoc
    ytest = YTest(ydoc)
    ytest.run_clock()
    await ytest.clock_run()
    ycells = ydoc.get_array("cells")
    ystate = ydoc.get_map("state")
    assert json.loads(ycells.to_json()) == [{"metadata": {"foo": "bar"}, "source": "1 + 2"}]
    assert json.loads(ystate.to_json()) == {"state": {"dirty": False}}
    

@pytest.mark.asyncio
@pytest.mark.parametrize("yjs_client", "notebook", indirect=True)
async def test_ypy_yjs_0(yws_server, yjs_client):
    ydoc = Y.YDoc()
    ynotebook = YNotebook(ydoc)
    websocket = connect("ws://localhost:1234/my-roomname")
    WebsocketProvider(ydoc, websocket)
    nb = stringify_source(json.loads((files_dir / "nb0.ipynb").read_text()))
    ynotebook.source = nb
    ytest = YTest(ydoc)
    ytest.change()
    assert ytest.source == nb


def test_plotly_renderer():
    """This test checks in particular that the type cast is not breaking the data."""
    ydoc = Y.YDoc()
    ynotebook = YNotebook(ydoc)
    nb = stringify_source(json.loads((files_dir / "plotly_renderer.ipynb").read_text()))
    ynotebook.source = nb
    assert ynotebook.source == nb
