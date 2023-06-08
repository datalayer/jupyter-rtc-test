import json

from pathlib import Path

import pytest

from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider

from jupyter_ydoc import YNotebook
from jupyter_rtc_test.tests.utils import stringify_source
from jupyter_rtc_test.tests.r6_jupyter_ydoc.utils import Tester


notebooks_dir = Path(__file__).parent / "notebooks"


@pytest.mark.asyncio
async def test_plotly(y_ws_server):
    """This test checks in particular that the type cast is not breaking the data."""
    ydoc = YDoc()
    ynotebook = YNotebook(ydoc)
    nb = stringify_source(json.loads((notebooks_dir / "plotly.ipynb").read_text()))
    ynotebook.source = nb
    assert ynotebook.source == nb


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "2", indirect=True)
async def test_simple(y_ws_server, y_ws_client):
    ydoc = YDoc()
    ynotebook = YNotebook(ydoc)
    websocket = await connect("ws://127.0.0.1:1234/my-roomname")
    WebsocketProvider(ydoc, websocket)
    nb = stringify_source(json.loads((notebooks_dir / "simple.ipynb").read_text()))
    ynotebook.source = nb
    tester = Tester(ydoc, 3.0)
    await tester.clock_has_changed()
    assert tester.source == nb
